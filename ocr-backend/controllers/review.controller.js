import { errorHandler } from "../utils/error.js";
import Review from "./../models/review.model.js";

export const createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    return res.status(201).json(review);
  } catch (error) {
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