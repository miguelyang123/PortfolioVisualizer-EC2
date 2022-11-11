var express = require("express");
var port = process.env.PORT || 3000;
var app = express(),
  path = require("path"),
  publicDir = path.join(__dirname, "build");

app.use(express.static(publicDir));
// app.get("/", (req, res) => {
//   res.send("Test Web.");
// });
app.get("/", (req, res) => {
  res.send(path.join(__dirname, "build", "index.html"));
});

app.listen(port);
module.exports = app;

console.log("Server is running on http://127.0.0.1:3000/");
