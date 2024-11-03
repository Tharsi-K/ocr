import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    ISBN: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Jaffna", "Eastern", "Upcountry"],
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: { // Person created the book
      type: String,
      required: true,
    },
    bookContent: [
      {
        chapterText: {
          type: String, // Store as plain text or HTML/Markdown
        }
      }
    ],
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
