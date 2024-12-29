import express from "express";
import { createProduct,getAllProducts } from "../controllers/ProductController.js";

const router = express.Router();

router.post("/add", createProduct); 
router.get("/all", getAllProducts); 

export default router;