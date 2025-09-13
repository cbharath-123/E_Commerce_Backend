"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const sellerAuth_1 = require("../middleware/sellerAuth");
const router = express_1.default.Router();
// Product routes
router.get('/', productController_1.getProducts);
router.get('/seller/my-products', sellerAuth_1.authenticateSellerWithOTP, productController_1.getSellerProducts); // Seller-only route with OTP
router.get('/:id', productController_1.getProductById);
router.post('/', sellerAuth_1.authenticateSellerWithOTP, productController_1.createProduct); // Seller-only route with OTP
router.put('/:id', sellerAuth_1.authenticateSellerWithOTP, productController_1.updateProduct); // Seller-only route with OTP
router.delete('/:id', sellerAuth_1.authenticateSellerWithOTP, productController_1.deleteProduct); // Seller-only route with OTP
exports.default = router;
