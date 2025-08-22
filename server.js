// server.js (Josh Snip backend)
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));

// Email setup
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-email', (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: 'No image' });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.TO_EMAIL,
    subject: 'New Josh Snip Snapshot',
    html: '<h2>Snapshot from Josh Snip</h2><img src="cid:snapshot"/>',
    attachments: [{
      filename: 'snapshot.png',
      content: image.split("base64,")[1],
      encoding: 'base64',
      cid: 'snapshot'
    }]
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) return res.status(500).json({ error: 'Email failed' });
    res.json({ message: 'Email sent!' });
  });
});

app.listen(PORT, () => console.log(`Josh Snip running on ${PORT}`));
