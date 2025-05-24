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
        <body style="font-family: Arial, sans-serif; background: #f8f9fa; margin:0; padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; padding: 40px 0;">
          <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
            <tr>
              <td align="center" style="padding-bottom: 24px;">
              <img src="https://tourisla.space/logo.png" alt="Tourisla Logo" width="80" style="display:block; margin-bottom:16px;" />
              <h1 style="color: #2a7ae4; margin: 0 0 8px 0; font-size: 28px;">Welcome to Tourisla, ${firstName} ${lastName}!</h1>
              </td>
            </tr>
            <tr>
              <td style="color: #333; font-size: 16px; line-height: 1.6; padding-bottom: 24px;">
              <p style="margin: 0 0 16px 0;">Thank you for signing up. We are excited to have you on board!</p>
              <p style="margin: 0;">Explore amazing destinations and experiences with us.</p>
              </td>
            </tr>
            <tr>
              <td align="center">
              <a href="https://tourisla.space" style="display:inline-block; background: #2a7ae4; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 4px; font-size: 16px;">Get Started</a>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 32px; color: #888; font-size: 12px;" align="center">
              &copy; ${new Date().getFullYear()} Tourisla. All rights reserved.
              </td>
            </tr>
            </table>
          </td>
          </tr>
        </table>
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
      <body style="font-family: Arial, sans-serif; background: #f8f9fa; margin:0; padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; padding: 40px 0;">
        <tr>
          <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
            <tr>
            <td align="center" style="padding-bottom: 24px;">
              <img src="https://tourisla.space/logo.png" alt="Tourisla Logo" width="80" style="display:block; margin-bottom:16px;" />
              <h1 style="color: #2a7ae4; margin: 0 0 8px 0; font-size: 24px;">Password Reset Request</h1>
            </td>
            </tr>
            <tr>
            <td style="color: #333; font-size: 16px; line-height: 1.6; padding-bottom: 24px;">
              <p style="margin: 0 0 16px 0;">We received a request to reset your password.</p>
              <p style="margin: 0 0 16px 0;">Click the button below to reset your password. If you did not request this, please ignore this email.</p>
            </td>
            </tr>
            <tr>
            <td align="center" style="padding-bottom: 24px;">
              <a href="${resetLink}" style="display:inline-block; background: #2a7ae4; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 4px; font-size: 16px;">Reset Password</a>
            </td>
            </tr>
            <tr>
            <td style="color: #888; font-size: 12px;" align="center">
              If the button doesn't work, copy and paste this link into your browser:<br/>
              <a href="${resetLink}" style="color: #2a7ae4;">${resetLink}</a>
            </td>
            </tr>
            <tr>
            <td style="padding-top: 32px; color: #888; font-size: 12px;" align="center">
              &copy; ${new Date().getFullYear()} Tourisla. All rights reserved.
            </td>
            </tr>
          </table>
          </td>
        </tr>
        </table>
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
