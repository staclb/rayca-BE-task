const User = require('../models/User');

const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.role = role;
  await user.save();

  res.json(user);
};

module.exports = { getUsers, updateUserRole };
