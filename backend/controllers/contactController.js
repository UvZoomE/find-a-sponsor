// backend/controllers/contactController.js
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const personalEmail = process.env.PERSONAL_EMAIL;

const submitContactForm = async (req, res) => {
  try {
    const { name, email, issueType, message } = req.body;

    const { data, error } = await resend.emails.send({
      from: "Find A Sponsor <noreply@findasponsor.net>", // Your verified domain
      to: personalEmail, // 🔴 Put your real personal email here!
      reply_to: email, // This is the magic trick that lets you reply directly to the user
      subject: `[${issueType}] New message from ${name}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>New Support Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Issue Type:</strong> ${issueType}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return res.status(400).json({ message: "Failed to send message." });
    }

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { submitContactForm };
