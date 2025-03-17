
const dbStrings = {};
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
    otp VARCHAR(10),
    otpExpiry TIMESTAMP,
    isVerified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

const loginActivityModel = `CREATE TABLE IF NOT EXISTS login_activity (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);`;

const postModel = `CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER,
    post_content TEXT,
    post_image TEXT,
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

const likeModel = `CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY NOT NULL,
    post_id INTEGER,
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);`;

const followModel = `CREATE TABLE IF NOT EXISTS follows (
    id SERIAL PRIMARY KEY NOT NULL,
    follower_id INTEGER,
    following_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (following_id) REFERENCES users(id)
);`;

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

const chat = `CREATE TABLE IF NOT EXISTS chat (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER,
    chat_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);`;

dbStrings.userModel = userModel;
dbStrings.loginActivityModel = loginActivityModel;
dbStrings.postModel = postModel;
dbStrings.commentModel = commentModel;
dbStrings.likeModel = likeModel;
dbStrings.followModel = followModel;
dbStrings.userModel = userModel;
dbStrings.socialMediaModel = socialMediaModel;
dbStrings.activityLog = activityLog;
module.exports = dbStrings;
