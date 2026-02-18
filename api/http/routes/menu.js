const express = require("express");
const router = express.Router();
const menuRepository = require("../../repositories/menuRepository");

router.get("/", async (req, res) => {
  try {
    const [menu] = await menuRepository.listMenu();

    let parsedMenu = {};
    menu.forEach((item) => {
      if (!parsedMenu[item.category]) {
        parsedMenu[item.category] = [];
      }
      parsedMenu[item.category].push(item);
    });
    res.json(parsedMenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
