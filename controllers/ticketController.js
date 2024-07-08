const Ticket = require('../models/Ticket');
const User = require('../models/User');
const {
  notifyTicketAssignment,
  notifyTicketStatusChange,
} = require('../notifications/email');

const createTicket = async (req, res, next) => {
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
      if (user) {
        notifyTicketAssignment(user.email, title);
      }
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

const updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, assignedTo } = req.body;

    const ticket = await Ticket.findById(id).populate('createdBy', '-password');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const originalStatus = ticket.status;
    const originalAssignedTo = ticket.assignedTo;

    ticket.title = title || ticket.title;
    ticket.description = description || ticket.description;
    ticket.status = status || ticket.status;
    ticket.assignedTo = assignedTo || ticket.assignedTo;

    await ticket.save();

    if (assignedTo && assignedTo.toString() !== originalAssignedTo.toString()) {
      const user = await User.findById(assignedTo);
      if (user) {
        notifyTicketAssignment(user.email, ticket.title, ticket.description);
      }
    }

    if (status && status !== originalStatus) {
      const creator = await User.findById(ticket.createdBy._id);
      if (creator) {
        notifyTicketStatusChange(creator.email, ticket.title, ticket.status);
      }
    }

    res.json(ticket);
  } catch (error) {
    next({
      log: `Error in ticketController.updateTicket: ${error}`,
      status: 500,
      message: { error: 'Internal Server Error' },
    });
  }
};

const deleteTicket = async (req, res, next) => {
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

const getTickets = async (req, res, next) => {
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

const getTicketById = async (req, res, next) => {
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
