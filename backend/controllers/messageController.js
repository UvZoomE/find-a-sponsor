// backend/controllers/messageController.js
const { Resend } = require('resend');
const Sponsor = require('../models/Sponsor');

// Initialize Resend with your API key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

// @desc    Send a message from a sponsee to a sponsor
// @route   POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { sponsorId, senderName, senderEmail, message } = req.body;

    // 1. Find the sponsor in the database to get their private email
    const sponsor = await Sponsor.findById(sponsorId);
    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }

    // 2. Format the custom HTML email
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #2b6cb0;">New Sponsorship Request!</h2>
        <p>Hello ${sponsor.name},</p>
        <p>Someone has found your profile on the directory and is interested in connecting with you about sponsorship.</p>
        
        <div style="background-color: #f7fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin-top: 0;"><strong>From:</strong> ${senderName}</p>
          <p><strong>Email:</strong> ${senderEmail}</p>
          <p style="margin-bottom: 4px;"><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; margin-top: 0; color: #4a5568;">${message}</p>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        
        <p style="font-size: 15px;">
          <strong>Next Steps:</strong> Please reach out to ${senderName} directly at <a href="mailto:${senderEmail}" style="color: #2b6cb0;">${senderEmail}</a> to let them know if you are interested and available to sponsor them or not.
        </p>
        
        <p style="color: #718096; font-size: 13px; margin-top: 32px;">
          Sent securely via Find A Sponsor. Your email address was not shared with the sender.
        </p>
      </div>
    `;

    // Make sure to update the reply_to field here as well!
    const data = await resend.emails.send({
      from: 'Find A Sponsor <onboarding@resend.dev>', 
      to: sponsor.email, 
      reply_to: senderEmail, // <-- Updated here!
      subject: `Sponsorship Request from ${senderName}`, // <-- Updated here!
      html: emailHtml
    });

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};

module.exports = { sendMessage };
