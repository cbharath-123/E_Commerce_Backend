import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getSellerProducts
} from '../controllers/productController';
import { authenticateToken } from '../middleware/auth';
import { authenticateSellerWithOTP } from '../middleware/sellerAuth';

const router = express.Router();

// Product routes
router.get('/', getProducts);
router.get('/seller/my-products', authenticateSellerWithOTP, getSellerProducts); // Seller-only route with OTP
router.get('/:id', getProductById);
router.post('/', authenticateSellerWithOTP, createProduct); // Seller-only route with OTP
router.put('/:id', authenticateSellerWithOTP, updateProduct); // Seller-only route with OTP
router.delete('/:id', authenticateSellerWithOTP, deleteProduct); // Seller-only route with OTP

export default router;
