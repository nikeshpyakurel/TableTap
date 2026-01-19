import { sendMail } from 'src/config/mail.config';
import { CreateEnquiryDto } from 'src/modules/enquiry/dto/create-enquiry.dto';

export const sendEnquiryMail = (enquiry: CreateEnquiryDto) => {
  const html = generateEnquiryHtml(enquiry);
  const mail = process.env.SUPER_ADMIN_EMAIL;
  console.log(mail)
  const subject = 'New Business Enquiry Received';
  sendMail(mail, subject, html);
};

function generateEnquiryHtml(enquiry: CreateEnquiryDto): string {
  return `
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 0; margin: 0; }
            .email-container { max-width: 600px; margin: 40px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
            .header { border-bottom: 1px solid #eee; margin-bottom: 20px; }
            .header h2 { margin: 0; color: #2c3e50; }
            .detail { margin: 20px 0; }
            .label { font-weight: bold; display: inline-block; width: 140px; color: #555; }
            .value { margin-bottom: 10px; }
            .footer { border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>📩 New Business Enquiry</h2>
            </div>

            <div class="detail">
              <div class="value"><span class="label">Name:</span> ${enquiry.name}</div>
              <div class="value"><span class="label">Email:</span> ${enquiry.email}</div>
              <div class="value"><span class="label">Contact:</span> ${enquiry.contact}</div>
              <div class="value"><span class="label">Business Name:</span> ${enquiry.businessName}</div>
              <div class="value"><span class="label">Business Type:</span> ${enquiry.businessType}</div>
            </div>

            <div class="footer">
              This is an automated message.
            </div>
          </div>
        </body>
      </html>
    `;
}
