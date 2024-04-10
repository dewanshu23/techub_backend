
const dbStrings = {};
const userModel = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    stream VARCHAR(50) NOT NULL,
    passout INTEGER,
    year VARCHAR(30),
    userRole VARCHAR(20) NOT NULL,
    mobile VARCHAR(15),
    aboutMe TEXT,
    profilePic TEXT,
    otp VARCHAR(10),
    otpExpiry TIMESTAMP,
    isVerified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

dbStrings.userModel = userModel;
module.exports = dbStrings;
