const express = require("express");
const app = express();
const mongoose = require("mongoose");

const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv/config");

app.use(cors());
app.use(express.json());
app.use("/", router);

const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", (req, res) => {
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
      res.json({ status: "ERROR" });
    } else {
      res.json({ status: "Message Sent" });
    }
  });
});

router.post("/request", (req, res) => {
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
      res.json({ status: "ERROR" });
    } else {
      res.json({ status: "Message Sent" });
    }
  });
});

mongoose.connect(process.env.DB_CONNECTION, () =>
  console.log("Connected to DB")
);
const port = process.env.PORT || 5000;
app.listen(port, () => console.info(`Listening on port ${port}...`));
