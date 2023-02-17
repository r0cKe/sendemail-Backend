require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello Visitor");
});

app.post("/sendemail", (req, res) => {
  let success = true;

  if (req.body.name === "" || req.body.email === "" || req.body.phone === "") {
    success = false;
    res.send(JSON.stringify({ success, from: "first" }));
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.USERMAIL,
      pass: process.env.USERPASS,
    },
  });

  const mailOptions = {
    from: process.env.USERMAIL,
    to: process.env.RECEIVERMAIL,
    subject: "Message from Ritik Sabhrwal Markall website",
    text: `
    Name: ${req.body.name}
    Email: ${req.body.email}
    Phone: ${req.body.phone}
    ${req.body.message !== "" ? `Message: ${req.body.message}` : ""}`,
  };

  transporter.sendMail(mailOptions, (error, details) => {
    if (error) {
      console.log(error);
      success = false;
      res.send(JSON.stringify({ success, from: "second" }));
    } else {
      res.send(JSON.stringify({ success, details: details.response }));
    }
  });
});

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
