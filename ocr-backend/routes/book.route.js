import express from 'express'
import { createBook, deleteBook, updateBook, getBook, getAllBooks, approveBook } from '../controllers/book.controller.js';
import { verifyToken, verifyAdmin } from "../utils/verifyUser.js";
const router = express.Router();
router.post('/create', verifyToken, createBook);
router.delete('/delete/:id', verifyToken, deleteBook);
router.post('/update/:id', verifyToken, updateBook);
router.get('/get/:id', getBook);
router.get("/getAll", getAllBooks);
router.put("/approve/:id", verifyToken, verifyAdmin, approveBook); // Route to approve a book (Admin only)
export default router;