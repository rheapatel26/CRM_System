import express from 'express';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import nodemailer from 'nodemailer';
import HealthInsurance from './models/HealthInsurance.js';
import PortCase from './models/PortCase.js';
import RenewalCase from './models/RenewalCase.js';
import TravelInsurance from './models/TravelFresh.js';
import  LifeInsurance from './models/lifeForm.js';
import NewVehicleCase from './models/NewVehicleMotorCase.js';
import RolloverCase from './models/RolloverCase.js'; 
import RenewalCaseMotor from './models/RenewalCaseMotor.js'; 

const app = express();
connectDB();
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Function to calculate travel days
function calculateTravelDays(travelFrom, travelTo) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const fromDate = new Date(travelFrom);
  const toDate = new Date(travelTo);
  return Math.round(Math.abs((fromDate - toDate) / oneDay));
}

// Route to render indexhealth.ejs
app.get('/', (req, res) => {
  res.render('indexhealth');
});

// Route to render freshcase.ejs for health insurance application form
app.get('/freshcase', (req, res) => {
  res.render('freshcase');
});

// Route to handle submission of health insurance application form
app.post('/upload', upload.single('fileUpload'), async (req, res) => {
  try {
    console.log('File:', req.file); // Debugging line

    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const {
      customerName,
      dob,
      age,
      ped,
      city,
      state,
      pincode,
      zone,
      companyPreference,
      sumInsured,
      expectedPremium,
      addOns,
      remarks,
      familyMembers,
    } = req.body;

    const newHealthInsurance = new HealthInsurance({
      customerName,
      dob,
      age,
      ped,
      city,
      state,
      pincode,
      zone,
      companyPreference,
      sumInsured,
      expectedPremium,
      addOns: Array.isArray(addOns) ? addOns : [addOns],
      remarks,
      file: {
        filename: req.file.originalname,
        path: req.file.path,
      },
      familyMembers: familyMembers ? JSON.parse(familyMembers) : [],
    });

    await newHealthInsurance.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'therheaway.in@gmail.com',
        pass: 'jzcl hubd wiil riel', // replace with your Gmail app password or use environment variables
      },
    });

    let tableRows = `
      <tr><td><strong>Name:</strong></td><td>${customerName}</td></tr>
      <tr><td><strong>Date of Birth:</strong></td><td>${dob}</td></tr>
      <tr><td><strong>Age:</strong></td><td>${age}</td></tr>
      <tr><td><strong>Pre-existing Disease:</strong></td><td>${ped}</td></tr>
      <tr><td><strong>City:</strong></td><td>${city}</td></tr>
      <tr><td><strong>State:</strong></td><td>${state}</td></tr>
      <tr><td><strong>Pincode:</strong></td><td>${pincode}</td></tr>
      <tr><td><strong>Zone:</strong></td><td>${zone}</td></tr>
      <tr><td><strong>Company Preference:</strong></td><td>${companyPreference}</td></tr>
      <tr><td><strong>Sum Insured:</strong></td><td>${sumInsured}</td></tr>
      <tr><td><strong>Expected Premium:</strong></td><td>${expectedPremium}</td></tr>
      <tr><td><strong>Add-ons:</strong></td><td>${Array.isArray(addOns) ? addOns.join(', ') : addOns}</td></tr>
      <tr><td><strong>Remarks:</strong></td><td>${remarks}</td></tr>
    `;

    if (familyMembers) {
      const parsedFamilyMembers = JSON.parse(familyMembers);
      tableRows += `<tr><td colspan="2"><strong>Family Members:</strong></td></tr>`;
      parsedFamilyMembers.forEach((member, index) => {
        tableRows += `<tr><td><strong>Member ${index + 1}:</strong></td><td>${member.name}, ${member.relationship}</td></tr>`;
      });
    }

    const mailOptions = {
      from: 'therheaway.in@gmail.com',
      to: 'therheaway.in@gmail.com', // replace with recipient's email address
      subject: 'Health Insurance Application',
      html: `
        <p>Dear Customer,</p>
        <p>Your health insurance application details:</p>
        <table border="1" cellpadding="5" cellspacing="0">
          ${tableRows}
        </table>
        <p>Thank you.</p>
      `,
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Form submitted and email sent successfully');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Route to render portcase.ejs for port case application form
app.get('/portcase', (req, res) => {
  res.render('portcase');
});

// Route to handle submission of port case application form
app.post('/upload-portcase', upload.fields([
  { name: 'portFileUpload2', maxCount: 1 },
  { name: 'portFileUpload', maxCount: 1 }
]), async (req, res) => {
  try {
    
    const {
      portCustomerName,
      portDob,
      portAge, 
      portPed,
      portCity,
      portState,
      portPincode,
      portZone,
      portClaim,
      portCompanyPreference,
      portSumInsured,
      portPremiumSlab,
      portAddOns,
      portRemarks,
    } = req.body;

    const newPortCase = new PortCase({
      customerName: portCustomerName,
      dob: portDob,
      age: portAge,
      ped: portPed,
      city: portCity,
      state: portState,
      pincode: portPincode,
      zone: portZone,
      claim: portClaim,
      companyPreference: portCompanyPreference,
      sumInsured: portSumInsured,
      premiumSlab: portPremiumSlab,
      addOns: Array.isArray(portAddOns) ? portAddOns : [portAddOns],
      remarks: portRemarks,
      files: [] // Initialize files array
    });
    
    // Check if portFileUpload2 is uploaded
    if (req.files['portFileUpload2'] && req.files['portFileUpload2'][0]) {
      newPortCase.files.push({
        fieldname: 'portFileUpload2',
        filename: req.files['portFileUpload2'][0].originalname,
        path: req.files['portFileUpload2'][0].path,
      });
    }

    // Check if portFileUpload is uploaded
    if (req.files['portFileUpload'] && req.files['portFileUpload'][0]) {
      newPortCase.files.push({
        fieldname: 'portFileUpload',
        filename: req.files['portFileUpload'][0].originalname,
        path: req.files['portFileUpload'][0].path,
      });
    }

    await newPortCase.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'therheaway.in@gmail.com',
        pass: 'jzcl hubd wiil riel', // Replace with your Gmail app password or use environment variables
      },
    });

    let tableRows = `
      <tr><td><strong>Name:</strong></td><td>${portCustomerName}</td></tr>
      <tr><td><strong>Date of Birth:</strong></td><td>${portDob}</td></tr>
      <tr><td><strong>Age:</strong></td><td>${portAge}</td></tr>
      <tr><td><strong>Pre-existing Disease:</strong></td><td>${portPed}</td></tr>
      <tr><td><strong>City:</strong></td><td>${portCity}</td></tr>
      <tr><td><strong>State:</strong></td><td>${portState}</td></tr>
      <tr><td><strong>Pincode:</strong></td><td>${portPincode}</td></tr>
      <tr><td><strong>Zone:</strong></td><td>${portZone}</td></tr>
      <tr><td><strong>Claim:</strong></td><td>${portClaim}</td></tr>
      <tr><td><strong>Company Preference:</strong></td><td>${portCompanyPreference}</td></tr>
      <tr><td><strong>Sum Insured:</strong></td><td>${portSumInsured}</td></tr>
      <tr><td><strong>Premium Slab:</strong></td><td>${portPremiumSlab}</td></tr>
      <tr><td><strong>Add-ons:</strong></td><td>${Array.isArray(portAddOns) ? portAddOns.join(', ') : portAddOns}</td></tr>
      <tr><td><strong>Remarks:</strong></td><td>${portRemarks}</td></tr>
    `;

    const mailOptions = {
      from: 'therheaway.in@gmail.com',
      to: 'therheaway.in@gmail.com', // Replace with recipient's email address
      subject: 'Port Case Application',
      html: `
        <p>Dear Customer,</p>
        <p>Your port case application details:</p>
        <table border="1" cellpadding="5" cellspacing="0">
          ${tableRows}
        </table>
        <p>Thank you.</p>
      `,
      attachments: []
    };

    // Attach portFileUpload2 if uploaded
    if (req.files['portFileUpload2'] && req.files['portFileUpload2'][0]) {
      mailOptions.attachments.push({
        filename: req.files['portFileUpload2'][0].originalname,
        path: req.files['portFileUpload2'][0].path,
      });
    }

    // Attach portFileUpload if uploaded
    if (req.files['portFileUpload'] && req.files['portFileUpload'][0]) {
      mailOptions.attachments.push({
        filename: req.files['portFileUpload'][0].originalname,
        path: req.files['portFileUpload'][0].path,
      });
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Form submitted and email sent successfully');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



// Route to render renewal.ejs for renewal case application form
app.get('/renewalcase', (req, res) => {
  res.render('renewalcase'); // Assuming 'renewalcase' is the correct view name
});


// Route to handle submission of renewal case application form
app.post('/upload-renewal', upload.single('renewalFileUpload'), async (req, res) => {
  try {
    console.log('File:', req.file); // Debugging line

    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const {
      customerName,
      policyNumber,
      companyPreference,
      sumInsured,
      premiumSlab,
      addOns,
      remarks,
    } = req.body;

    const newRenewalCase = new RenewalCase({
      customerName: customerName,
      policyNumber: policyNumber,
      companyPreference: companyPreference,
      sumInsured: sumInsured,
      premium: premiumSlab,
      addOns: Array.isArray(addOns) ? addOns : [addOns],
      remarks: remarks,
      file: {
        filename: req.file.originalname,
        path: req.file.path,
      },
    });

    await newRenewalCase.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'therheaway.in@gmail.com',
        pass: 'jzcl hubd wiil riel', // replace with your Gmail app password or use environment variables
      },
    });

    let tableRows = `
      <tr><td><strong>Name:</strong></td><td>${customerName}</td></tr>
      <tr><td><strong>Policy Number:</strong></td><td>${policyNumber}</td></tr>
      <tr><td><strong>Company Preference:</strong></td><td>${companyPreference}</td></tr>
      <tr><td><strong>Sum Insured:</strong></td><td>${sumInsured}</td></tr>
      <tr><td><strong>Premium:</strong></td><td>${premiumSlab}</td></tr>
      <tr><td><strong>Add-ons:</strong></td><td>${Array.isArray(addOns) ? addOns.join(', ') : addOns}</td></tr>
      <tr><td><strong>Remarks:</strong></td><td>${remarks}</td></tr>
    `;

    const mailOptions = {
      from: 'therheaway.in@gmail.com',
      to: 'therheaway.in@gmail.com', // replace with recipient's email address
      subject: 'Renewal Case Application',
      html: `
        <p>Dear Customer,</p>
        <p>Your renewal case application details:</p>
        <table border="1" cellpadding="5" cellspacing="0">
          ${tableRows}
        </table>
        <p>Thank you.</p>
      `,
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Form submitted and email sent successfully');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Route to render travelfresh.ejs for travel insurance application form
app.get('/travelfresh', (req, res) => {
  res.render('travelfresh');
});

// Route to handle submission of travel insurance application form
app.post('/submit', upload.fields([
  { name: 'ticket', maxCount: 1 },
  { name: 'passport', maxCount: 1 },
  { name: 'visa', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Files:', req.files); // Debugging line

    const {
      customerName,
      dob,
      age,
      ped,
      destination,
      travelFrom,
      travelTo,
      addOns,
      remarks,
      familyMemberName,
      familyMemberDOB,
      familyMemberAge,
      familyMemberPED
    } = req.body;

    // Handling family members data
    const familyMembers = [];
    if (req.body.familyMemberName) {
        if (Array.isArray(req.body.familyMemberName)) {
            req.body.familyMemberName.forEach((name, index) => {
                familyMembers.push({
                    familyMemberName: name,
                    familyMemberDOB: req.body.familyMemberDOB[index],
                    familyMemberAge: req.body.familyMemberAge[index],
                    familyMemberPED: req.body.familyMemberPED[index]
                });
            });
        } else {
            familyMembers.push({
                familyMemberName: req.body.familyMemberName,
                familyMemberDOB: req.body.familyMemberDOB,
                familyMemberAge: req.body.familyMemberAge,
                familyMemberPED: req.body.familyMemberPED
            });
        }
    }
    const newTravelInsurance = new TravelInsurance({
      customerName,
      dob,
      age,
      ped,
      ticket: req.files['ticket'][0] ? {
        filename: req.files['ticket'][0].originalname,
        path: req.files['ticket'][0].path
      } : null,
      passport: req.files['passport'][0] ? {
        filename: req.files['passport'][0].originalname,
        path: req.files['passport'][0].path
      } : null,
      visa: req.files['visa'][0] ? {
        filename: req.files['visa'][0].originalname,
        path: req.files['visa'][0].path
      } : null,
      destination,
      travelFrom,
      travelTo,
      travelDays: calculateTravelDays(travelFrom, travelTo), // Use calculateTravelDays function here
      addOns: Array.isArray(addOns) ? addOns : [addOns],
      remarks,
      familyMembers: familyMembers
    });

    await newTravelInsurance.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'therheaway.in@gmail.com',
        pass: 'jzcl hubd wiil riel', // replace with your Gmail app password or use environment variables
      },
    });

    let tableRows = `
      <tr><td><strong>Name:</strong></td><td>${customerName}</td></tr>
      <tr><td><strong>Date of Birth:</strong></td><td>${dob}</td></tr>
      <tr><td><strong>Age:</strong></td><td>${age}</td></tr>
      <tr><td><strong>Pre-existing Disease:</strong></td><td>${ped}</td></tr>
      <tr><td><strong>Destination:</strong></td><td>${destination}</td></tr>
      <tr><td><strong>Travel Dates:</strong></td><td>${travelFrom} to ${travelTo}</td></tr>
      <tr><td><strong>Travel Days:</strong></td><td>${calculateTravelDays(travelFrom, travelTo)}</td></tr>
      <tr><td><strong>Add-ons:</strong></td><td>${Array.isArray(addOns) ? addOns.join(', ') : addOns}</td></tr>
      <tr><td><strong>Remarks:</strong></td><td>${remarks}</td></tr>
      <tr><td><strong>Family member name:</strong></td><td>${familyMemberName}</td></tr>
      <tr><td><strong>Family member dob:</strong></td><td>${familyMemberDOB}</td></tr>
      <tr><td><strong>Family member age:</strong></td><td>${familyMemberAge}</td></tr>
      <tr><td><strong>Family member ped:</strong></td><td>${familyMemberPED}</td></tr>
    `;

    // if (familyMembers) {
    //   const parsedFamilyMembers = JSON.parse(familyMembers);
    //   if (parsedFamilyMembers.length > 0) {
    //     tableRows += `<tr><td colspan="2"><strong>Family Members:</strong></td></tr>`;
    //     parsedFamilyMembers.forEach((member, index) => {
    //       tableRows += `<tr><td><strong>Member ${index + 1}:</strong></td><td>${member.name}, ${member.relationship}</td></tr>`;
    //     });
    //   } else {
    //     tableRows += `<tr><td colspan="2"><strong>Family Members:</strong> None</td></tr>`;
    //   }
    // } else {
    //   tableRows += `<tr><td colspan="2"><strong>Family Members:</strong> None</td></tr>`;
    // }

    const mailOptions = {
      from: 'therheaway.in@gmail.com',
      to: 'therheaway.in@gmail.com ', // replace with recipient's email address
      subject: 'Travel Insurance Application',
      html: `
        <p>Dear Customer,</p>
        <p>Your travel insurance application details:</p>
        <table border="1" cellpadding="5" cellspacing="0">
          ${tableRows}
        </table>
        <p>Thank you.</p>
      `,
      attachments: [
        req.files['ticket'][0] ? { filename: req.files['ticket'][0].originalname, path: req.files['ticket'][0].path } : null,
        req.files['passport'][0] ? { filename: req.files['passport'][0].originalname, path: req.files['passport'][0].path } : null,
        req.files['visa'][0] ? { filename: req.files['visa'][0].originalname, path: req.files['visa'][0].path } : null,
      ].filter(Boolean),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Form submitted and email sent successfully');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/lifeform', (_req, res) => {
  res.render('lifeform');
});

app.post('/submit-life-insurance', upload.fields([{ name: 'termUploadDocument' }, { name: 'ulipUploadDocument' }]), async (req, res) => {
  try {
    const formData = req.body;

    const lifeInsuranceData = {
      customerName: formData.customerName,
      dob: formData.dob,
      age: formData.age,
      gender: formData.gender,
      smoker: formData.smoker,
      education: formData.education,
      employment: formData.employment,
      annualIncome: formData.annualIncome,
      termPlan: {
        typeOfPlan: formData.termTypeOfPlan,
        companyPreference: formData.termCompanyPreference,
        productName: formData.termProductName,
        sumInsured: formData.termSumInsured,
        existingSI: formData.termExistingSI,
        coverTillAge: formData.termCoverTillAge,
        policyTerm: formData.termPolicyTerm,
        premiumPayingTerm: formData.termPremiumPayingTerm,
        riders: formData.termRiders,
        remarks: formData.termRemarks,
        uploadDocument: req.files['termUploadDocument'] ? req.files['termUploadDocument'][0].filename : ''
      },
      traditionalPlan: {
        premium: formData.tradPremium,
        companyPreference: formData.tradCompanyPreference,
        productName: formData.tradProductName,
        premiumPayingTerm: formData.tradPremiumPayingTerm,
        policyTerm: formData.tradPolicyTerm,
        payoutType: formData.tradPayoutType,
        payoutTerm: formData.tradPayoutTerm,
        riders: formData.tradRiders,
        remarks: formData.tradRemarks
      },
      ulipPlan: {
        premium: formData.ulipPremium,
        companyPreference: formData.ulipCompanyPreference,
        productName: formData.ulipProductName,
        fundSelection: formData.ulipFundSelection,
        premiumPayingTerm: formData.ulipPremiumPayingTerm,
        policyTerm: formData.ulipPolicyTerm,
        riders: formData.ulipRiders,
        remarks: formData.ulipRemarks,
        uploadDocument: req.files['ulipUploadDocument'] ? req.files['ulipUploadDocument'][0].filename : ''
      }
    };

    const lifeInsurance = new LifeInsurance(lifeInsuranceData);
    await lifeInsurance.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'therheaway.in@gmail.com',
        pass: 'jzcl hubd wiil riel', // replace with your Gmail app password or use environment variables
      },
    });

    // Send email with form details
    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
            }
            th {
                background-color: #f2f2f2;
            }
        </style>
    </head>
    <body>
        <h3>Customer Details</h3>
        <table>
            <tr>
                <th>Field</th>
                <th>Details</th>
            </tr>
            <tr>
                <td>Name</td>
                <td>${formData.customerName}</td>
            </tr>
            <tr>
                <td>DOB</td>
                <td>${formData.dob}</td>
            </tr>
            <tr>
                <td>Age</td>
                <td>${formData.age}</td>
            </tr>
            <tr>
                <td>Gender</td>
                <td>${formData.gender}</td>
            </tr>
            <tr>
                <td>Smoker</td>
                <td>${formData.smoker}</td>
            </tr>
            <tr>
                <td>Education</td>
                <td>${formData.education}</td>
            </tr>
            <tr>
                <td>Employment</td>
                <td>${formData.employment}</td>
            </tr>
            <tr>
                <td>Annual Income</td>
                <td>${formData.annualIncome}</td>
            </tr>
        </table>
    
        <h3>Term Plan Details</h3>
        <table>
            <tr>
                <th>Field</th>
                <th>Details</th>
            </tr>
            <tr>
                <td>Type of Plan</td>
                <td>${formData.termTypeOfPlan}</td>
            </tr>
            <tr>
                <td>Company Preference (Term Plan)</td>
                <td>${formData.termCompanyPreference}</td>
            </tr>
            <tr>
                <td>Product Name (Term Plan)</td>
                <td>${formData.termProductName}</td>
            </tr>
            <tr>
                <td>Sum Insured (Term Plan)</td>
                <td>${formData.termSumInsured}</td>
            </tr>
            <tr>
                <td>Existing S.I (Term Plan)</td>
                <td>${formData.termExistingSI}</td>
            </tr>
            <tr>
                <td>Cover Till Age (Term Plan)</td>
                <td>${formData.termCoverTillAge}</td>
            </tr>
            <tr>
                <td>Policy Term (Term Plan)</td>
                <td>${formData.termPolicyTerm}</td>
            </tr>
            <tr>
                <td>Premium Paying Term (Term Plan)</td>
                <td>${formData.termPremiumPayingTerm}</td>
            </tr>
            <tr>
                <td>Riders (Term Plan)</td>
                <td>${formData.termRiders}</td>
            </tr>
            <tr>
                <td>Remarks (Term Plan)</td>
                <td>${formData.termRemarks}</td>
            </tr>
        </table>
    
        <h3>Traditional Plan Details</h3>
        <table>
            <tr>
                <th>Field</th>
                <th>Details</th>
            </tr>
            <tr>
                <td>Premium (Traditional Plan)</td>
                <td>${formData.tradPremium}</td>
            </tr>
            <tr>
                <td>Company Preference (Traditional Plan)</td>
                <td>${formData.tradCompanyPreference}</td>
            </tr>
            <tr>
                <td>Product Name (Traditional Plan)</td>
                <td>${formData.tradProductName}</td>
            </tr>
            <tr>
                <td>Premium Paying Term (Traditional Plan)</td>
                <td>${formData.tradPremiumPayingTerm}</td>
            </tr>
            <tr>
                <td>Policy Term (Traditional Plan)</td>
                <td>${formData.tradPolicyTerm}</td>
            </tr>
            <tr>
                <td>Payout Type (Traditional Plan)</td>
                <td>${formData.tradPayoutType}</td>
            </tr>
            <tr>
                <td>Payout Term (Traditional Plan)</td>
                <td>${formData.tradPayoutTerm}</td>
            </tr>
            <tr>
                <td>Riders (Traditional Plan)</td>
                <td>${formData.tradRiders}</td>
            </tr>
            <tr>
                <td>Remarks (Traditional Plan)</td>
                <td>${formData.tradRemarks}</td>
            </tr>
        </table>
    
        <h3>ULIP Plan Details</h3>
        <table>
            <tr>
                <th>Field</th>
                <th>Details</th>
            </tr>
            <tr>
                <td>Premium (ULIP Plan)</td>
                <td>${formData.ulipPremium}</td>
            </tr>
            <tr>
                <td>Company Preference (ULIP Plan)</td>
                <td>${formData.ulipCompanyPreference}</td>
            </tr>
            <tr>
                <td>Product Name (ULIP Plan)</td>
                <td>${formData.ulipProductName}</td>
            </tr>
            <tr>
                <td>Fund Selection (ULIP Plan)</td>
                <td>${formData.ulipFundSelection}</td>
            </tr>
            <tr>
                <td>Premium Paying Term (ULIP Plan)</td>
                <td>${formData.ulipPremiumPayingTerm}</td>
            </tr>
            <tr>
                <td>Policy Term (ULIP Plan)</td>
                <td>${formData.ulipPolicyTerm}</td>
            </tr>
            <tr>
                <td>Riders (ULIP Plan)</td>
                <td>${formData.ulipRiders}</td>
            </tr>
            <tr>
                <td>Remarks (ULIP Plan)</td>
                <td>${formData.ulipRemarks}</td>
            </tr>
        </table>
    </body>
    </html>`;
      

    const mailOptions = {
      from: 'therheaway.in@gmail.com',
      to: 'therheaway.in@gmail.com ',
      subject: 'New Life Insurance Form Submission',
      html: emailContent,
      attachments: [
        ...(req.files['termUploadDocument'] ? [{ filename: req.files['termUploadDocument'][0].originalname, path: req.files['termUploadDocument'][0].path }] : []),
        ...(req.files['ulipUploadDocument'] ? [{ filename: req.files['ulipUploadDocument'][0].originalname, path: req.files['ulipUploadDocument'][0].path }] : [])
      ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Form submitted and email sent successfully');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



// Route to render new vehicle case form
app.get('/newvehiclemotorcase', (_req, res) => {
  res.render('newvehiclemotorcase');
});

// Route to render new vehicle case form
app.get('/newvehiclemotorcase', (_req, res) => {
  res.render('newvehiclemotorcase');
});

// Route to handle form submission
app.post('/submit-vehicle-case', upload.single('fileUpload'), async (req, res) => {
  try {
    console.log('File:', req.file); // Debugging line

    const {
      customerName,
      email,
      contactNo,
      pincode,
      invoiceType,
      cc,
      fuelType,
      sittingCapacity,
      rtoLocation,
      variant,
      addOns,
      companyPreference,
      companyName,
      modelNo,
      variantWithoutInvoice,
      insuranceType,
      age,
      remarks,
    } = req.body;

    // Creating table rows for customer details
    let customerDetails = `
      <tr><td><strong>Name:</strong></td><td>${customerName}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
      <tr><td><strong>Contact No.:</strong></td><td>${contactNo}</td></tr>
      <tr><td><strong>Pincode:</strong></td><td>${pincode}</td></tr>
      <tr><td><strong>Invoice Type:</strong></td><td>${invoiceType}</td></tr>
    `;

    // Creating table rows for "With Invoice Copy" details if file is uploaded
    let withInvoiceDetails = '';
    if (req.file) {
      withInvoiceDetails = `
        <tr><td><strong>CC:</strong></td><td>${cc}</td></tr>
        <tr><td><strong>Fuel Type:</strong></td><td>${fuelType}</td></tr>
        <tr><td><strong>Sitting Capacity:</strong></td><td>${sittingCapacity}</td></tr>
        <tr><td><strong>RTO Location:</strong></td><td>${rtoLocation}</td></tr>
        <tr><td><strong>Variant:</strong></td><td>${variant}</td></tr>
        <tr><td><strong>Add Ons:</strong></td><td>${addOns}</td></tr>
        <tr><td><strong>Company Preference:</strong></td><td>${companyPreference}</td></tr>
      `;
    }

    // Creating table rows for "Without Invoice Copy" details
    let withoutInvoiceDetails = `
      <tr><td><strong>Company Name:</strong></td><td>${companyName}</td></tr>
      <tr><td><strong>Model No.:</strong></td><td>${modelNo}</td></tr>
      <tr><td><strong>Variant Without Invoice:</strong></td><td>${variantWithoutInvoice}</td></tr>
      <tr><td><strong>Insurance Type:</strong></td><td>${insuranceType}</td></tr>
      <tr><td><strong>Age:</strong></td><td>${age}</td></tr>
      <tr><td><strong>Remarks:</strong></td><td>${remarks}</td></tr>
    `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'therheaway.in@gmail.com',
        pass: 'jzcl hubd wiil riel', // replace with your Gmail app password or use environment variables
      },
    });

    const mailOptions = {
      from: 'therheaway.in@gmail.com',
      to: 'therheaway.in@gmail.com ', // replace with recipient's email address
      subject: 'New Vehicle Case Application',
      html: `
        <p>Dear Customer,</p>
        <p>Your new vehicle case application details:</p>
        <h3>Customer Details</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          ${customerDetails}
        </table>

        ${req.file ? `
          <h3>With Invoice Copy Details</h3>
          <table border="1" cellpadding="5" cellspacing="0">
            ${withInvoiceDetails}
          </table>
        ` : ''}

        <h3>Without Invoice Copy Details</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          ${withoutInvoiceDetails}
        </table>

        <p>Thank you.</p>
      `,
      attachments: req.file ? [
        {
          filename: req.file.originalname,
          path: req.file.path,
        },
      ] : [],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Form submitted and email sent successfully');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Route to render rollover case form
app.get('/rollovermotorcase', (req, res) => {
  res.render('rollovermotorcase');
});

// Route to handle submission of rollover case form
app.post('/submit-rollover-case', upload.fields([{ name: 'policyCopy' }, { name: 'rcCopy' }]), async (req, res) => {
  try {
    const {
      customerName,
      email,
      contactNo,
      pincode,
      claimConfirmation,
      registrationNumber,
      expiryDate,
      makeModel,
      variant,
      addOns,
      companyPreference,
      remarks,
    } = req.body;

    const newRolloverCase = new RolloverCase({
      customerName,
      email,
      contactNo,
      pincode,
      policyCopy: {
        filename: req.files['policyCopy'][0].originalname,
        path: req.files['policyCopy'][0].path,
      },
      rcCopy: {
        filename: req.files['rcCopy'][0].originalname,
        path: req.files['rcCopy'][0].path,
      },
      claimConfirmation,
      registrationNumber,
      expiryDate,
      makeModel,
      variant,
      addOns,
      companyPreference,
      remarks,
    });

    await newRolloverCase.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'therheaway.in@gmail.com',
        pass: 'jzcl hubd wiil riel', // replace with your Gmail app password or use environment variables
      },
    });

    const mailOptions = {
      from: 'therheaway.in@gmail.com',
      to: 'therheaway.in@gmail.com ', // replace with recipient's email address
      subject: 'Rollover Case Submission',
      html: `
        <p>Dear Customer,</p>
        <p>Your rollover case details:</p>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr><td><strong>Customer Name:</strong></td><td>${customerName}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
          <tr><td><strong>Contact No:</strong></td><td>${contactNo}</td></tr>
          <tr><td><strong>Pincode:</strong></td><td>${pincode}</td></tr>
          <tr><td><strong>Claim Confirmation:</strong></td><td>${claimConfirmation}</td></tr>
          <tr><td><strong>Registration Number:</strong></td><td>${registrationNumber}</td></tr>
          <tr><td><strong>Expiry Date:</strong></td><td>${expiryDate}</td></tr>
          <tr><td><strong>Make Model:</strong></td><td>${makeModel}</td></tr>
          <tr><td><strong>Variant:</strong></td><td>${variant}</td></tr>
          <tr><td><strong>Add Ons:</strong></td><td>${addOns}</td></tr>
          <tr><td><strong>Company Preference:</strong></td><td>${companyPreference}</td></tr>
          <tr><td><strong>Remarks:</strong></td><td>${remarks}</td></tr>
        </table>
        <p>Thank you.</p>
      `,
      attachments: [
        {
          filename: req.files['policyCopy'][0].originalname,
          path: req.files['policyCopy'][0].path,
        },
        {
          filename: req.files['rcCopy'][0].originalname,
          path: req.files['rcCopy'][0].path,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Form submitted and email sent successfully');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/renewalcasemotor', (_req, res) => {
  res.render('renewalcasemotor'); // Assuming you have a view file named 'renewalcasemotor.ejs'
});

// Route to handle submission of renewal case motor form
app.post('/submit-renewal-case', async (req, res) => {
  try {
    const {
      customerName,
      policyNumber,
      addOns,
      remarks,
    } = req.body;

    const newRenewalCase = new RenewalCase({
      customerName,
      policyNumber,
      addOns,
      remarks,
    });

    await newRenewalCase.save(); // Save data to MongoDB

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'therheaway.in@gmail.com', // replace with your Gmail email
        pass: 'jzcl hubd wiil riel', // replace with your Gmail app password or use environment variables
      },
    });

    const mailOptions = {
      from: 'therheaway.in@gmail.com',
      to: 'therheaway.in@gmail.com ', // replace with recipient's email address
      subject: 'Renewal Case Motor Form Submission',
      html: `
        <p>Dear Customer,</p>
        <p>Your renewal case motor form details:</p>
        <p><strong>Customer Name:</strong> ${customerName}</p>
        <p><strong>Policy Number:</strong> ${policyNumber}</p>
        <p><strong>Add Ons:</strong> ${addOns}</p>
        <p><strong>Remarks:</strong> ${remarks}</p>
        <p>Thank you.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Form submitted and email sent successfully');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
