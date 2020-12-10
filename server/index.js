require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const connectionString = process.env.CONNECTION_STRING
const secretKey = process.env.SECRET_KEY
const morgan = require('morgan')
const cors = require('cors')
const mongoClient = require('mongodb').MongoClient
const objectID = require('mongodb').ObjectID
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')

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
      body('password').isLength({ min: 5 }).withMessage('must be at least 5 chars long')
    ], (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(errors.errors[0].msg);
      }
      let { email, password } = req.body
      users.findOne({ email: email }).then(response => {
        if (response) res.status(400).send("Email already in use")
        else bcrypt.hash(password, 8, (err, hash) => {
          users.insertOne({ email: email, password: hash }).then(r => res.status(200).send(r))
        });

      })
    });

    app.get('/login', (req, res) => {
      console.log(req.body)
      let { email, password } = req.body
      users.findOne({ email: email }).then(response => {
        if (!response) res.status(400).send("Email doesnt exists")
        else bcrypt.compare(password, response.password, function (err, result) {
          if (!result) res.status(400).send("Wrong password")
          else {

            let { _id, email } = response
            let user = { _id, email }
            jwt.sign(user, secretKey, (err, token) => {
              res.status(200).send({ token, user })
            })
          }
        });
      })
    })

    app.get('/private', verifyToken, (req, res) => {
      jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) res.status(403)
        else {
          res.send(authData)
        }
      })
    })

  })
  .catch((error) => console.error(error));



  // FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.status(403).send('No access token set')
  }

}