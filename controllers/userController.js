const User = require('../models/User');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next({
      log: `Error in userController.getUsers: ${error.message}`,
      status: 500,
      message: { error: 'Internal Server Error' },
    });
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json(user);
  } catch (error) {
    next({
      log: `Error in userController.updateUserRole: ${error.message}`,
      status: 500,
      message: { error: 'Internal Server Error' },
    });
  }
};

module.exports = { getUsers, updateUserRole };
