import express from "express";
import { Book } from "../models/bookModel.js";
import mongoose from "mongoose";

const router = express.Router();

// Route to save a new Book
router.post("/", async (req, res) => {
  try {
    // Check if any of the required fields are missing in the request body
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      // If any required field is missing, return a 400 status with an error message
      return res.status(400).send({
        message: "Please send all required fields: title, author, publishYear",
      });
    }

    // Create a new book object with the data from the request body
    const newBook = {
      title: req.body.title,
      author: req.body.author,
      publishYear: req.body.publishYear,
    };

    // Save the new book to the database using the Book model's create method
    const book = await Book.create(newBook);

    // Return a 201 status with the newly created book data
    return res.status(201).send(book);
  } catch (error) {
    // If an error occurs, log the error message and return a 500 status with an error message
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route to get all books from the database
router.get("/", async (req, res) => {
  try {
    // Attempt to retrieve all books from the database
    const books = await Book.find({});

    // Send a 200 OK response with the retrieved books data
    return res.status(200).json({
      count: books.length, // The number of books retrieved
      data: books, // The array of book objects
    });
  } catch (error) {
    // If an error occurs, log the error message and send a 500 Internal Server Error response
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route to get all books from the database by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Attempt to retrieve all books by id from the database
    const book = await Book.findById(id);

    // Send a 200 OK response with the retrieved books data
    return res.status(200).json({ book });
  } catch (error) {
    // If an error occurs, log the error message and send a 500 Internal Server Error response
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for Update a Book
router.put("/:id", async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const result = await Book.findByIdAndUpdate(id, req.body, { new: true });

    // If no book is found, return a 404
    if (!result) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Successfully updated the book
    return res.status(200).send({ message: "Book updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for Delete a book
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Received DELETE request for book with ID: ${id}`);
    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ messgae: error.message });
  }
});

export default router;
