const express = require("express");
const router = express.Router();
const db = require("../db");

const {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multer = require("multer");
const multerS3 = require("multer-s3");

// AWS configurations ...........
const s3Client = new S3Client({
  region: "process.env.REGION",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.BUCKET_NAME,
    acl: "private",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      let fieldName = file.fieldname; // Access the field name
      cb(null, `uploads/inquiry-form/${req.body.email}/${fieldName}.pdf`);
    },
    // to always set the content type to view the file in the browser
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
});

async function checkIfFileExists(key) {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  };

  try {
    const command = new HeadObjectCommand(params);
    await s3Client.send(command);
    console.log(`Object exists: ${key}`);
    return true;
  } catch (error) {
    if (error.name === "NotFound") {
      console.log(`Object does not exist: ${key}`);
      return false;
    } else {
      console.error("Error checking object existence:", error.message);
      throw error;
    }
  }
}

const getPdfUrl = async (key) => {
  if (!(await checkIfFileExists(key))) {
    return {
      success: false,
      msg: "File not found or expired !",
    };
  }

  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: "ligmrinquiryform",
      Key: key,
    }),
    { expiresIn: 300 }
  );
  return {
    success: true,
    url: url,
  };
};
router.post("/getPdfURL", async (req, res) => {
  try {
    // uploads/inquiry-form/email/cv.pdf
    const { key } = req.body;
    const url = await getPdfUrl(key);
    return res.status(200).json({
      success: true,
      url,
    });
  } catch (error) {
    console.error("Error getting object URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/applyForm", upload.single("cv"), async (req, res) => {
  try {
    const studentData = req.body;

    // Validate unique email and phone number
    const emailCheckQuery = `SELECT COUNT(*) as count FROM enquiry_forms WHERE email = ?`;
    const phoneCheckQuery = `SELECT COUNT(*) as count FROM enquiry_forms WHERE phoneNo = ?`;

    const emailCheckValues = [studentData.email];
    const phoneCheckValues = [studentData.phoneNo];

    db.query(
      emailCheckQuery,
      emailCheckValues,
      async (emailError, emailResults) => {
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
          INSERT INTO enquiry_forms (name, email, phoneNo, city, userType, fatherOccupation, qualification, course, fundingSource, budget, intake, experience, englishProficiency, appliedForFranceBefore, destinationPreferences, careerFieldInterest, careerAspirations, admissionCounseling)
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
              studentData.destinationPreferences,
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

router.get("/studentsByDateRange", (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      error: "Both startDate and endDate are required parameters.",
    });
  }

  // Convert date strings to MySQL format
  const formattedStartDate = startDate;
  const formattedEndDate = endDate;
  const selectQuery = `
  SELECT *
  FROM enquiry_forms
  WHERE createdAt >= ? AND createdAt <= ?
  ORDER BY createdAt DESC;
  `;
  const selectValues = [formattedStartDate, formattedEndDate + " 23:59:59"];

  db.query(selectQuery, selectValues, (error, results) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }

    res.status(200).json({ success: true, data: results });
  });
});

module.exports = router;
