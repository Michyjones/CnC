const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const mongoose = require('mongoose');


const router = express.Router();
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv/config');

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use('/', router);

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  host:'smtp.gmail.com',
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Ready to Send');
  }
});

router.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  const file = req.files.file;

  file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});
router.post('/contact', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const subject = req.body.subject;
  const phone = req.body.phone;
  const message = req.body.message;
  const mail = {
    from: { firstName, lastName },
    to: process.env.EMAIL,
    subject: subject,
    html: `<p>Name: ${firstName} ${lastName}</p>
             <p>Phone Number: ${phone}</p>
             <p>Email: ${email}</p>
             <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: 'ERROR' });
    } else {
      res.json({ status: 'Message Sent' });
    }
  });
});

router.post('/request', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const prayer = req.body.prayer;
  const phone = req.body.phone;
  const message = req.body.message;
  const mail = {
    from: { firstName, lastName },
    to: process.env.EMAIL,
    subject: prayer,
    html: `<p>Name: ${firstName} ${lastName}</p>
               <p>Phone Number: ${phone}</p>
               <p>Email: ${email}</p>
               <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: 'ERROR' });
    } else {
      res.json({ status: 'Message Sent' });
    }
  });
});

mongoose.connect(
  process.env.DB_CONNECTION,
  { userNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('Connected to DB')
);
const port = process.env.PORT || 5000;
app.listen(port, () => console.info(`Listening on port ${port}...`));

const schema = {
  properties: {
    username: {
      pattern: /^[a-zA-Z\s\-]+$/,
      message: 'Username must contain only letters, spaces, or dashes.',
      required: true,
      description: 'Enter username',
    },
    password: {
      hidden: true,
      required: true,
      description: 'Enter password',
    },
    confirmPassword: {
      hidden: true,
      required: true,
      description: 'Confirm password',
    },
  },
};
