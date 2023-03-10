"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const emailConfig_1 = __importDefault(require("../../config/emailConfig"));
const user_model_1 = __importDefault(require("../../modules/User/user.model"));
const secretKey = process.env.JWT_SECRET_KEY;
class userPasswordReset {
}
_a = userPasswordReset;
userPasswordReset.sendUserPasswordResetEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // For restting email checking if email is there
    if (email) {
        const user = yield user_model_1.default.findOne({ email: email });
        // Checking if user exists in database
        if (user) {
            // Here we are creating a secret key for that particular user, it's same like as we are generating when the user logs in
            const secret = `${user === null || user === void 0 ? void 0 : user._id}${secretKey}`;
            // Generating a token which is valid for 15 minutes
            const token = jsonwebtoken_1.default.sign({ userID: user._id }, secret, {
                expiresIn: "15m",
            });
            // Creating a link for particular user which will be valid for 15 min because the token will expire after 15 minutes
            const link = `http:127.0.0.0.1:3000/api/user/reset/${user._id}/${token}`;
            let info = yield emailConfig_1.default.sendMail({
                from: process.env.EMAIL_FROM,
                to: user.email,
                subject: "Cure & Fit password reset link",
                html: `<h4>Hello ${user.name}, ${"\n"} <a href=${link}>Click Here</a> to reset your password</h4>`,
            });
            res.send({
                Status: "Success",
                Message: "Email sent success",
                Info: info,
            });
        }
        // If user not exists in database
        else {
            res.send({ Status: "Failed", Message: "Email doesn't exists" });
        }
    }
    // Email is not there
    else {
        res.send({
            Status: "Failed",
            Message: "Please fill the required fields",
        });
    }
});
userPasswordReset.userPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, password_confirmation } = req.body;
    // Getting this id and token from the params of the url(dynamic routing). Please check the userRoutes.ts to understand more
    const { id, token } = req.params;
    // Finding user
    const user = yield user_model_1.default.findById(id);
    // This new secret is same as created at the time when the email send request was made. See above function
    const newSecret = `${user === null || user === void 0 ? void 0 : user._id}${secretKey}`;
    try {
        // Verifying both the tokens here
        jsonwebtoken_1.default.verify(token, newSecret);
        // Checking passowrd and confirm password is there
        if (password && password_confirmation) {
            // If the password is not equal to confirm password
            if (password !== password_confirmation) {
                res.send({
                    status: "Failed",
                    message: "Password & confirm password doesn't match",
                });
            }
            // If passowrd and confirm password is equal
            else {
                const salt = yield bcrypt_1.default.genSalt(14);
                const newHashPassword = yield bcrypt_1.default.hash(password, salt);
                // Changing password here
                yield user_model_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
                    $set: { password: newHashPassword },
                });
                res.send({
                    status: "Success",
                    message: "Password changed successfully",
                });
            }
        }
        // If required fields are empty
        else {
            res.send({ Status: "Failed", Message: "All fields are required" });
        }
    }
    catch (err) {
        res.send({
            Status: "Failed",
            Message: "All fields are required",
            error: err,
        });
    }
});
exports.default = userPasswordReset;
