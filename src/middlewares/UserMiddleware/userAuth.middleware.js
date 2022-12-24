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
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
// import { CustomRequest } from "./userMiddleware";
const secretKey = process.env.JWT_SECRET_KEY || "";
var authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    const { authorization } = req.headers;
    // !! Keep in mind to add "Bearer" before token
    if (authorization && authorization.startsWith("Bearer")) {
        try {
            // Getting token from header
            token = authorization.split(" ")[1];
            // Verifying Token
            const { userID } = jsonwebtoken_1.default.verify(token, secretKey);
            // Saving the token for the user so that we can access the user information from the token
            req.token = userID;
            // If everything above is good the will pass the next
            next();
        }
        catch (err) {
            // Token is there but user not authorized
            res.send({
                Status: "Failed",
                Message: "Unauthorised User",
            });
        }
    }
    // There is no token
    if (!token) {
        res.send({
            Status: "Failed",
            Message: "Unauthorised User, No Token",
        });
    }
});
exports.default = authMiddleware;
