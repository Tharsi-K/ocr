import Book from "../models/book.model.js";
import { errorHandler } from "../utils/error.js";

export const createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    return res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return next(errorHandler(404, "Book not found!"));
  }

  if (req.user.id !== book.userRef) {
    return next(
      errorHandler(401, "You are not authorized to perform this action")
    );
  }

  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json("Book has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return next(errorHandler(404, "Book not found!"));
  }

  if (req.user.id !== book.userRef) {
    return next(
      errorHandler(401, "You are not authorized to perform this action")
    );
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // returns the modified document rather than the original one
    );
    res.status(200).json(updatedBook);
  } catch (error) {
    next(error);
  }
};

export const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return next(errorHandler(404, "Book not found!"));
    }
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

export const getAllBooks = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    // Handle filtering by book type (Jaffna, Eastern, Upcountry)
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["Jaffna", "Eastern", "Upcountry"] }; // Default to all types if none specified
    }

    const books = await Book.find({
      name: { $regex: searchTerm, $options: "i" },
      type, // Add type filter
    })
      .sort({
        [sort]: order,
      })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

