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
      enum: ["Jaffna", "Batticaloa", "Upcountry", "Vanni", "Muslim Tamil", "Other"],
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: { // Person created the book
      type: String,
      required: true,
    },
    media: {
      type: String,
      enum: ["print", "Trace", "Electronics"],
    },
    language: {
      type: String,
      enum: ["Tamil", "English", "Tamil-english"],
    },
    condition: {
      type: String,
      enum: ["New", "Fully old", "Half old","Illuminable"],
    },
    documentType: {
      type: String,
      enum: ["Documentation", "Book", "Magazine","News Paper", "Pamphlet", "flower", "Report", "Other"],
    },
    year: {
      type: number,
      required: true,
    },
    textStyle: {
      type: String,
      enum: ["Prose", "Rhyme", "Drama","Poetry", "Fiction"],
    },
    fullness: {
      type: String,
      enum: ["Full", "Half"],
    },
    publisher: {
      type: String,
      required: true,
    },
    copyright: {
      type: String,
      required: true,
    },
    internet reference: {
      type: String,
      required: true,
    },
    release: {
      type: String,
      required: true,
    },
    source holder: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    collector: {
      type: String,
      required: true,
    },
    Date: {
      type: String,
      required: true,
    },
    Key words: {
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
