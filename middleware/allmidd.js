exports.checkSession = (req, res, next) => {
	if (!req.session.user) {
		res.redirect("/admin");
	} else {
		next();
	}
};
exports.ifSessionSet = (req, res, next) => {
	if (req.session.user) {
		res.redirect("/admin/posts");
	} else {
		next();
	}
};
