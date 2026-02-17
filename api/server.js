require('dotenv').config();
const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;
const userRouter = require("./http/routes/users");
const authRouter = require("./http/routes/auth");
const authMiddleware = require("./http/middlewares/auth");
const adminMiddleware = require("./http/middlewares/admin");
const reservationRouter = require("./http/routes/reservations");

// Example of using middlewares, here Auth middleware check if the token is present THEN admin middleware check if the user is admin
app.use("/users", authMiddleware, adminMiddleware,  userRouter);

app.use("/auth", authRouter);
// Use of routes defined in /routes/reservations.js with /reservations prefix
app.use("/reservations", reservationRouter);

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