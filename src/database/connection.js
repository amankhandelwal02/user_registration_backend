// getting-started.js
const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB Successfully");
  } catch (error) {
    console.log(error);
  }
}
