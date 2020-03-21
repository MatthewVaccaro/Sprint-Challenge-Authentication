const router = require("express").Router();
const db = require("../helperFunctions");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res, next) => {
  const errorMessage = { message: "error, bad request" };

  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "error, bad request" });
    }

    const newUser = await db.createUser(req.body);
    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    //Validate body is being sent
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "error, bad request 1" });
    }
    // validate user exisits
    const user = await db.findUser({ username });
    if (!user) {
      return res.status(400).json({ message: "error, bad request 2" });
    }
    //validate password is correct
    const validatePassword = await bcrypt.compare(password, user.password);
    console.log("user.password", user.password);
    console.log("user.password", password);
    if (!validatePassword) {
      return res.status(400).json({ message: "error, bad request 3" });
    }
    //Create Token Payload
    const payload = {
      id: user.id,
      name: user.username
    };

    const token = await jwt.sign(payload, "Oreos are the best");

    return res.status(200).json({
      message: `welcome ${user.username}`,
      token: token
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
