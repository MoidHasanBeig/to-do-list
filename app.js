const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');

const app = express();

let items = ["Buy Food", "Do laundry", "Study"];
let work = [];

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.listen(3000, () => {
  console.log("Server is live @ 3000");
})

app.get("/", (req, res) => {

  let day = date.getDate();

  res.render("list", {
    listTitle: day,
    newItems: items
  });

});

app.post("/", (req, res) => {
  let item = req.body.addField;
  console.log(req.body.list);
  if (req.body.list == "Work") {
    work.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }

});

app.get("/work", (req, res) => {
  res.render("list", {
    listTitle: "Work",
    newItems: work
  })
});
