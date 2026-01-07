const express = require("express");
const cors = require("cors");
const pollRoutes = require("./routes/poll.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(pollRoutes)

module.exports = app;