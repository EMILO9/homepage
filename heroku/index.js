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
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk')
const { getVideoDurationInSeconds } = require('get-video-duration')


//Middleware
app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/../client/dist')));

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))

mongoClient.connect(
  connectionString,
  { useUnifiedTopology: true }
)
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("database");
    const users = db.collection("users");
    const raspberrypi = db.collection("raspberrypi's")

    app.post('/signup', [
      body('email').isEmail().withMessage('must be a valid email adress'),
      body('password').isLength({ min: 5 }).withMessage('password must be at least 5 chars long')
    ], (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(errors.errors[0].msg);
      }
      let { email, password } = req.body
      users.findOne({ email: email }).then(response => {
        if (response) res.status(400).send("Email already in use")
        else bcrypt.hash(password, 8, (err, hash) => {
          users.insertOne({ email: email, password: hash, admin: false }).then(r => res.status(200).send(r))
        });

      })
    });

    app.post('/login', (req, res) => {
      let { email, password } = req.body
      users.findOne({ email: email }).then(response => {
        if (!response) res.status(400).send("Email doesnt exists")
        else bcrypt.compare(password, response.password, function (err, result) {
          if (!result) res.status(400).send("Wrong password")
          else {
            let { _id, email, admin} = response
            let user = { _id, email, admin}
            jwt.sign(user, secretKey, (err, token) => {
              res.status(200).send({ token, user })
            })
          }
        });
      })
    })

    app.get('/private', verifyToken, (req, res) => {
      jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) res.status(403).send('No access token set')
        else {
          if (!authData.admin) {
            raspberrypi.find({userAccess: { $in: [authData.email] }}).toArray().then(r => {
              if (r.length === 0) res.status(400).send('You dont have access to any pcs')
              else res.status(200).send(r)
            }).catch(err => res.status(400).send(err))
          }
          else raspberrypi.find({}).toArray().then(r => res.status(200).send(r)).catch(err => res.status(400).send(err))
        }
      })
    })

    app.post('/addPc', verifyToken, (req, res) => {
      jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) res.status(403).send('No access token set')
        else {
          raspberrypi.insertOne({name: `PC_${uuidv4()}`,userAccess:[authData.email], "media":[]}).then(r => res.send(r.ops[0]))
        }
      })
    })

    app.delete('/deletePc/:id', verifyToken, (req, res) => {
      jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) res.status(403).send('No access token set')
        else {
          if (authData.admin) raspberrypi.deleteOne({_id: objectID(req.params.id)}).then(r => res.send(r))
          else {
            raspberrypi.findOne({userAccess: { $in: [authData.email] }, _id: objectID(req.params.id)}).then(r => {
              if (!r) res.status(403).send("You don't have access to that PC.")
              else raspberrypi.deleteOne({_id: objectID(req.params.id)}).then(r => res.send(r))
            })
          }
        }
      })
    })



    app.get('*', (req, res) => {
      res.sendFile(__dirname, '/dist/index.html');
    });

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