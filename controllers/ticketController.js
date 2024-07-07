const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { sendEmailNotification } = require('../notifications/email');
const { sendWebSocketNotification } = require('../notifications/websocket');

const createTicket = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      createdBy: req.user._id,
      assignedTo,
    });

    if (assignedTo) {
      const user = await User.findById(assignedTo);

      sendEmailNotification(
        user.email,
        'New Ticket Assigned',
        `You have been assigned a new ticket: ${title}`,
      );
      sendWebSocketNotification(
        user._id,
        'New Ticket Assigned',
        `You have been assigned a new ticket: ${title}`,
      );
    }

    res.status(201).json(ticket);
  } catch (error) {
    next({
      log: `Error in ticketController.createTicket: ${error}`,
      status: 500,
      message: { error: 'Internal Server Error' },
    });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, assignedTo } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.title = title || ticket.title;
    ticket.description = description || ticket.description;
    ticket.status = status || ticket.status;
    ticket.assignedTo = assignedTo || ticket.assignedTo;

    await ticket.save();

    res.json(ticket);
  } catch (error) {
    next({
      log: `Error in ticketController.updateTicket: ${error}`,
      status: 500,
      message: { error: 'Internal Server Error' },
    });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    await Ticket.deleteOne({ _id: id }); // Use deleteOne instead of remove
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    next({
      log: `Error in ticketController.deleteTicket: ${error}`,
      status: 500,
      message: { error: 'Internal Server Error' },
    });
  }
};

const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({}).populate(
      'createdBy assignedTo',
      'name email role',
    );
    res.json(tickets);
  } catch (error) {
    next({
      log: `Error in ticketController.getTickets: ${error}`,
      status: 500,
      message: { error: 'Internal Server Error' },
    });
  }
};

const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id).populate('createdBy assignedTo');
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json(ticket);
  } catch (error) {
    next({
      log: `Error in ticketController.getTicketById: ${error}`,
      status: 500,
      message: { error: 'Internal Server Error' },
    });
  }
};

module.exports = {
  createTicket,
  updateTicket,
  deleteTicket,
  getTickets,
  getTicketById,
};
