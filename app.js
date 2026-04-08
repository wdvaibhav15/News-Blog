const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// middle wares
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({ extended: true , limit:"10mb"}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressLayouts);
app.set("layout", "layout");

// view engine setup
app.set('view engine', 'ejs');

// database connection
mongoose.connect(process.env.MONGODB_URI);

// frontends Routes


// app.use("/admin", (req, res, next) => {
//    res.locals.layout = "admin/layout";
//    next();
// });
app.use('/admin', (req, res, next) => {
  res.locals.layout = 'admin/layout';
  res.locals.role = null;
  res.locals.fullname = null;

  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.role = decoded.role;
      res.locals.fullname = decoded.fullname;
    } catch (error) {
      res.clearCookie('token');
    }
  }

  next();
});

// admin Routes
app.use('/admin', require('./routes/admin'));

app.use('/', require('./routes/frontend'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
 console.log(`Server running on port ${port}`);
});
