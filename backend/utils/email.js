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

const sendIslandEntryEmail = async (email, uniqueCode, qrCodeUrl) => {
  try {
    const result = await resend.emails.send({
      from: "Tourisla <tourisla@tourisla.space>",
      to: email,
      subject: "Your Island Entry Registration",
      html: `
      <html>
      <body style="font-family: Arial, sans-serif; background: #f8f9fa; margin:0; padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <h1 style="color: #2a7ae4; margin: 0 0 8px 0; font-size: 28px;">Island Entry Registration</h1>
                  </td>
                </tr>
                <tr>
                  <td style="color: #333; font-size: 16px; line-height: 1.6; padding-bottom: 24px;">
                    <p style="margin: 0 0 16px 0;">Thank you for registering for your island entry.</p>
                    <p style="margin: 0;">Your unique code is:</p>
                    <p style="font-weight: bold; font-size: 20px;">${uniqueCode}</p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <img src="${qrCodeUrl}" alt="QR Code" class="my-4 w-40 h-40" style="width:160px; height:160px;" />
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
    console.log("Island entry email sent successfully:", result);
  } catch (error) {
    console.error("Error sending island entry email:", error);
  }
};

async function sendDocumentApproveEmail(email, documentName, documentImage) {
  try {
    const result = await resend.emails.send({
      from: "Tourisla <tourisla@tourisla.space>",
      to: email,
      subject: "Document Approved",
      html: `
      <html>
      <body style="font-family: Arial, sans-serif; background: #f8f9fa; margin:0; padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <h1 style="color: #2a7ae4; margin: 0 0 8px 0; font-size: 28px;">Document Approved</h1>
                  </td>
                </tr>
                <tr>
                  <td style="color: #333; font-size: 16px; line-height: 1.6; padding-bottom: 24px;">
                    <p style="margin: 0 0 16px 0;">Congratulations! Your document has been approved.</p>
                    <p style="margin: 0;">Document Name:</p>
                    <p style="font-weight: bold; font-size: 20px;">${documentName}</p>
                    <img src="${documentImage}" alt="Document Image" class="my-4 w-40 h-40" style="width:160px; height:160px;" />
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
    console.log("Document approval email sent successfully:", result);
  } catch (error) {
    console.error("Error sending document approval email:", error);
  }
}

async function sendDocumentRejectEmail(
  email,
  documentName,
  documentImage,
  reason
) {
  try {
    const result = await resend.emails.send({
      from: "Tourisla <tourisla@tourisla.space>",
      to: email,
      subject: "Document Rejected",
      html: `
      <html>
      <body style="font-family: Arial, sans-serif; background: #f8f9fa; margin:0; padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <h1 style="color: #e74c3c; margin: 0 0 8px 0; font-size: 28px;">Document Rejected</h1>
                  </td>
                </tr>
                <tr>
                  <td style="color: #333; font-size: 16px; line-height: 1.6; padding-bottom: 24px;">
                    <p style="margin: 0 0 16px 0;">We regret to inform you that your document has been rejected.</p>
                    <p style="margin: 0;">Document Name:</p>
                    <p style="font-weight: bold; font-size: 20px;">${documentName}</p>
                    <img src="${documentImage}" alt="Document Image" class="my-4 w-40 h-40" style="width:160px; height:160px;" />
                  </td>
                </tr>
                <tr>
                  <td style="color: #333; font-size: 15px; line-height: 1.6; padding-bottom: 24px;">
                    <strong>Possible reasons for rejection:</strong>
                    <ul style="margin: 8px 0 0 18px; padding: 0; color: #e74c3c;">
                      <li>${reason}</li>
                    </ul>
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
    console.log("Document rejection email sent successfully:", result);
  } catch (error) {
    console.error("Error sending document rejection email:", error);
  }
}

async function sendDocumentRevokeEmail(
  email,
  documentName,
  documentImage,
  reason
) {
  try {
    const result = await resend.emails.send({
      from: "Tourisla <tourisla@tourisla.space>",
      to: email,
      subject: "Document Revoked",
      html: `
      <html>
      <body style="font-family: Arial, sans-serif; background: #f8f9fa; margin:0; padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <h1 style="color: #e74c3c; margin: 0
                    0 8px 0; font-size: 28px;">Document Revoked</h1>
                  </td>
                </tr>
                <tr>
                  <td style="color: #333; font-size: 16px; line-height: 1.6; padding-bottom: 24px;">
                    <p style="margin: 0 0 16px 0;">We regret to inform you that your document has been revoked.</p>
                    <p style="margin: 0;">Document Name:</p>
                    <p style="font-weight: bold; font-size: 20px;">${documentName}</p>
                    <img src="${documentImage}" alt="Document Image" class="my-4 w-40 h-40" style="width:160px; height:160px;" />
                  </td>
                </tr>
                <tr>
                  <td style="color: #333; font-size: 15px; line-height: 1.6; padding-bottom: 24px;">
                    <strong>Reason for revocation:</strong>
                    <p style="margin: 8px 0 0 0; color:
#e74c3c;">${reason}</p>
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
    console.log("Document revocation email sent successfully:", result);
  } catch (error) {
    console.error("Error sending document revocation email:", error);
  }
}

const sendApprovalEmail = async (email, name) => {
  try {
    const result = await resend.emails.send({
      from: "Tourisla <tourisla@tourisla.space>",
      to: email,
      subject: "Your Application Has Been Approved",
      html: `
      <html>
      <body style="font-family: Arial, sans-serif; background: #f8f9fa; margin:0; padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <h1 style="color: #2a7ae4; margin: 0 0 8px 0; font-size: 28px;">Application Approved</h1>
                  </td>
                </tr>
                <tr>
                  <td style="color: #333; font-size: 16px; line-height: 1.6; padding-bottom: 24px;">
                    <p style="margin: 0;">Dear ${name},</p>
                    <p style="margin: 16px 0;">Congratulations! Your application has been approved.</p>
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
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
};

const sendRejectionEmail = async (email, name) => {
  try {
    const result = await resend.emails.send({
      from: "Tourisla <tourisla@tourisla.space>",
      to: email,
      subject: "Your Application Has Been Rejected",
      html: `
      <html>
      <body style="font-family: Arial, sans-serif; background: #f8f9fa; margin:0; padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:
  #f8f9fa; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
                  <tr>
                    <td align="center" style="padding-bottom: 24px;">
                      <h1 style="color: #e74c3c; margin: 0 0 8px 0; font-size: 28px;">Application Rejected</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #333; font-size: 16px; line-height: 1.6; padding-bottom: 24px;">
                      <p style="margin: 0;">Dear ${name},</p>
                      <p style="margin: 16px 0;">We regret to inform you that your application has been rejected or your verified status has been revoked.</p>
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
  } catch (error) {
    console.error("Error sending rejection email:", error);
  }
};

const sendIncidentEmail = async (email, incidentDetails) => {
  try {
    const result = await resend.emails.send({
      from: "Tourisla <tourisla@tourisla.space>",
      to: email,
      subject: incidentDetails.subject || "Incident Report",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; background: #f8f9fa; margin:0; padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="480" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
                    <tr>
                      <td align="center" style="padding-bottom: 24px;">
                        <h1 style="color: #2a7ae4; margin: 0 0 8px 0; font-size: 28px;">${incidentDetails.subject || "Incident Report"}</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #333; font-size: 16px; line-height: 1.6; padding-bottom: 24px;">
                        <p style="margin: 0;">${incidentDetails.text || "Your incident report status has been updated."}</p>
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
    console.log("Incident email sent successfully:", result);
  } catch (error) {
    console.error("Error sending incident email:", error);
  }
};

async function sendVerificationEmail(
  email,
  firstName,
  lastName,
  verifyToken,
  verifyTokenExpires
) {
  try {
    const verificationLink = `https://tourisla.space/auth/verify?token=${verifyToken}`;
    // Format the expiry date for display
    const expiresDate = new Date(verifyTokenExpires).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });

    const result = await resend.emails.send({
      from: "Tourisla <tourisla@tourisla.space>",
      to: email,
      subject: "Verify Your Email Address",
      html: `
      <html>
      <body style="font-family: Arial, sans-serif; background: #f8f9fa; margin:0; padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <h1 style="color: #2a7ae4; margin: 0 0 8px 0; font-size: 28px;">Verify Your Email Address</h1>
                  </td>
                </tr>
                <tr>
                  <td style="color: #333; font-size: 16px; line-height: 1.6; padding-bottom: 24px;">
                    <p style="margin: 0;">Dear ${firstName} ${lastName},</p>
                    <p style="margin: 16px 0;">Please verify your email address by clicking the button below:</p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="${verificationLink}" style="display:inline-block; background: #2a7ae4; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 4px; font-size: 16px;">Verify Email</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 24px; color: #888; font-size: 13px;" align="center">
                    <p style="margin:0;">This link will expire on <strong>${expiresDate}</strong>.</p>
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
    console.log("Verification email sent successfully:", result);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}

module.exports = {
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendIslandEntryEmail,
  sendDocumentApproveEmail,
  sendDocumentRejectEmail,
  sendDocumentRevokeEmail,
  sendApprovalEmail,
  sendRejectionEmail,
  sendIncidentEmail,
};
