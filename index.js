const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');

const { GoogleGenerativeAI } = require('@google/generative-ai');
// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded bodies
app.use(express.json()); // to parse JSON bodies
app.use(cors());

const port = process.env.PORT || 5000;

// MongoDB connection URI
const uri = process.env.MONGODB_URI || "mongodb+srv://workmahmudulhasan:KGICmsBeFc2IXqNW@cluster0.eievigz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let client;
let collection;

// Function to connect to the MongoDB database
async function connectToMongoDB() {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('MongoDB connected...');
        const db = client.db('BookLocationDB'); // Replace with your database name
        collection = db.collection('BookLocations'); // Replace with your collection name

        // Create text index on tags field
        await collection.createIndex({ tags: "text" });

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

app.get("/", (req, res) => {
    res.send("Server is running");
});

// Define the route to handle the GET request
app.get('/search', async (req, res) => {
    const queryTag = req.query.tag;
    if (!queryTag) return res.status(400).send('Query parameter "tag" is required');

    try {
        // Create a regular expression for fuzzy matching
        const fuzzyQuery = new RegExp(queryTag.split('').join('.*'), 'i');
        const results = await collection.find({ bookName: { $regex: fuzzyQuery } }).toArray();
        res.json(results);
    } catch (error) {
        console.error('Error finding documents:', error);
        res.status(500).send('Error fetching data');
    }
});

const genAI = new GoogleGenerativeAI("AIzaSyBULyNuooWPvrJ2Q3IEN-mPhMe1_Ttcalw");
app.post('/chat', async (req, res) => {
    try {
        const { book, auth } = req.body
        const data = `tell me details about ${book} by ${auth}`
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(data);
        const response = await result.response.text();
        // console.log(response);
        res.send(response);
    } catch (error) {
        res.send(error.msg)
    }
});

// Start the server and connect to MongoDB
connectToMongoDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Closing MongoDB connection...');
    if (client) {
        await client.close();
    }
    process.exit(0);
});