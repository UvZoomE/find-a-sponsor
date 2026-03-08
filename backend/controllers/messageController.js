// backend/controllers/messageController.js
const { Resend } = require("resend");
const Sponsor = require("../models/Sponsor");

const resend = new Resend(process.env.RESEND_API_KEY);

// @desc    Send a message to a sponsor
// @route   POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { sponsorId, senderName, senderEmail, message } = req.body;

    // 1. Find the sponsor in the database securely
    const sponsor = await Sponsor.findById(sponsorId);
    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    // 2. Format and send the email via Resend
    // Note: Use 'onboarding@resend.dev' for the 'from' address until you verify a custom domain.
    const data = await resend.emails.send({
      from: "Find A Sponsor <onboarding@resend.dev>",
      to: sponsor.email, // Pulling securely from MongoDB!
      subject: `New Sponsee Request from ${senderName}`,
      html: `
        <h2>You have a new message from Find A Sponsor!</h2>
        <p><strong>From:</strong> ${senderName}</p>
        <p><strong>Reply-to Email:</strong> ${senderEmail}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
        <hr />
        <p><small>To reply to this person, simply email them directly at ${senderEmail}.</small></p>
      `,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error sending message:", error);
    res
      .status(500)
      .json({ message: "Failed to send message", error: error.message });
  }
};

module.exports = { sendMessage };
