import express from 'express';
import connectDB from './config/db.js';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import nodemailer from 'nodemailer';
import File from './models/file.js';

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Route to render the form
app.get('/', (req, res) => {
  res.render('index');
});

// Route to handle file upload
app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const newFile = new File({
      filename: req.file.originalname,
      path: req.file.path,
    });

    await newFile.save();

    // Send email with the uploaded file
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      port: 465,
      auth: {
        user: 'therheaway.in@gmail.com',
        pass: 'jzcl hubd wiil riel',
      },
    });

    const mailOptions = {
      from: 'therheaway.in@gmail.com',
      to: 'therheaway.in@gmail.com',
      subject: 'Uploaded PDF',
      text: 'Please find the attached PDF file.',
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Error while sending email');
      }
      console.log('Email sent: ' + info.response);
      res.send('File uploaded and email sent successfully');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
