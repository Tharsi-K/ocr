import express from "express";
// import { getUser, deleteUser, test, updateUser, getUserListings } from "../controllers/user.controller.js";
import { test, updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
//import { verifyAdmin } from "../utils/verifyAdmin.js";

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
// router.get('/listings/:id', verifyToken, getUserListings)
// router.get('/:id', verifyToken, getUser)
//router.delete('/delete/:id', verifyToken, verifyAdmin, deleteUser);  // Only Admins can delete users

export default router;

