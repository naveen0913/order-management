import Products from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { product_name, price } = req.body;

    const product = await Products.create({
      product_name,
      price,
    });

    res.status(201).json({
      code: process.env.STATUS_CODE_CREATED,
      status: "Product created successfully!",
      product,
    });
  } catch (error) {
    res.status(500).json({
      code:process.env.STATUS_CODE_INTERNAL_ERROR,
      status: "Failed to create product",
      error: error.message,
    });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Products.findAll();

    res.status(200).json({ code: process.env.STATUS_CODE_SUCCESS, data: products });
  } catch (error) {
    res.status(500).json({
      code: process.env.STATUS_CODE_INTERNAL_ERROR,
      status: "Failed to fetch products",
      error: error.message,
    });
  }
};
