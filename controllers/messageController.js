const Message = require('../models/Message');
const Ticket = require('../models/Ticket');
const { sendEmailNotification } = require('../notifications/email');

const sendMessage = async (req, res, next) => {
  try {
    const { ticketId, message } = req.body;
    const senderId = req.user._id;

    const newMessage = await Message.create({
      ticket: ticketId,
      sender: senderId,
      message,
    });

    const ticket = await Ticket.findById(ticketId).populate('createdBy');
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const creator = ticket.createdBy;
    if (creator) {
      const subject = 'New Message on Your Ticket';
      const text = `You have received a new message on your ticket "${ticket.title}":
      
      Message: ${message}`;

      sendEmailNotification(creator.email, subject, text);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    next({
      log: `Error in messageController.sendMessage: ${error.message}`,
      status: 500,
      message: { error: 'Internal Server Error' },
    });
  }
};

module.exports = {
  sendMessage,
};
