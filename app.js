const express = require("express");
require("dotenv").config();
require("./model/conn");
const uiRouter = require("./router/ui/allroute");
const adminRouter = require("./router/admin/users");
var session = require("express-session");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(uiRouter);
app.use(adminRouter);
app.use(
	session({
		secret: "deepak",
		resave: false,
		saveUninitialized: true,
	})
);
app.listen(3800);
