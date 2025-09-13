import { Request, Response } from 'express';
import { prisma } from '../app';

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
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
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get seller's own products
export const getSellerProducts = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.userId;

    const products = await prisma.product.findMany({
      where: {
        sellerId: sellerId
      },
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
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
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
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    const sellerId = (req as any).user.userId;

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

    const product = await prisma.product.create({
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
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, category, stock } = req.body;
    const userId = (req as any).user.userId;

    // Check if product exists and belongs to user
    const existingProduct = await prisma.product.findUnique({
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

    const product = await prisma.product.update({
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
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    // Check if product exists and belongs to user
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (existingProduct.sellerId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
