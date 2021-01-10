const express = require("express");
var bodyParser = require("body-parser");
const allOpp = require("../../controller/ui/allopp");
const app = express();
const router = express.Router();
// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
router.use(urlencodedParser);
router.use(jsonParser);

router.get("/", allOpp.showIndexPage);
router.get("/category/:id", allOpp.category);
router.get("/single/:id", allOpp.showSinglePage);
router.get("/search", allOpp.search);
router.get("/author/:id", allOpp.getPOstByAuthor);
module.exports = router;
