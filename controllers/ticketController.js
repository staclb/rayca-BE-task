const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { sendEmailNotification } = require('../notifications/email');
const { sendWebSocketNotification } = require('../notifications/websocket');

const createTicket = async (req, res) => {
  console.log('hi from createTicket');
  const { title, description, assignedTo } = req.body;

  try {
    const ticket = await Ticket.create({
      title,
      description,
      createdBy: req.user._id,
      assignedTo,
    });

    console.log('Ticket created:', ticket);

    if (assignedTo) {
      const user = await User.findById(assignedTo);

      console.log('Assigned user found:', user);

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
    console.error('Error creating ticket:', error);
    res
      .status(400)
      .json({ message: 'Failed to create ticket', error: error.message });
  }
};

const updateTicket = async (req, res) => {
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTickets = async (req, res) => {
  const tickets = await Ticket.find({}).populate(
    'createdBy assignedTo',
    'name email role',
  );
  res.json(tickets);
};

const getTicketById = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findById(id).populate('createdBy assignedTo');
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTicket,
  updateTicket,
  deleteTicket,
  getTickets,
  getTicketById,
};
