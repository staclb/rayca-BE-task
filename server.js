const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv');
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('Hello from server?');
});

app.listen(PORT, () => {
  console.log(`Server listening on Port:${PORT}`);
});
