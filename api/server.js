require('dotenv').config();
const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;
const userRouter = require("./http/routes/users");
const menuRouter = require("./http/routes/menu");
const authRouter = require("./http/routes/auth");
const authMiddleware = require("./http/middlewares/auth");
const adminMiddleware = require("./http/middlewares/admin");
const reservationRouter = require("./http/routes/reservations");
const { getRequiredTableSizes } = require("./utils/tableAssigner");
const { checkTablesAvailability } = require("./http/validators/tableValidator");


app.use("/auth", authRouter);

// Example of using middlewares, here Auth middleware check if the token is present THEN admin middleware check if the user is admin
app.use("/users", authMiddleware, adminMiddleware,  userRouter);


// Use of routes defined in /routes/reservations.js with /reservations prefix
app.use("/reservations", authMiddleware, reservationRouter);

// Use of routes defined in /routes/menu.js with /menu prefix
app.use("/menu", menuRouter);

//Base Endpoint
app.get("/", (req, res) => {
  res.send({
    greetings: "Welcome to API Restaurant :)",
  });
});

// Server launch
app.listen(port, () => {
  console.log(`Express server launched, listening on ${process.env.DB_HOST}:${port}`);

  //Test de la fonction d'assignation de tables
  const peopleCount = 17;
  const requiredSizes = getRequiredTableSizes(peopleCount);
  console.log(`For ${peopleCount} people, required table sizes are:`, requiredSizes);

  //Test de la fonction de vérification de disponibilité des tables
  const date = "2024-12-25";
  const time = "19:00";
  checkTablesAvailability(requiredSizes, date, time).then(result => {
    if (result.available) {
      console.log(`Tables are available for ${peopleCount} people on ${date} at ${time}. Table IDs:`, result.tableIds);
    } else {
      console.log(`Tables are NOT available for ${peopleCount} people on ${date} at ${time}. Reason:`, result.error);
    }
  }).catch(error => {
    console.error("Error checking table availability:", error);
  });
});