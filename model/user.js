const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
	fname: String,
	lname: String,
	user: String,
	password: String,
	role: String,
	img: String,
});
const User = mongoose.model("user", userSchema);
module.exports = User;
