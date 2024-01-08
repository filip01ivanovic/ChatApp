const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

// login route
router.post("/login", async (req, res) => {
  // check if username and password are correct
  if (req.body.username.length < 4 || req.body.username.length > 30 || req.body.password.length < 4 || req.body.password.length > 30) {
      res.json({ status: false, text: "Username and password length must be between 4 and 30 characters!" });
      console.log("login not good");
      return;
  }

  // find potential user
  const potentialLogin = await pool.query(
    "SELECT id, username, passhash FROM users u WHERE u.username=$1",
    [req.body.username]
  );

  if (potentialLogin.rowCount > 0) {
    const isSamePass = await bcrypt.compare(
      req.body.password,
      potentialLogin.rows[0].passhash
    );
    if (isSamePass) {
      res.json({ status: true, text: "Logged in.", username: req.body.username });
    } else {
      res.json({ status: false, text: "Wrong username or password!" });
      console.log("login not good");
    }
  } else {
    res.json({ status: false, text: "Wrong username or password!" });
    console.log("login not good");
  }
});

// register route
router.post("/register", async (req, res) => {
  // check if username and password are correct
  if (req.body.username.length < 4 || req.body.username.length > 30 || req.body.password.length < 4 || req.body.password.length > 30) {
    res.json({ status: false, text: "Username and password length must be between 4 and 30 characters!"});
    console.log("register not good");
    return;
}

  // find potential user
  const existingUser = await pool.query(
    "SELECT username from users WHERE username=$1",
    [req.body.username]
  );

  if (existingUser.rowCount === 0) {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await pool.query(
      "INSERT INTO users(username, passhash) VALUES($1,$2) RETURNING id, username",
      [req.body.username, hashedPass]
    );

    res.json({ status: true, text: "User created." });
  } else {
    res.json({ status: false, text: "Username taken!" });
  }
});
module.exports = router;