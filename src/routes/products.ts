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

const router = express.Router();

// Product routes
router.get('/', getProducts);
router.get('/seller/my-products', authenticateToken, getSellerProducts); // New route for seller's products
router.get('/:id', getProductById);
router.post('/', authenticateToken, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

export default router;
