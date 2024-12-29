import express from "express";
import { placeOrder, updateOrder,cancelOrder,calculateTotalWithDiscounts } from "../controllers/OrderController.js";

const router = express.Router();
router.post("/",placeOrder);
router.put("/:order_id", updateOrder); 
router.delete("/:order_id", cancelOrder);
router.get("/customers/:customer_id/total", calculateTotalWithDiscounts); 


export default router;