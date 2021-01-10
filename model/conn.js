const mongoose = require("mongoose");
mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then((data) => {
		console.log("db connected");
	})
	.catch((err) => {
		console.log(err);
	});
