const mongoose = require("mongoose");
const validator = require("validator");
require("dotenv").config();
var jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 40,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "This email id is already in use"],
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    phoneNumber: {
      type: Number,
      required: true,
      minLength: 10,
      maxLength: 10,
      unique: [true, "This phone number id is already in use"],
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Invalid strong password");
        }
      },
    },
    authToken: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this.id.toString() },
      process.env.JWT_SECRET_KEY
    );
    this.authToken = this.authToken.concat({ token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};

const userModal = mongoose.model("User", userSchema);

module.exports = userModal;
