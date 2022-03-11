const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
require("dotenv").config();
const auth = require("../src/middleware/auth")

require("../src/database/connection");
const userModal = require("../src/database/modals/usermodal");

router.get("/", async (req, res) => {
  try {
    const getUser = await userModal.find();
    res.status(200).json({ message: "Users found", getUser });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

router.post("/signup", async (req, res) => {
  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const body = {
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: hashPassword,
  };

  const user = new userModal(body);

  const token = await user.generateAuthToken();

  res.cookie("token", token, {
    expires: new Date(Date.now() + 30000),
  });

  try {
    const createUser = await user.save();
    res.status(201).json({ message: "User created successfully", createUser });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const validUser = await userModal.findOne({ email: email });
    if (!validUser) {
      res.status(404).json({ message: "sorry, user does not exist" });
    }

    const isMatch = await bcrypt.compare(password, validUser.password);
    const token = await validUser.generateAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 30000)
    });

    if (isMatch) {
      res.status(200).json({ message: "User found successfully", validUser });
    } else if (password === "") {
      res.status(400).json({ message: "fields cannot be empty" });
    } else {
      res
        .status(401)
        .json({ message: "invalid login credentails, please try again" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.patch("/:id", async (req, res) => {
  const userId = req.params.id;
  const userById = await userModal.findById(userId);

  if (!userById) {
    res.status(404).json({ message: "sorry, user does not exist" });
  }

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  try {
    const userData = {
      name: req.body.name || userById.name,
      email: req.body.email || userById.email,
      phoneNumber: req.body.phoneNumber || userById.phoneNumber,
      password: !req.body.password ? userById.password : hashPassword,
    };

    const updateUser = await userModal.findByIdAndUpdate(userId, userData, {
      new: true,
    });
    if (!updateUser) {
      res.status(404).json({ message: "User not found" });
    } else {
      res
        .status(200)
        .json({ message: "User updated successfully", updateUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userById = await userModal.findById(userId);

    if (!userById) {
      res.status(404).json({ message: "User not found" });
    } else {
      const deleteUser = await userModal.findByIdAndDelete(userId);
      res
        .status(200)
        .json({ message: "User deleted successfully", deleteUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
