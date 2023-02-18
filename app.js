                                                                 //require

const express = require("express");

const bodyParser = require("body-parser");

const myday = require(__dirname + "/day.js");

const mongoose = require("mongoose");

const app = express();

const _ = require("lodash");

                                                                 //implemented

mongoose.connect("mongodb://127.0.0.1/listDB");

app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

                                                                 //itemSchema

const itemSchema = {
	name: String
}
const Item = mongoose.model("Item", itemSchema);

                                                                 //defaultItems

const item1 = new Item({
	name: "welcome to your todolist"
});
const item2 = new Item({
	name: "hit the + button to add the item"
});
const item3 = new Item({
	name: "hit the checkbox to delete the item"
});

const defaultItem = [item1, item2, item3];

                                                                 //listSchema

const listSchema = {
	name: String,
	items: [itemSchema]
}
const List = mongoose.model("List", listSchema);

     let day = myday();   
      
                                                               //rootRouteGetRequest

app.get("/", function(req, res) {
	
	Item.find({}, function(err, foundItem){
		if (foundItem.length === 0) {

     Item.insertMany(defaultItem, function(err) {
	    if (err) {
		 console.log(err);
	    } else {
		 console.log("items have been inserted succesfully");
	    }
     });
        res.redirect("/");

		} else {
			res.render("list", {kindOfDay: day, newListItem: foundItem});
		}
		
	});
});

                                                                 //rootRoutepostRequest

app.post("/", function(req, res) {
	const element = (req.body.newItem);
	const element2 = (req.body.buttoniya);
	const newItem = new Item ({
		name: element
	});

    if (element2 === day) {
		newItem.save();
	    res.redirect("/");
	} else {
		List.findOne({name: element2}, function(err, foundList) {
			foundList.items.push(newItem);
			foundList.save();
			res.redirect("/" + element2);
		});
	}
});

                                                                 //deleteRoute

app.post("/delete", function(req, res){
	const listName = (req.body.listName);
	const checkboxID = (req.body.checkbox);
	
	      if (listName === day) {
           Item.findByIdAndRemove(checkboxID, function(err) {
           	if (!err) {
           		console.log("succesfully deleted checked box");
			    res.redirect("/");
           	}
	       });
	      } else {
           		List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkboxID}}}, function(err) {
           			if (!err) {
           				res.redirect("/" + listName);
           				console.log(checkboxID);
           			}
           	});
          }
		
});
		


                                                                 //dynamicExpressRoute

app.get("/:customListName", function(req, res) {
	const requestedListName = _.capitalize(req.params.customListName);

	List.findOne({name: requestedListName}, function(err, existingList) {
		if(!err) {
			if(!existingList){
                 const newList = new List({
		         name: requestedListName,
		         items: defaultItem
	             });
	             newList.save();
	             res.redirect("/" + requestedListName);
		    } else {
		    	res.render("list", {kindOfDay: existingList.name, newListItem: existingList.items });

		    }
	    }
	});
}); 

                                                                 //app.listen

app.listen(5000, function() {

	console.log("your todolist server is running on 5000");
}); 




