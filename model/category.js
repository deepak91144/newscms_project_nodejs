const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
	category: String,
	post: {
		type: Number,
		default: 0,
	},
});
const Category = mongoose.model("category", categorySchema);
module.exports = Category;
