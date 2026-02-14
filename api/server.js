const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;
const userRepository = require("./repositories/userRepository");

app.get("/users", async (req, res) => {
    try {
        const [users] = await userRepository.listUser();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
});

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