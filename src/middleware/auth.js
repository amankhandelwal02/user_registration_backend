const jwt = require("jsonwebtoken");
const userModal = require("../database/modals/usermodal");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const validUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!validUser) {
        res.status(404).json({ message: "sorry, user does not exist" });
      }
    const user = await userModal.findById({_id: validUser._id})
    console.log(user.name, "from auth")
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
  next();
};

module.exports = auth;
