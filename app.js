var express = require("express");
var port = process.env.PORT || 3000;
var app = express(),
  path = require("path");
publicDir = path.join(__dirname, "build");

app.use(express.static(publicDir));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/test", (req, res) => {
  res.json({ test: "Test Web." });
});

app.listen(port, () => console.log(`Server listening on port ${port} 🔥`));
module.exports = app;
