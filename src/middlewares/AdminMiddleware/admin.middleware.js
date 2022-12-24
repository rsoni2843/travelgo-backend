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
const user_model_1 = __importDefault(require("../../modules/User/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AdminController {
}
_a = AdminController;
AdminController.adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Checking both if email & password are present
        if (email && password) {
            const user = yield user_model_1.default.findOne({ email: email });
            if (user != null) {
                const isMatch = yield bcrypt_1.default.compare(password, user.password);
                // Checking Both email and password are correct or not
                if (user.email === email && isMatch && user.role === "admin") {
                    let token = jsonwebtoken_1.default.sign({ userID: user === null || user === void 0 ? void 0 : user._id }, process.env.JWT_SECRET_KEY || "", { expiresIn: "5d" });
                    res.status(200).send({
                        Status: "Success",
                        Message: "Admin Login Successfully",
                        Token: token,
                    });
                }
                // Checking either email or password is incorrect
                else {
                    res.status(401).send({
                        Status: "Failed",
                        Message: "Not Allowed",
                    });
                }
            }
            // Checking if user not registered,
            else {
                res
                    .status(405)
                    .send({ Status: "Failed", Message: "Admin not registered" });
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
AdminController.getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield user_model_1.default.find();
    try {
        res.status(200).send({ users: allUsers });
    }
    catch (err) {
        console.error;
        res.send("Some Error Occured");
    }
});
AdminController.getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_model_1.default.findById(id);
    res.send(user);
});
exports.default = AdminController;
