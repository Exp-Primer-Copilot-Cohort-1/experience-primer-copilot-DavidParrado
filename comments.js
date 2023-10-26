// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Create connection to MongoDB
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const dbName = 'mydb';

// Create middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('images'));

// Create route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Get comments from MongoDB
app.get('/getComments', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) throw err;
        const db = client.db(dbName);
        db.collection('comments').find({}).toArray((err, result) => {
            if (err) throw err;
            res.send(result);
            client.close();
        });
    });
});

// Post comments to MongoDB
app.post('/postComments', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) throw err;
        const db = client.db(dbName);
        db.collection('comments').insertOne(req.body, (err, result) => {
            if (err) throw err;
            res.send('Comment posted!');
            client.close();
        });
    });
});

// Listen to port 3000
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});