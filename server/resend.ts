import { Resend } from 'resend';
import type { InsertContact } from '../shared/schema.js';
import { renderContactEmail } from './contact-email.js';

const DEFAULT_CONTACT_EMAIL = 'atifhasan000000@gmail.com';
const DEFAULT_FROM_EMAIL = 'Portfolio Contact <onboarding@resend.dev>';

let resend: Resend | undefined;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  resend ??= new Resend(apiKey);
  return resend;
}

export async function sendContactEmail(contact: InsertContact) {
  const client = getResendClient();
  const emailContent = renderContactEmail(contact);
  const safeSubject = contact.subject.replace(/[\r\n]+/g, ' ').trim();
  const { error } = await client.emails.send({
    from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
    to: [process.env.CONTACT_TO_EMAIL || DEFAULT_CONTACT_EMAIL],
    replyTo: contact.email,
    subject: `New portfolio enquiry — ${safeSubject}`,
    html: emailContent.html,
    text: emailContent.text,
    tags: [{ name: 'source', value: 'portfolio_contact' }],
  });

  if (error) {
    throw new Error(error.message);
  }
}
