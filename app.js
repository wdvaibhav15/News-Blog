const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

// middle wares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

app.set("layout", "layouts");

// view engine setup
app.set('view engine', 'ejs');

// database connection
mongoose.connect(process.env.MONGODB_URI);

app.get('/', (req, res) => {
res.send('Hello World');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
 console.log(`Server running on port ${port}`);
});
