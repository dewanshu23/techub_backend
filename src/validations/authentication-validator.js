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
    stream: Joi.string().valid("BSc IT", "BSc CS", "BAF", "").required(),
    userRole: Joi.string().valid("Student", "Alumni", "Admin", "Teacher").required(),
    passout: Joi.number().max(2024).min(1980).required(),
    year: Joi.string().valid("First Year", "Second Year", "Third Year", "Pass Out").required(),
});
const userAccountLoginSchema = Joi.object({
    email: Joi.string().label("Email").required(),
    password: Joi.string().required(),
});
const sendOtpSchema = Joi.object({
    email: Joi.string().required()
});
const verifyOtpSchema = Joi.object({
    email: Joi.string().required(),
    otp: Joi.string().length(4).required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")).label("Confirm password").error(() => 'password and Confirm password not same.'),
});
const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")).label("Confirm password").error(() => 'password and Confirm password not same.')
});
const post = Joi.object({})
module.exports = {
    userAccountSignupSchema,
    userAccountLoginSchema,
    changePasswordSchema,
    sendOtpSchema,
    verifyOtpSchema
}