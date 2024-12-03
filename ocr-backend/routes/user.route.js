import express from "express";
// import { getUser, deleteUser, test, updateUser, getUserListings } from "../controllers/user.controller.js";
import { test, updateUser, deleteUser, getUserBooks, getUsers } from "../controllers/user.controller.js";
import { verifyToken, verifyAdmin } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/books/:id', verifyToken, getUserBooks)
router.get('/getAll', verifyToken, verifyAdmin, getUsers); // Route to get all users (Admin only)

// router.get('/:id', verifyToken, getUser)
//router.delete('/delete/:id', verifyToken, verifyAdmin, deleteUser);  // Only Admins can delete users

export default router;