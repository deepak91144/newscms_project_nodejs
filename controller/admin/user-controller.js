const userModel = require("../../model/user");
const categoryModel = require("../../model/category");
const { check, validationResult } = require("express-validator");
const postModel = require("../../model/post");
const nodeMailer = require("nodemailer");
const transporter = nodeMailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	requireTLS: false,
	auth: {
		user: "iamdj1111@gmail.com",
		pass: "9114411559",
	},
});
const mailOPtions = {
	from: "mystore@gmail.com",
	to: "deepak_dibyajyoti@hotmail.com",
	subject: "this is subject my store",
	text: "this is some demo text",
};

exports.showAdminIndexPage = async (req, res) => {
	const remember = req.cookies.remember;
	console.log(remember);
	if (remember != undefined) {
		console.log("no value");
		const resp = await userModel.findOne({ _id: remember });
		if (resp) {
			res.render("admin/admin-index", { user: resp });
		}
	}
	res.render("admin/admin-index", { user: "" });
};
exports.showUsers = async (req, res) => {
	const users = await userModel.find({});

	res.render("admin/users", { users: users });
};
exports.showSignupPage = (req, res) => {
	res.render("admin/add-user", { error: "" });
};
exports.addUser = async (req, res) => {
	try {
		const valRes = validationResult(req);
		if (valRes.isEmpty()) {
			const userDetails = req.body;
			const user = new userModel(userDetails);
			const resp = await user.save();
			if (resp) {
				const users = await userModel.find({});
				res.render("admin/users", { message: "new user added", users: users });
			}
		} else {
			console.log(valRes.mapped());
			res.render("admin/add-user", { error: valRes.mapped() });
		}
	} catch (error) {
		console.log(error);
	}
};
exports.deleteUser = async (req, res) => {
	try {
		const userId = req.params.id;
		const resp = await userModel.findOneAndRemove({ _id: userId });

		const users = await userModel.find({});
		res.redirect("/admin/users");
	} catch (error) {}
};
exports.showUpdateUserPage = async (req, res) => {
	const userId = req.params.id;
	const user = await userModel.findOne({ _id: userId });

	let isSelected = "";
	if (user.role == "1") {
		isSelected = "selected";
	}

	res.render("admin/update-user", { user: user, isSelected: isSelected });
};
exports.saveUpdatedUser = async (req, res) => {
	const user = req.body;
	console.log(user);
	const userId = user.id;
	const resp = await userModel.findOneAndUpdate({ _id: userId }, user);
	if (resp) {
		res.redirect("/admin/users");
	}
};
exports.showCategoryPage = async (req, res) => {
	const cat = await categoryModel.find({});
	res.render("admin/category", { cat: cat });
};
exports.showAddCategoryPage = (req, res) => {
	res.render("admin/add-category");
};
exports.addCategory = async (req, res) => {
	const cat = req.body;
	const category = new categoryModel(cat);
	const resp = await category.save();
	if (resp) {
		res.redirect("/admin/category");
	}
};
exports.deleteCategory = async (req, res) => {
	try {
		const catId = req.params.id;
		const resp = await categoryModel.findOneAndDelete({ _id: catId });
		if (resp) {
			res.redirect("/admin/category");
		}
	} catch (error) {}
};
exports.showUpdateCategoryPage = async (req, res) => {
	const catId = req.params.id;
	const cat = await categoryModel.findOne({ _id: catId });
	res.render("admin/update-category", { cat: cat });
};
exports.saveUpdatedCategory = async (req, res) => {
	const cat = req.body;
	console.log(cat);
	const catId = cat.id;
	const category = await categoryModel.findByIdAndUpdate({ _id: catId }, cat);
	res.redirect("/admin/category");
};
exports.showAddPostPage = async (req, res) => {
	try {
		const cat = await categoryModel.find({});
		res.render("admin/add-post", { cat: cat });
	} catch (error) {
		console.log(error);
	}
};
exports.savePost = async (req, res) => {
	const post = req.body;
	post.user = req.session.user;

	if (req.files) {
		const img = req.files.fileToUpload;
		const imgName = img.name;
		post.img = imgName;
		img.mv(`public/admin/postimg/${imgName}`);
		const p = new postModel(post);
		try {
			const incCat = await categoryModel.findOneAndUpdate(
				{ _id: post.category },
				{ $inc: { post: 1 } }
			);
		} catch (error) {}

		const resp = await p.save();
		res.redirect("/admin/posts");
	}
};
exports.fetchPost = async (req, res) => {
	try {
		const post = await postModel
			.find()
			.populate("category", "category")
			.populate("user", "user");
		post.forEach((ele, ind) => {
			const createdAt = ele.createdAt;
			ele.creationTime = createdAt.toDateString();
		});

		res.render("admin/post", { post: post });
	} catch (error) {
		console.log(error);
	}
};
exports.deletePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const resp = await postModel.findOneAndDelete({ _id: postId });
		if (resp) {
			const deletedCategory = await categoryModel.findOneAndUpdate(
				{ _id: resp.category },
				{ $inc: { post: -1 } }
			);

			res.redirect("/admin/posts");
		}
	} catch (error) {
		console.log(error);
	}
};
exports.updatePost = async (req, res) => {
	const postId = req.params.id;
	const resp = await postModel.findOne({ _id: postId });
	if (resp) {
		res.render("admin/update-post", { post: resp });
	}
};
exports.saveUpdatedPost = async (req, res) => {
	const post = req.body;
	const postId = post.id;
	console.log(post);
	const resp = await postModel.findOneAndUpdate({ _id: postId }, post);
	if (resp) {
		res.redirect("/admin/posts");
	}
};
exports.login = async (req, res) => {
	const user = req.body.user;
	const password = req.body.password;
	const rememberMe = req.body.remember;
	console.log(rememberMe);

	const resp = await userModel.findOne({ user: user, password: password });
	if (resp) {
		if (rememberMe == "true") {
			res.cookie("remember", resp._id);
		} else {
			res.clearCookie("remember");
		}
		req.session.user = resp._id;
		res.redirect("/admin/posts");
	} else {
		res.redirect("/admin");
	}
};
exports.logout = (req, res) => {
	req.session.destroy(function (err) {});
	res.redirect("/admin");
};
exports.sendMail = () => {
	transporter.sendMail(mailOPtions, (err, info) => {
		if (err) {
			console.log(err);
		} else {
			console.log({ mailsent: info });
		}
	});
};
