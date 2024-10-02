import express from 'express'
import { createReview, getBookReviews } from '../controllers/review.controller.js';
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/create', verifyToken, createReview);
router.get("/get/:id", getBookReviews);

export default router;