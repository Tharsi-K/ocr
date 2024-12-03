import { errorHandler } from "../utils/error.js";
import Review from "./../models/review.model.js";
import Book from "../models/book.model.js";

export const createReview = async (req, res, next) => {
  const { review, userRef, bookRef } = req.body;

  try {
    const book = await Book.findById(bookRef);
    if (!book) return next(errorHandler(404, "Book not found"));

    // Check if the user has already reviewed this book
    const existingReview = await Review.findOne({ bookRef, userRef });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this book." });
    }

    // Allow only two reviews before requiring admin approval
    if (book.reviewCount >= 2) {
      return res.status(400).json({ message: "This book requires admin approval." });
    }

    // Create a new review
    const newReview = new Review({ review, userRef, bookRef });
    await newReview.save();

    // Update book review count and approvalStatus if it reaches 2
    book.reviewCount += 1;
    if (book.reviewCount >= 2) {
      book.approvalStatus = "Under Review";
    }
    await book.save();

    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    next(error);
  }
};

export const getBookReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ bookRef: req.params.id })
      .populate("userRef", "username"); // Populate userRef with only the username field

    if (!reviews) {
      return next(errorHandler(404, "Reviews not found!"));
    }

    return res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};