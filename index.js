const express = require("express");
const api = require("./route/api.route.js");
const cors = require("cors");
const app = express();

app.use(express.static("static"));
app.use("/api", api);

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(400).end();
})

app.listen(3000, () => {
  console.log("Server is running 3000 port");
})