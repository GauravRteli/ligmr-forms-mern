const mysqlConnection = require("../db");

const createUserTableQuery = `
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

const createUserTable = () => {
  mysqlConnection.query(createUserTableQuery, (err) => {
    if (err) {
      console.error("Error creating forms table:", err);
    } else {
      console.log("Forms table created or already exists");
    }
  });
};

module.exports = { createUserTable };
