import express from 'express'
import { createBook, deleteBook, updateBook, getBook, getAllBooks } from '../controllers/book.controller.js';
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/create', verifyToken, createBook);
router.delete('/delete/:id', verifyToken, deleteBook);
router.post('/update/:id', verifyToken, updateBook);
router.get('/get/:id', getBook);
router.get("/getAll", getAllBooks);

export default router;