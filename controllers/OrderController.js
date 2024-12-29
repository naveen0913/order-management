import Orders from "../models/Order.js";
import Products from "../models/Product.js";

export const placeOrder = async (req, res) => {
  try {
    const {
      customer_id,
      product_id,
      product_name,
      quantity,
      price,
      order_date,
    } = req.body;
    const existingProduct = await Products.findByPk(product_id);
    console.log("product", existingProduct);
    if (!existingProduct) {
      return res.status(404).json({
        code: process.env.STATUS_CODE_NOT_FOUND,
        status: "Product not found",
      });
    }
    if (quantity <= 0 || price <= 0) {
      return res.status(400).json({
        code: process.env.STATUS_CODE_BAD_REQUEST,
        status: "error",
        message: "Quantity or Price should be greater than zero",
      });
    }
    await Orders.create({
      customer_id,
      product_id,
      product_name,
      quantity,
      price,
      order_date,
    });
    res.status(201).json({
      code: process.env.STATUS_CODE_CREATED,
      status: "success",
      message: "Order placed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      code: process.env.STATUS_CODE_INTERNAL_ERROR,
      status: "error",
      error: error.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { quantity, price } = req.body;
    const order = await Orders.findOne({ where: { order_id } });
    if (!order) {
      return res
        .status(404)
        .json({
          code: process.env.STATUS_CODE_NOT_FOUND,
          status: "error",
          message: "Order does not exist.",
        });
    }
    if (order.status === "delivered" || order.status === "canceled") {
      return res.status(400).json({
        code: process.env.STATUS_CODE_BAD_REQUEST,
        status: "error",
        message: "Cannot modify delivered or canceled orders.",
      });
    }
    if (quantity && quantity <= 0) {
      return res.status(400).json({
        code: process.env.STATUS_CODE_BAD_REQUEST,
        status: "error",
        message: "Quantity must be positive.",
      });
    }
    if (price && price <= 0) {
      return res.status(400).json({
        code: process.env.STATUS_CODE_BAD_REQUEST,
        status: "error",
        message: "Price must be positive.",
      });
    }

    await order.update({
      quantity: quantity,
      price: price,
    });
    res.status(200).json({
      code: process.env.STATUS_CODE_SUCCESS,
      status: "success",
      message: "Order updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      code: process.env.STATUS_CODE_INTERNAL_ERROR,
      status: "error",
      message: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    // Validations
    const order = await Orders.findOne({ where: { order_id } });
    if (!order) {
      return res
        .status(404)
        .json({
          code: process.env.STATUS_CODE_NOT_FOUND,
          status: "error",
          message: "Order does not exist.",
        });
    }

    if (order.status === "delivered") {
      return res.status(400).json({
        code: process.env.STATUS_CODE_BAD_REQUEST,
        status: "error",
        message: "Cannot cancel a delivered order.",
      });
    }

    // Cancel Order
    await order.destroy();

    res.status(200).json({
      code: process.env.STATUS_CODE_SUCCESS,
      status: "success",
      message: "Order canceled successfully.",
    });
  } catch (error) {
    res.status(500).json({
      code: process.env.STATUS_CODE_INTERNAL_ERROR,
      status: "error",
      message: error.message,
    });
  }
};

export const calculateTotalWithDiscounts = async (req, res) => {
  try {
    const { customer_id } = req.params;

    // Retrieve all active orders for the customer
    const orders = await Orders.findAll({
      where: { customer_id },
    });

    if (orders.length === 0) {
      return res.status(404).json({
        code: process.env.STATUS_CODE_NOT_FOUND,
        status: "error",
        message: "No active orders found for the customer.",
      });
    }

    let totalAmount = 0;
    let finalTotal = 0;
    const orderDetails = [];

    // Calculate total amount and apply discount individually for each order
    orders.forEach((order) => {
      const orderTotal = order.price * order.quantity;

      let orderDiscount = 0;
      let orderFinalTotal = orderTotal;

      // Apply discount if the order's total exceeds ₹5000
      if (orderTotal > 5000) {
        orderDiscount = 0.1 * orderTotal;
        orderFinalTotal = orderTotal - orderDiscount;
        totalAmount += orderTotal;
        finalTotal += orderFinalTotal;
        orderDetails.push({
          order_id: order.order_id,
          order_total: orderTotal,
          discount_applied: orderDiscount > 0 ? "10%" : "0%",
          final_total: orderFinalTotal,
        });
      }
    });

    res.status(200).json({
      code: 200,
      customer: customer_id,
      data: orderDetails,
    });
  } catch (error) {
    res.status(500).json({
      code: process.env.STATUS_CODE_INTERNAL_ERROR,
      status: "error",
      message: error.message,
    });
  }
};
