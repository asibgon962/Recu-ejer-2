const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const persona_paths = require("./routes/endpoints.cjs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.text({ type: "text/plain" }));

app.use(persona_paths.router);
app.use(express.static("public"));

module.exports = app;
