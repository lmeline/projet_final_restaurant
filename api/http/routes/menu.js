const express = require("express");
const router = express.Router();
const menuRepository = require("../../repositories/menuRepository");
const queryValidator = require("../validators/utils/queryValidator");

router.get("/", async (req, res) => {
  let parsedParams = queryValidator(req.query, {
    category: ["entree", "plat", "dessert"],
    "max-price": "number",
  });

  if (parsedParams.error) {
    res.status(400).json(parsedParams);
    return;
  }

  try {
    const [menu] = await menuRepository.listMenu(parsedParams);

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
