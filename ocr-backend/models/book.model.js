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
    userRef: {
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
      enum: ["New", "Fully old", "Half old", "Illuminable"],
    },
    documentType: {
      type: String,
      enum: ["Documentation", "Book", "Magazine", "News Paper", "Pamphlet", "flower", "Report", "Other"],
    },
    year: {
      type: Number,
      required: true,
    },
    textStyle: {
      type: String,
      enum: ["Prose", "Rhyme", "Drama", "Poetry", "Fiction"],
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
    internetReference: { // Changed to camelCase
      type: String,
      required: true,
    },
    release: {
      type: String,
      required: true,
    },
    sourceHolder: { // Changed to camelCase
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
    date: { // Changed 'Date' to lowercase
      type: String,
      required: true,
    },
    keyWords: { // Changed to camelCase
      type: String,
      required: true,
    },
    bookContent: [
      {
        chapterText: {
          type: String,
        }
      }
    ],
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
