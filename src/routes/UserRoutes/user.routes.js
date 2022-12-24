"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_controller_1 = __importDefault(require("../../controller/user/signup.controller"));
const login_controller_1 = __importDefault(require("../../controller/user/login.controller"));
const userPasswordReset_controller_1 = __importDefault(require("../../controller/user/userPasswordReset.controller"));
const changePassword_controller_1 = __importDefault(require("../../controller/user/changePassword.controller"));
const userAuth_middleware_1 = __importDefault(require("../../middlewares/UserMiddleware/userAuth.middleware"));
const admin_middleware_1 = __importDefault(require("../../middlewares/AdminMiddleware/admin.middleware"));
const router = express_1.default.Router();
router.use("/changepassword", userAuth_middleware_1.default);
router.use("/loggedUser", userAuth_middleware_1.default);
// router.use("/getUsers", AdminController.adminLogin);
// Public Routes;
router.get("/", (req, res) => {
    res.send("Working User Routes");
});
router.post("/register", signup_controller_1.default.userRegistration);
router.post("/login", login_controller_1.default.userLogin);
router.post("/userPasswordReset", userPasswordReset_controller_1.default.sendUserPasswordResetEmail);
router.post("/resetPassword/:id/:token", userPasswordReset_controller_1.default.userPasswordReset);
// Private Routes
router.post("/changePassword", changePassword_controller_1.default.changeUserPassword);
router.get("/loggedUser", login_controller_1.default.loggedUser);
router.get("/getUsers", admin_middleware_1.default.getAllUsers);
router.get("/getUsers/:id", admin_middleware_1.default.getUser);
exports.default = router;
