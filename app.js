const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');
const _ = require('lodash');

const app = express();

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item ({
  name: 'Hello'
});

const item2 = new Item ({
  name: 'Welcome to'
});

const item3 = new Item ({
  name: 'your to-do list!'
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List",listSchema);


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.listen(3000, () => {
  console.log("Server is live @ 3000");
})

let day = date.getDate();

app.get("/", (req, res) => {

  Item.find({},function(err,foundItems){

    if(foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log(defaultItems);
        }
      })
    }
    else {
      res.render("list", {
        listTitle: day,
        newItems: foundItems
      });
    }
  });


});

app.post("/", (req, res) => {
  let item = req.body.addField;
  let listName = req.body.list;

  const itemToInsert = new Item({
    name: item
  });

  if (listName !== day) {
    List.findOne({name: listName},function(err,foundList) {
      console.log("1",foundList);
      foundList.items.push(itemToInsert);
      foundList.save();
      res.redirect("/"+listName);
    });
  } else {
    itemToInsert.save();
    res.redirect("/");
  }

});

app.post("/delete", (req,res) => {
  let delId = req.body.checkbox;
  let listName = req.body.listName;

  if (listName === day) {
    Item.findByIdAndRemove(delId,function(err){
      console.log(err);
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull:{items:{_id:delId}}}, function(err, foundList) {
      if(!err) {
        res.redirect("/" + listName);
      }
    });
  }
});

app.get("/:listName", (req, res) => {
  const listName = _.capitalize(req.params.listName);

  List.findOne({name: listName},function(err,result) {
    if(err) {
      console.log(err);
    } else {
      if(result) {
        res.render("list", {
          listTitle: result.name,
          newItems: result.items
        });
      } else {
        const newList = new List({
          name: listName,
          items: defaultItems
        });

        newList.save();
        res.redirect("/"+listName);
      }
    }
  });


});
