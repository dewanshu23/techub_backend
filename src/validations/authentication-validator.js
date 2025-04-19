const BaseJoi = require("@hapi/joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);
const userAccountSignupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().min(6).max(100).required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string()
        .required()
        .valid(Joi.ref("password")),
    stream: Joi.string().valid("BSc IT", "BSc CS", "BAF", "IT/CS").required(),
    userRole: Joi.string().valid("Student", "Alumni", "Admin", "Teacher").required(),
    passout: Joi.number().max(2024).min(0).required(),
    year: Joi.string().valid("First Year", "Second Year", "Third Year", "PO").required(),
    mobile: Joi.string().min(10).max(15).optional(),
    aboutMe: Joi.string().max(500).optional(),
    profilePic: Joi.string().optional(),
    status: Joi.string().valid("a", "inactive").optional(),
    otp: Joi.string().optional(),
    otpExpiry: Joi.date().optional(),
    linkedin: Joi.string().uri().optional(),
    twitter: Joi.string().uri().optional(),
    isVerified: Joi.boolean().optional()
});
const userAccountLoginSchema = Joi.object({
    email: Joi.string().label("Email").required(),
    password: Joi.string().required(),
});

module.exports = {
    userAccountSignupSchema,
    userAccountLoginSchema
}