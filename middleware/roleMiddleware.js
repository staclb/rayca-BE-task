const role = roles => (req, res, next) => {
  console.log('Checking user role:', req.user.role);
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = role;
