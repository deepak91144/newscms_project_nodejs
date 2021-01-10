const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
	{
		title: String,
		description: {
			type: String,
			trim: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "category",
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
		img: String,
	},
	{ timestamps: true }
);
const Post = mongoose.model("post", postSchema);
module.exports = Post;
