require('dotenv').config();
const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;
const userRouter = require("./http/routes/users");
const authRouter = require("./http/routes/auth");
const authMiddleware = require("./http/middlewares/auth");
const adminMiddleware = require("./http/middlewares/admin");


// Example of using middlewares, here Auth middleware check if the token is present THEN admin middleware check if the user is admin
app.use("/users", authMiddleware, adminMiddleware,  userRouter);

app.use("/auth", authRouter);

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