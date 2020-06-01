const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secrets = require("../secrets");

const Users = require("../users/usersModel.js")

//endpoint to register
router.post('/register', (req, res) => {
    let user = req.body;
    const rounds = process.env.HASH_ROUNDS || 8;
    const hash = bcrypt.hashSync(user.password, rounds);
    user.password = hash;
    Users.addUser(user)
      .then(saved => {
        saved = {
          id: saved.id,
          username: saved.username
        }
        res.status(201).json({ message: "Thank you for registering!", saved });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: error.message });
      });
  });
  
  //endpoint to login
  router.post('/login', (req, res) => {
    let { username, password } = req.body;
    Users.findUserBy({ username })
      .then(([user]) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          const loggedUser = {
            id: user.id,
            username: user.username,
          }
          res.status(200).json({ 
           message: "Welcome!",
           loggedUser,
           token })
        } else {
          res.status(401).json({ message: "please provide valid credentials to access website." })
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: error.message });
      });
  });
  
  function generateToken(user) {
    const payload = {
      userId: user.id,
      username: user.username,
    };
    const secret = secrets.jwtSecret;
    const options = {
      expiresIn: 1000 * 60 * 8,
    };
  
    return jwt.sign(payload, secret, options);
  }
  
  
module.exports = router;