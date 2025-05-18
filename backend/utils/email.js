const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendWelcomeEmail(email, firstName, lastName) {
  try {
    const result = await resend.emails.send({
      from: "Tourisla <tourisla@tourisla.space>",
      to: email,
      subject: "Welcome to Tourisla!",
      html: `
          <html>
            <body>
              <h1>Welcome to Tourisla, ${firstName} ${lastName} !</h1>
              <p>Thank you for signing up. We are excited to have you on board!</p>
            </body>
          </html>
        `,
    });
    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

const sendResetPasswordEmail = async (email, resetLink) => {
  try {
    const result = await resend.emails.send({
      from: "Tourisla <tourisla@tourisla.space>",
      to: email,
      subject: "Password Reset Request",
      html: `
            <html>
                <body>
                    <h1>Password Reset Request</h1>
                    <p>Click the link below to reset your password:</p>
                    <a href="${resetLink}">Reset Password</a>
                </body>
            </html>
        `,
    });
    console.log("Password reset email sent successfully:", result);
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

module.exports = { sendWelcomeEmail, sendResetPasswordEmail };
