require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const connectionString = process.env.CONNECTION_STRING
const morgan = require('morgan')
const cors = require('cors')
const mongoClient = require('mongodb').MongoClient
const objectID = require('mongodb').ObjectID
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator');

//Middleware
app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.json())

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))

mongoClient.connect(
    connectionString,
    { useUnifiedTopology: true }
  )
    .then((client) => {
      console.log("Connected to Database");
      const db = client.db("database");
      const users = db.collection("users");

      app.post('/signup', [
        body('email').isEmail().withMessage('must be a valid email adress'),
        body('password').isLength({ min: 5}).withMessage('must be at least 5 chars long')
      ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).send(errors);
        }
        let { email, password } = req.body
        users.findOne({ email: email }).then(response => {
          if (response) res.status(400).send("Email already in use")
          bcrypt.hash(password, 8, (err, hash) => {
            users.insertOne({ email: email, password: hash }).then(r => res.status(200).send(r.ops[0]))
          });

        })
      });
    
    })
    .catch((error) => console.error(error));

    // tete