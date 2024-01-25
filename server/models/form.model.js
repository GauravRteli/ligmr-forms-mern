const mysqlConnection = require("../db");

const createFormTableQuery = `
CREATE TABLE forms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phoneNo VARCHAR(20) NOT NULL,
    city VARCHAR(255) NOT NULL,
    userType VARCHAR(255) NOT NULL,
    fatherOccupation VARCHAR(255) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    course VARCHAR(255) NOT NULL,
    fundingSource VARCHAR(255) NOT NULL,
    budget VARCHAR(255) NOT NULL,
    intake VARCHAR(255) NOT NULL,
    experience VARCHAR(255) NOT NULL,
    englishProficiency VARCHAR(255) NOT NULL,
    appliedForFranceBefore VARCHAR(255) NOT NULL,
    destinationPreferences TEXT NOT NULL,
    careerFieldInterest VARCHAR(255) NOT NULL,
    careerAspirations TEXT NOT NULL,
    admissionCounseling VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

const createFormTable = () => {
  mysqlConnection.query(createFormTableQuery, (err) => {
    if (err) {
      console.error("Error creating forms table:", err);
    } else {
      console.log("Forms table created or already exists");
    }
  });
};

module.exports = { createFormTable };
