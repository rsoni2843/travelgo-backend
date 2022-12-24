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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../../modules/User/user.model"));
class SignupController {
}
_a = SignupController;
SignupController.userRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Taking input from User
    const { name, lname, email, password, password_confirmation, tc } = req.body;
    const user = yield user_model_1.default.findOne({ email: email });
    // Checking if user is already registered in the database
    if (user) {
        res
            .status(409)
            .send({ Status: "Failed", Message: "Email already exists" });
    }
    // If user is not in database creating new one
    else {
        // Checking if all the fields are there or not
        if (name && email && password && password_confirmation && tc) {
            // Checking password is equal to confirm password
            if (password === password_confirmation) {
                try {
                    const salt = yield bcrypt_1.default.genSalt(14);
                    const hashPassword = yield bcrypt_1.default.hash(password, salt);
                    const newUser = new user_model_1.default({
                        name: name,
                        lname: lname,
                        email: email,
                        password: hashPassword,
                        tc: tc,
                    });
                    yield newUser.save();
                    const saved_user = yield user_model_1.default.findOne({ email: email });
                    // Generating JWT Token
                    let token = jsonwebtoken_1.default.sign({ userID: saved_user === null || saved_user === void 0 ? void 0 : saved_user._id }, process.env.JWT_SECRET_KEY || "", { expiresIn: "5d" });
                    res.status(201).send({
                        Status: "Success",
                        Message: "User Created Successfully",
                        Token: token,
                    });
                }
                catch (err) {
                    console.log(err);
                    res.status(400).send({
                        Status: "Failed",
                        Message: "Can't Register",
                        err: err,
                    });
                }
            }
            // If password and confirm password not matching
            else {
                res.status(405).send({
                    Status: "Failed",
                    Message: "Password and Confirm Password doesn't match",
                });
            }
        }
        // If some fields or empty form is submitted then this will be used
        else {
            res
                .status(406)
                .send({ Status: "Failed", Message: "All fields are required" });
        }
    }
});
exports.default = SignupController;
