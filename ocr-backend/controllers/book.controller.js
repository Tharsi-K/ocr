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

    // Handle filtering by book region (Jaffna, Eastern, Upcountry)
    let region = req.query.region;
    if (region === undefined || region === "all") {
      region = { $in: ["Jaffna", "Batticaloa", "Upcountry", "Vanni", "Muslim Tamil", "Other"] }; // Default to all regions if none specified
    }

    const approvalStatus = req.query.approvalStatus;
    let statusFilter = {}; // Default: No filter applied

    if (approvalStatus) {
      const statuses = approvalStatus.split(",");
      statusFilter = { approvalStatus: { $in: statuses } };
    }
    const books = await Book.find({
      name: { $regex: searchTerm, $options: "i" },
      region, // Add region filter
      ...statusFilter, // Include approvalStatus dynamically
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

export const approveBook = async (req, res, next) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Check if the book has exactly two reviews
    if (book.reviewCount !== 2) {
      return res.status(400).json({
        message:
          "Book cannot be approved until it has been reviewed by two users.",
      });
    }

    // Approve the book by setting approvalStatus to "Approved"
    book.approvalStatus = "Approved";

    await book.save();
    res.status(200).json({ message: "Book approved successfully", book });
  } catch (error) {
    console.error("Error approving book:", error);
    res.status(500).json({ message: "Failed to approve book" });
  }
};
