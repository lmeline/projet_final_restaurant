require('dotenv').config();
const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;
const userRouter = require("./routes/users");


// Use of routes defined in /routes/users.js with /users prefix
app.use("/users", userRouter);

//Base Endpoint
app.get("/", (req, res) => {
  res.send({
    greetings: "Welcome to API Restaurant :)",
  });
});

// Server launch
app.listen(port, () => {
  console.log(`Express server launched, listening on ${process.env.DB_HOST}:${port}`);
});