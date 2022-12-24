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
const user_model_1 = __importDefault(require("../../modules/User/user.model"));
class changePasswordController {
}
_a = changePasswordController;
changePasswordController.changeUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, password_confirmation } = req.body;
    if (password && password_confirmation) {
        if (password !== password_confirmation) {
            res.send({
                Status: "Failed",
                Message: "Password & confirm password doesn't match",
            });
        }
        else {
            const salt = yield bcrypt_1.default.genSalt(14);
            const newHashPassword = yield bcrypt_1.default.hash(password, salt);
            // Getting the token which was set in the userMiddleware and then finding the user for which the password needs to be changed
            const userToken = req.token;
            let user = yield user_model_1.default.findById(userToken).select("-password");
            // Changing password here
            yield user_model_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
                $set: { password: newHashPassword },
            });
            res.status(201).send({
                Status: "Success",
                Message: "Password changed successfully",
            });
        }
    }
    else {
        res.send({ Status: "Failed", Message: "All fields are required" });
    }
});
exports.default = changePasswordController;
