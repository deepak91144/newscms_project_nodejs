const express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
const cookieParser = require("cookie-parser");
const { check, validationResult } = require("express-validator");
const allMidd = require("../../middleware/allmidd");
const adminController = require("../../controller/admin/user-controller");
const upload = require("express-fileupload");
const app = express();

const router = express.Router();
// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
router.use(urlencodedParser);
router.use(jsonParser);
router.use(upload());
router.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
	})
);
router.use(cookieParser());

router.get("/admin", allMidd.ifSessionSet, adminController.showAdminIndexPage);
router.get("/admin/users", allMidd.checkSession, adminController.showUsers);
router.get(
	"/admin/add-user",
	allMidd.ifSessionSet,
	adminController.showSignupPage
);
router.post(
	"/admin/save-user-data",
	allMidd.checkSession,
	[
		check("fname", "first name can not be empty").notEmpty(),
		check("lname", "last name can not be empty").notEmpty(),
		check("user", "username can not be empty").notEmpty(),
		check("password", "password can not be empty").notEmpty(),
		check("role").notEmpty(),
	],

	adminController.addUser
);
router.get(
	"/admin/user/delete/:id",
	allMidd.checkSession,
	adminController.deleteUser
);
router.get(
	"/admin/user/update/:id",
	allMidd.checkSession,
	adminController.showUpdateUserPage
);
router.post(
	"/admin/user/save-updated-user",
	allMidd.checkSession,
	adminController.saveUpdatedUser
);
router.get(
	"/admin/category",
	allMidd.checkSession,
	adminController.showCategoryPage
);
router.get(
	"/admin/category/add-category",
	allMidd.checkSession,
	adminController.showAddCategoryPage
);
router.post(
	"/admin/category/save-category",
	allMidd.checkSession,
	adminController.addCategory
);
router.get(
	"/admin/category/delete/:id",
	allMidd.checkSession,
	adminController.deleteCategory
);

router.get(
	"/admin/category/update/:id",
	allMidd.checkSession,
	adminController.showUpdateCategoryPage
);
router.post(
	"/admin/category/save-updated-category",
	allMidd.checkSession,
	adminController.saveUpdatedCategory
);
router.get("/admin/posts", allMidd.checkSession, adminController.fetchPost);
router.get(
	"/admin/post/add-post",
	allMidd.checkSession,
	adminController.showAddPostPage
);
router.post(
	"/admin/post/save-post",
	allMidd.checkSession,
	adminController.savePost
);
router.get(
	"/admin/post/delete/:id",
	allMidd.checkSession,
	adminController.deletePost
);
router.get(
	"/admin/post/update/:id",
	allMidd.checkSession,
	adminController.updatePost
);
router.post(
	"/admin/post/save-updated-post",
	allMidd.checkSession,
	adminController.saveUpdatedPost
);
router.post("/admin/login", adminController.login);
router.get("/admin/logout", allMidd.checkSession, adminController.logout);
router.get("/sendmail", adminController.sendMail);
module.exports = router;
