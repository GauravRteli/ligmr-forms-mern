const express = require("express");
const router = express.Router();
const client = require("../db");
const sendMail = require("../helper/mailUtils");
router.post("/applyForm", async (req, res) => {
  try {
    client.connect();
    const db = client.db("ligmr-form");
    const collection = db.collection("posts");
    const result = await collection.insertOne(req.body);
    const studentData = req.body;
    let des = "";
    studentData?.destinationPreferences?.map((item) => {
      des += item + ",";
    });
    const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
    <title>New Student Enquiry</title>
    </head>
    <body>
    <h1>New Student Enquiry Form Submitted</h1>
    <p>Dear Admin,</p>
    <p>A new student enquiry form has been submitted with the following details:</p>
    <ul>
    <li>Name: ${studentData.name}</li>
    <li>User Type: ${studentData.userType}</li>
    <li>Father's Occupation: ${studentData.fatherOccupation}</li>
    <li>Qualification: ${studentData.qualification}</li>
    <li>Course: ${studentData.course}</li>
    <li>Funding Source: ${studentData.fundingSource}</li>
    <li>Budget: ${studentData.budget}</li>
    <li>Intake: ${studentData.intake}</li>
    <li>Experience: ${studentData.experience}</li>
    <li>English Proficiency: ${studentData.englishProficiency}</li>
    <li>Applied for France Before: ${studentData.appliedForFranceBefore}</li>
    <li>Destination Preferences: ${des}</li>
    <li>Career Field Interest: ${studentData.careerFieldInterest}</li>
    <li>Career Aspirations: ${studentData.careerAspirations}</li>
    <li>Admission Counseling: ${studentData.admissionCounseling}</li>
    </ul>
    <p>Please review the complete student information and take necessary actions.</p>
    <p>Sincerely,</p>
    <p>Your Student Enquiry System</p>
    </body>
    </html>
    `;
    await sendMail(
      "harshvardhan@egniol.in",
      // "gauravteli134@gmail.com",
      "New Student Enquiry",
      emailTemplate
    );
    return res.send({ success: true, result });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, error: error });
  } finally {
    client.close();
  }
});

module.exports = router;
