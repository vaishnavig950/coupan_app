const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));

// intialize routes
require('./routes/index')(app);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
