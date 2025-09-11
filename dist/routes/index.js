"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = exports.productRoutes = exports.authRoutes = void 0;
// Route exports
var auth_1 = require("./auth");
Object.defineProperty(exports, "authRoutes", { enumerable: true, get: function () { return __importDefault(auth_1).default; } });
var products_1 = require("./products");
Object.defineProperty(exports, "productRoutes", { enumerable: true, get: function () { return __importDefault(products_1).default; } });
var users_1 = require("./users");
Object.defineProperty(exports, "userRoutes", { enumerable: true, get: function () { return __importDefault(users_1).default; } });
