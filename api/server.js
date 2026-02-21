require('dotenv').config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./doc/swaggerOptions");

const app = express();
app.use(express.json());
const port = 3000;

// Importing routes and middlewares
const userRouter = require("./http/routes/users");
const menuRouter = require("./http/routes/menu");
const authRouter = require("./http/routes/auth");
const reservationRouter = require("./http/routes/reservations");
const tableRouter = require("./http/routes/tables");
const authMiddleware = require("./http/middlewares/auth");
const adminMiddleware = require("./http/middlewares/admin");

const { getRequiredTableSizes } = require("./utils/tableAssigner");
const { checkTablesAvailability } = require("./http/validators/tableValidator");

// Check the presence of the JWT_SECRET_KEY
if (!process.env.JWT_SECRET_KEY) {
  console.error("Missing JWT_SECRET_KEY environment variable");
  process.exit(1);
}

app.use("/auth", authRouter);

// Example of using middlewares, here Auth middleware check if the token is present THEN admin middleware check if the user is admin
app.use("/users", authMiddleware, adminMiddleware,  userRouter);


// Use of routes defined in /routes/reservations.js with /reservations prefix
app.use("/reservations", authMiddleware, reservationRouter);

// Use of routes defined in /routes/menu.js with /menu prefix
app.use("/menu", menuRouter);

// Use of routes defined in /routes/tables.js with /tables prefix
app.use("/tables", authMiddleware, adminMiddleware, tableRouter);

//Base Endpoint
app.get("/", (req, res) => {
  res.send({
    greetings: "Welcome to API Restaurant :)",
  });
});

// Generation de la doc
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));


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