const express = require("express");

const bodyParser = require("body-parser");

const myday = require(__dirname + "/day.js");

const app = express();
var elements = [];
var workElements = [];

app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
    let day = myday();
	res.render("list", {kindOfDay: day, newListItem: elements});
});

app.post("/", function(req, res) {
	var element = (req.body.newItem);
	
	if (req.body.buttoniya === "work") {
		workElements.push(element)
		res.redirect("/work");
	}else {
		elements.push(element);
        res.redirect("/");
	}
	
});

app.get("/work", function (req,res) {
	res.render("list", {kindOfDay: "work list", newListItem: workElements });
});

app.get("/about", function(req,res) {
	res.render("about");
});

app.listen(Process.env.PORT, function() {

	console.log("your todolist server is running");
});
