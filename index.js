const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('config');
const multer = require('multer');
const { memoryStorage } = require('multer')
const storage = memoryStorage()
const upload = multer({ storage })


const router = express.Router();
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv/config');
const users = require('./routes/users');
const auth = require('./routes/auth');
const uploadNotes = require("./s3upload");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use('/', router);
app.use('/api/register', users);
app.use('/api/auth', auth);

if (!config.get('PrivateKey')) {
  console.error('FATAL ERROR: PrivateKey is not defined.');
  process.exit(1);
}

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


router.post('/upload', upload.single('audiofile'), async (req, res) => {
  const filename = 'luke';
  const bucketname = 'cncbucket';
  const file = req.file.buffer
  const link = await uploadNotes(filename, bucketname, file)
  res.send(link)
})

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

const connectDatabase = async () => {
  try {
    
    await mongoose.connect(process.env.DB_CONNECTION);

    console.log("Connected to Database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDatabase();

const port = process.env.PORT || 5004;
app.listen(port, () => console.info(`Listening on port ${port}...`));


