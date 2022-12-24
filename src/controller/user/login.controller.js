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
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../../modules/User/user.model"));
class LoginController {
}
_a = LoginController;
LoginController.userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Checking both if email & password are present
        if (email && password) {
            const user = yield user_model_1.default.findOne({ email: email });
            if (user != null) {
                const isMatch = yield bcrypt_1.default.compare(password, user.password);
                // Checking Both email and password are correct or not
                if (user.email === email && isMatch) {
                    let token = jsonwebtoken_1.default.sign({ userID: user === null || user === void 0 ? void 0 : user._id }, process.env.JWT_SECRET_KEY || "", { expiresIn: "5d" });
                    res.status(200).send({
                        Status: "Success",
                        Message: "Login Successfully",
                        Token: token,
                    });
                }
                // Checking either email or password is incorrect
                else {
                    res.status(401).send({
                        Status: "Failed",
                        Message: "Incorrect Details. Please check your email or password",
                    });
                }
            }
            // Checking if user not registered
            else {
                res
                    .status(405)
                    .send({ Status: "Failed", Message: "User not registered" });
            }
        }
        // Checking all fields are there in input
        else {
            res
                .status(406)
                .send({ Status: "Failed", Message: "All fields are required" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(408).send({ Message: "Unable to Login" });
    }
});
LoginController.loggedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Getting the token which was set in the userMiddleware and then finding the user
    const userToken = req.token;
    // Getting user here
    const user = yield user_model_1.default.findById(userToken);
    res.send({ User: user });
});
exports.default = LoginController;
