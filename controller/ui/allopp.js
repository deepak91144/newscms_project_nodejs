const postModel = require("../../model/post");
const categoryModel = require("../../model/category");
exports.showIndexPage = async (req, res) => {
	try {
		const post = await postModel
			.find({})
			.populate("category", "category")
			.populate("user", "user");
		const cat = await categoryModel.find({});

		post.forEach((ele, ind) => {
			const createdAt = ele.createdAt;
			ele.creationTime = createdAt.toDateString();
		});
		res.render("ui/index", { post: post, cat: cat });
	} catch (error) {
		console.log(error);
	}
};
exports.category = async (req, res) => {
	const catId = req.params.id;
	const post = await postModel
		.find({ category: catId })
		.populate("category", "category")
		.populate("user", "user");
	const cat = await categoryModel.find({});
	post.forEach((ele, ind) => {
		const createdAt = ele.createdAt;
		ele.creationTime = createdAt.toDateString();
	});

	res.render("ui/category", { post: post, cat: cat });
};
exports.showSinglePage = async (req, res) => {
	const postId = req.params.id;
	const post = await postModel
		.findOne({ _id: postId })
		.populate("category", "category")
		.populate("user", "user");
	const posts = await postModel
		.find({})
		.populate("category", "category")
		.populate("user", "user");
	const createdAt = post.createdAt;
	posts.forEach((ele, ind) => {
		const createdAt = ele.createdAt;
		ele.creationTime = createdAt.toDateString();
	});
	post.creationTime = createdAt.toDateString();
	const cat = await categoryModel.find({});
	res.render("ui/single", { posts: post, post: posts, cat: cat });
};

exports.search = async (req, res) => {
	const keyWord = req.query.search;
	const regex = new RegExp(keyWord, "i");
	const result = await postModel
		.find({ description: regex })
		.populate("category", "category")
		.populate("user", "user");
	const cat = await categoryModel.find({});
	const posts = await postModel
		.find({})
		.populate("category", "category")
		.populate("user", "user");
	result.forEach((ele, ind) => {
		const createdAt = ele.createdAt;
		ele.creationTime = createdAt.toDateString();
	});
	posts.forEach((ele, ind) => {
		const createdAt = ele.createdAt;
		ele.creationTime = createdAt.toDateString();
	});

	res.render("ui/search", {
		result: result,
		keyWord: keyWord,
		post: posts,
		cat: cat,
	});
};
exports.getPOstByAuthor = async (req, res) => {
	try {
		const authorId = req.params.id;

		const post = await postModel
			.find({ user: authorId })
			.populate("category", "category")
			.populate("user", "user");
		const cat = await categoryModel.find({});
		res.render("ui/author", { post: post, cat: cat });
	} catch (error) {}
};
