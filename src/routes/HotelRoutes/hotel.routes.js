"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotel_controller_1 = __importDefault(require("../../controller/hotel/hotel.controller"));
const hotelRoute = express_1.default.Router();
hotelRoute.get("/", hotel_controller_1.default.queryHotel);
hotelRoute.get("/allHotels", hotel_controller_1.default.hotelList);
hotelRoute.get("/:id", hotel_controller_1.default.singleHotel);
hotelRoute.post("/postHotel", hotel_controller_1.default.adminPostHotel);
exports.default = hotelRoute;
