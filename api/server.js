const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;


//Base Endpoint
app.get("/", (req, res) => {
  res.send({
    greetings: "Welcome to API Restaurant :)",
  });
});

// 6. Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur Express démarré sur le port ${port}`);
});