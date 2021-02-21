const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const config = require('config');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/recaptcha', require('./routes/api/recaptcha'));
app.use('/api/textmessage', require('./routes/api/textmessage'));
app.use('/api/twofa', require('./routes/api/twofa'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// will run on 5000 if no environment variable set
const PORT = config.get('server.port') || 5000;

app.listen(PORT, () => console.log('Server started on port ' + PORT));
