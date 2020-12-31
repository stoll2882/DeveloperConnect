const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('API Running'));

// will run on 5000 if no environment variable set
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server started on port ' + PORT));
