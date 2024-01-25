const express = require("express");
const router = express.Router();
const Form = require("../models/FormSchema");
const sendMail = require("../helper/mailUtils");
const db = require("../db");

router.post("/applyForm", async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    const studentData = req.body;
    let des = "";
    studentData?.destinationPreferences?.map((item) => {
      des += item + ",";
    });
    const formId = form._id;
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
    <li>Phone No.: ${studentData.phoneNo}</li>
    <li>Email: ${studentData.email}</li>
    <li>City: ${studentData.city}</li>
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
      // "harshvardhan@egniol.in",
      "harshilprajapti9192@gmail.com",
      `New Student Enquiry #${formId}`,
      emailTemplate
    );
    return res.send({ success: true, form });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, error: error });
  }
});

router.post("/addData", async (req, res) => {
  try {
    const studentData = req.body;
    let des = studentData?.destinationPreferences?.join(",");

    // Validate unique email and phone number
    const emailCheckQuery = `SELECT COUNT(*) as count FROM forms WHERE email = ?`;
    const phoneCheckQuery = `SELECT COUNT(*) as count FROM forms WHERE phoneNo = ?`;

    const emailCheckValues = [studentData.email];
    const phoneCheckValues = [studentData.phoneNo];

    db.query(
      emailCheckQuery,
      emailCheckValues,
      async (emailError, emailResults) => {
        if (emailError) {
          console.error(emailError);
          return res.send({ success: false, error: "Email validation error" });
        }

        const emailCount = emailResults[0].count;

        if (emailCount > 0) {
          return res.send({ success: false, error: "Email already exists" });
        }

        db.query(
          phoneCheckQuery,
          phoneCheckValues,
          async (phoneError, phoneResults) => {
            if (phoneError) {
              console.error(phoneError);
              return res.send({
                success: false,
                error: "Phone number validation error",
              });
            }

            const phoneCount = phoneResults[0].count;

            if (phoneCount > 0) {
              return res.send({
                success: false,
                error: "Phone number already exists",
              });
            }

            const insertQuery = `
          INSERT INTO forms (name, email, phoneNo, city, userType, fatherOccupation, qualification, course, fundingSource, budget, intake, experience, englishProficiency, appliedForFranceBefore, destinationPreferences, careerFieldInterest, careerAspirations, admissionCounseling)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

            const insertValues = [
              studentData.name,
              studentData.email,
              studentData.phoneNo,
              studentData.city,
              studentData.userType,
              studentData.fatherOccupation,
              studentData.qualification,
              studentData.course,
              studentData.fundingSource,
              studentData.budget,
              studentData.intake,
              studentData.experience,
              studentData.englishProficiency,
              studentData.appliedForFranceBefore,
              des,
              studentData.careerFieldInterest,
              studentData.careerAspirations,
              studentData.admissionCounseling,
            ];

            db.query(
              insertQuery,
              insertValues,
              async (insertError, results) => {
                if (insertError) {
                  console.error(insertError);
                  return res.send({
                    success: false,
                    error: "Failed to save form data to the database",
                  });
                }

                const formId = results.insertId;

                // Rest of your email sending logic remains unchanged
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
            <!-- ... (same as before) ... -->
            </ul>
            <p>Please review the complete student information and take necessary actions.</p>
            <p>Sincerely,</p>
            <p>Your Student Enquiry System</p>
            </body>
            </html>
          `;
                await sendMail(
                  // "harshvardhan@egniol.in",
                  "harshilprajapti9192@gmail.com",
                  `New Student Enquiry #${formId}`,
                  emailTemplate
                );

                return res.send({ success: true, formId });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    return res.send({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
