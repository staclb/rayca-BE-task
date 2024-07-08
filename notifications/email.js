const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmailNotification = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  logger.info(`Sending email: ${JSON.stringify(mailOptions)}`);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error('Error sending email: ', error);
    } else {
      logger.info('Email sent: ', info.response);
    }
  });
};

const notifyTicketAssignment = (userEmail, ticketTitle, ticketDescription) => {
  const subject = 'New Ticket Assigned';
  const text = `You have been assigned a new ticket: 

  Title: ${ticketTitle}
  Description: ${ticketDescription}`;

  sendEmailNotification(userEmail, subject, text);
};

const notifyTicketStatusChange = (
  userEmail,
  ticketTitle,
  ticketStatus,
  ticketDescription,
) => {
  const subject = 'Ticket Status Updated';
  const text = `The status of the ticket "${ticketTitle}" has been updated to: ${ticketStatus}
  
  Description: ${ticketDescription}`;

  sendEmailNotification(userEmail, subject, text);
};

module.exports = {
  notifyTicketAssignment,
  notifyTicketStatusChange,
  sendEmailNotification,
};
