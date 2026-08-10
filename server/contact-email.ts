import type { InsertContact } from '../shared/schema.js';

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };
    return entities[character];
  });
}

export function renderContactEmail(contact: InsertContact) {
  const name = escapeHtml(contact.name);
  const email = escapeHtml(contact.email);
  const subject = escapeHtml(contact.subject);
  const message = escapeHtml(contact.message).replace(/\r?\n/g, '<br>');
  const replyHref = `mailto:${encodeURIComponent(contact.email)}?subject=${encodeURIComponent(`Re: ${contact.subject}`)}`;

  const text = [
    'NEW PORTFOLIO ENQUIRY',
    '',
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `Subject: ${contact.subject}`,
    '',
    'MESSAGE',
    contact.message,
    '',
    'Sent from the contact form at https://atifhasan.com',
  ].join('\n');

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New portfolio enquiry</title>
  </head>
  <body style="margin:0;padding:0;background:#f2f2f0;color:#18191d;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">New message from ${name}: ${subject}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f2f2f0;">
      <tr>
        <td align="center" style="padding:32px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #deded9;border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:30px 34px;background:#111217;color:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="font-size:21px;font-weight:700;letter-spacing:.04em;">◆&nbsp; ATIF</td>
                    <td align="right" style="font-size:11px;font-weight:700;letter-spacing:.14em;color:#aaaab2;">CONTACT FORM</td>
                  </tr>
                </table>
                <div style="padding-top:34px;font-size:12px;font-weight:700;letter-spacing:.15em;color:#a5a6ad;">NEW PORTFOLIO ENQUIRY</div>
                <h1 style="margin:10px 0 0;font-size:28px;line-height:1.25;font-weight:700;letter-spacing:-.02em;color:#ffffff;">${subject}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 34px 12px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="width:92px;padding:0 0 14px;color:#74757c;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">From</td>
                    <td style="padding:0 0 14px;color:#18191d;font-size:15px;font-weight:700;">${name}</td>
                  </tr>
                  <tr>
                    <td style="width:92px;padding:0 0 14px;color:#74757c;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Email</td>
                    <td style="padding:0 0 14px;font-size:15px;"><a href="mailto:${email}" style="color:#18191d;text-decoration:underline;text-underline-offset:3px;">${email}</a></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:6px 34px 30px;">
                <div style="margin-bottom:10px;color:#74757c;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Message</div>
                <div style="padding:22px 24px;background:#f6f6f3;border:1px solid #e6e6e1;border-radius:14px;color:#2a2b30;font-size:16px;line-height:1.7;">${message}</div>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;">
                  <tr>
                    <td style="border-radius:999px;background:#18191d;">
                      <a href="${replyHref}" style="display:inline-block;padding:13px 22px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">Reply to ${name} →</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 34px;border-top:1px solid #ecece8;color:#85868c;font-size:12px;line-height:1.5;">
                Sent securely from the contact form at <a href="https://atifhasan.com" style="color:#5e5f65;">atifhasan.com</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { html, text };
}
