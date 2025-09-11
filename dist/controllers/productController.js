"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const app_1 = require("../app");
// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await app_1.prisma.product.findMany({
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(products);
    }
    catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getProducts = getProducts;
// Get product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await app_1.prisma.product.findUnique({
            where: { id },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        console.error('Get product by ID error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getProductById = getProductById;
// Create product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, stock } = req.body;
        const sellerId = req.user.userId;
        // Validate required fields
        if (!name || !category || price === undefined || price === null) {
            return res.status(400).json({ message: 'Name, category, and price are required' });
        }
        // Validate and parse numeric values
        const parsedPrice = parseFloat(price);
        const parsedStock = parseInt(stock) || 0;
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({ message: 'Price must be a valid number greater than or equal to 0' });
        }
        if (parsedStock < 0) {
            return res.status(400).json({ message: 'Stock must be a valid number greater than or equal to 0' });
        }
        const product = await app_1.prisma.product.create({
            data: {
                name,
                description: description || '',
                price: parsedPrice,
                image: image || '',
                category,
                stock: parsedStock,
                sellerId
            },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    }
    catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createProduct = createProduct;
// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, image, category, stock } = req.body;
        const userId = req.user.userId;
        // Check if product exists and belongs to user
        const existingProduct = await app_1.prisma.product.findUnique({
            where: { id }
        });
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (existingProduct.sellerId !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }
        // Validate and parse numeric values if provided
        let parsedPrice = existingProduct.price;
        let parsedStock = existingProduct.stock;
        if (price !== undefined && price !== null) {
            parsedPrice = parseFloat(price);
            if (isNaN(parsedPrice) || parsedPrice < 0) {
                return res.status(400).json({ message: 'Price must be a valid number greater than or equal to 0' });
            }
        }
        if (stock !== undefined && stock !== null) {
            parsedStock = parseInt(stock);
            if (isNaN(parsedStock) || parsedStock < 0) {
                return res.status(400).json({ message: 'Stock must be a valid number greater than or equal to 0' });
            }
        }
        const product = await app_1.prisma.product.update({
            where: { id },
            data: {
                name: name || existingProduct.name,
                description: description !== undefined ? description : existingProduct.description,
                price: parsedPrice,
                image: image !== undefined ? image : existingProduct.image,
                category: category || existingProduct.category,
                stock: parsedStock
            },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        res.json({
            message: 'Product updated successfully',
            product
        });
    }
    catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateProduct = updateProduct;
// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        // Check if product exists and belongs to user
        const existingProduct = await app_1.prisma.product.findUnique({
            where: { id }
        });
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (existingProduct.sellerId !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }
        await app_1.prisma.product.delete({
            where: { id }
        });
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteProduct = deleteProduct;
