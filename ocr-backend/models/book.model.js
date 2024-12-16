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
    region: {
      type: [String],
      enum: [
        "Jaffna",
        "Batticaloa",
        "Upcountry",
        "Vanni",
        "Muslim Tamil",
        "Other",
      ],
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: false,
    },
    userRef: {
      // Person created the book
      type: String,
      required: true,
    },
    media: {
      type: String,
      enum: [
        "Typing",
        "CharacterFile",
        "ComputerTyping",
        "Multimedia",
        "Trace",
        "Electronics",
      ],
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
      enum: [
        "Documentation",
        "Book",
        "Magazine",
        "News Paper",
        "Pamphlet",
        "flower",
        "Report",
        "Other",
      ],
    },
    year: {
      type: Number,
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
    },
    copyright: {
      type: String,
    },
    internetReference: {
      type: String,
    },
    release: {
      type: String,
    },
    sourceHolder: {
      type: String,
    },
    address: {
      type: String,
    },
    collector: {
      type: String,
    },
    date: { // Changed 'Date' to lowercase
      type: String,
    },
    keyWords: {
      type: String,
    },
    reviewCount: { type: Number, default: 0 },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Under Review", "Approved"],
      default: "Pending",
    },
    Pages: {
      type: String,
    },
    Size: {
      type: String,
      enum: ["A4", "A5", "B5", "B6", "Other"],
    },
    bookContent: [
      {
        chapterText: {
          type: String, // Store as plain text or HTML/Markdown
        },
      },
    ],
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;