const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendWelcomeMail = async (email, name) => {
  const info = await transporter.sendMail({
    from: `"HomeFeast" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to HomeFeast 🎉",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
      ">
        <h1 style="color: #f97316;">
          Welcome to HomeFeast 🎉
        </h1>

        <p>Hi ${name || "there"},</p>

        <p>
          Your HomeFeast account has been successfully
          created using your Google account.
        </p>

        <p>
          You can now discover verified home cooks,
          order homemade meals, and manage your
          subscriptions.
        </p>

        <p>
          We're happy to have you with us!
        </p>

        <p>
          <strong>— HomeFeast Team</strong>
        </p>
      </div>
    `,
  });

  console.log("Welcome email sent successfully!");
  console.log("Message ID:", info.messageId);
};

module.exports = {
  sendWelcomeMail,
};
