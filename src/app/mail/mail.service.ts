import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { ISendMail } from '@/lib/types/mail';

const SMTP_HOST = process.env.NEXT_PUBLIC_SMTP_HOST;
const SMTP_PORT = Number(process.env.NEXT_PUBLIC_SMTP_PORT) || 2525;
const SMTP_USERNAME = process.env.NEXT_PUBLIC_SMTP_USERNAME;
const SMTP_PASSWORD = process.env.NEXT_PUBLIC_SMTP_PASSWORD;
const SMTP_FROM_NAME = process.env.NEXT_PUBLIC_SMTP_FROM_NAME;
const SMTP_FROM_EMAIL = process.env.NEXT_PUBLIC_SMTP_FROM_EMAIL;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

async function loadTemplate(filePath: string): Promise<string> {
  return await fs.readFile(filePath, 'utf-8');
}

export async function sendEmail(options: ISendMail) {
  try {
    const partialsDir = path.join(process.cwd(), 'src', 'app', 'mail', 'templates', 'partials');
    const headerTemplate = await loadTemplate(path.join(partialsDir, 'header.hbs'));
    const footerTemplate = await loadTemplate(path.join(partialsDir, 'footer.hbs'));
    
    handlebars.registerPartial('header', headerTemplate);
    handlebars.registerPartial('footer', footerTemplate);

    const templatePath = path.join(process.cwd(), 'src', 'app', 'mail', 'templates', `${options.template}.hbs`);
    const templateSource = await loadTemplate(templatePath);
    const compiledTemplate = handlebars.compile(templateSource);
    const html = compiledTemplate(options.params || {});

    const mailOptions = {
      from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: html,
      attachments: options.attachments || [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}
