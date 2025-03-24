const dbStrings = {};

// 1. Users Table (Base Table)
const userModel = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(200),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    stream VARCHAR(50),
    passout INTEGER,
    year VARCHAR(30),
    userRole VARCHAR(20),
    mobile VARCHAR(15),
    aboutMe TEXT,
    profilePic TEXT,
    status VARCHAR(10) DEFAULT 'a',
    otp VARCHAR(10),
    otpExpiry TIMESTAMP,
    linkedin VARCHAR(50),
    twitter VARCHAR(50),
    isVerified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

// 2. Social Media & Activity Log
const socialMediaModel = `CREATE TABLE IF NOT EXISTS social_media (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER,
    facebook TEXT,
    instagram TEXT,
    linkedin TEXT,
    twitter TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);`;

const activityLog = `CREATE TABLE IF NOT EXISTS activity_log (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER,
    activity TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);`;

// 3. Follow System (User-to-User Relations)
const followModel = `CREATE TABLE IF NOT EXISTS follows (
    id SERIAL PRIMARY KEY NOT NULL,
    follower_id INTEGER,
    following_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (following_id) REFERENCES users(id)
);`;

// 4. Posts & Comments
const postModel = `CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER,
    content TEXT,
    description TEXT,
    title TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    type VARCHAR(2),
    status VARCHAR(2) DEFAULT 'r',
    for_user VARCHAR(4) DEFAULT 'all',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);`;

const commentModel = `CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY NOT NULL,
    post_id INTEGER,
    user_id INTEGER,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);`;

// 5. Likes (Interactions)
const likeModel = `CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY NOT NULL,
    post_id INTEGER,
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);`;

// 6. Login Activity (Authentication Tracking)
const loginActivityModel = `CREATE TABLE IF NOT EXISTS login_activity (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);`;

// 7. Chat System (Messaging)
const chat = `CREATE TABLE IF NOT EXISTS chat (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER,
    chat_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);`;

dbStrings.userModel = userModel;
dbStrings.socialMediaModel = socialMediaModel;
dbStrings.activityLog = activityLog;
dbStrings.followModel = followModel;
dbStrings.postModel = postModel;
dbStrings.commentModel = commentModel;
dbStrings.likeModel = likeModel;
dbStrings.loginActivityModel = loginActivityModel;
dbStrings.chat = chat;

module.exports = dbStrings;
