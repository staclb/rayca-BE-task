const role = roles => (req, res, next) => {
  try {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (error) {
    next({
      log: `Error in middleware, role: ${error}`,
      status: 500,
      message: { error: 'Internal Server Error' },
    });
  }
};

module.exports = role;
