const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    const userExists = users.some((user) => user.username === username);

    if (userExists) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Add user
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooks
        .then((bookList) => {
            res.status(200).send(JSON.stringify(bookList, null, 4));
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching books" });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

    try {
        const getBookByISBN = new Promise((resolve, reject) => {
            resolve(books[isbn]);
        });

        const book = await getBookByISBN;

        if (book) {
            res.status(200).send(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

    const findBooksByAuthor = new Promise((resolve, reject) => {
        const result = [];
        for (const id in books) {
            if (books[id].author === author) {
                result.push(books[id]);
            }
        }
        resolve(result);
    });

    findBooksByAuthor
        .then((booksByAuthor) => {
            res.status(200).send(booksByAuthor);
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching books by author" });
        });
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title;

    try {
        const findBooksByTitle = new Promise((resolve, reject) => {
            const result = [];
            for (const id in books) {
                if (books[id].title === title) {
                    result.push(books[id]);
                }
            }
            resolve(result);
        });

        const booksByTitle = await findBooksByTitle;
        res.status(200).send(booksByTitle);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
