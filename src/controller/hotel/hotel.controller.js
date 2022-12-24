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
const hotel_module_1 = __importDefault(require("../../modules/Hotel/hotel.module"));
class hotelController {
}
_a = hotelController;
hotelController.queryHotel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    const searchedCity = yield hotel_module_1.default.find({ city: query });
    res.send({ hotels: searchedCity });
});
hotelController.hotelList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hotelList = yield hotel_module_1.default.find();
    res.send({ result: hotelList });
});
hotelController.singleHotel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const hotel = yield hotel_module_1.default.findById(id);
    res.send(hotel);
});
hotelController.adminPostHotel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { city, title, country, images_large } = req.body;
    if (city && title && country) {
        try {
            const postHotel = new hotel_module_1.default({
                city,
                title,
                country,
                images_large,
            });
            console.log(postHotel);
            yield postHotel.save();
            res.status(201).send("Success");
        }
        catch (err) {
            console.error;
            res.status(400).send("Some error occured");
        }
    }
    else {
        res.status(401).send("All fields are required");
    }
});
exports.default = hotelController;
