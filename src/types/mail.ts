import { Attachment } from 'nodemailer/lib/mailer';

export interface ISendMail {
    to: string | string[];
    subject: string;
    template: string;
    params?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
    attachments?: Attachment[];
  }
  