const express = require('express');
const bodyParser = require('body-parser');

const app = express();

let items = ["Buy Food","Do laundry","Study"];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.listen(3000, () => {
  console.log("Server is live @ 3000");
})

app.get("/", (req,res) => {
  let currentDate = new Date();
  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }

  let day = currentDate.toLocaleDateString("en-US",options);

  res.render("list", {kindOfDay:day, newItems:items});

});

app.post("/", (req,res) => {
  let item = req.body.addField;
  items.push(item);
  res.redirect("/");

})
