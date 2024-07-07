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

  logger.info('Sending email:', mailOptions);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error('Error sending email: %o', error);
    } else {
      logger.info('Email sent: %s', info.response);
    }
  });
};

const notifyTicketAssignment = (userEmail, ticketTitle) => {
  const subject = 'New Ticket Assigned';
  const text = `You have been assigned a new ticket: ${ticketTitle}`;
  sendEmailNotification(userEmail, subject, text);
};

const notifyTicketStatusChange = (userEmail, ticketTitle, status) => {
  const subject = 'Ticket Status Updated';
  const text = `The status of your ticket "${ticketTitle}" has been updated to: ${status}`;
  sendEmailNotification(userEmail, subject, text);
};

module.exports = {
  notifyTicketAssignment,
  notifyTicketStatusChange,
};
