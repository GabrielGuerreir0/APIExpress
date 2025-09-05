const app = require("./app");
const sequelize = require("./db");
require("./models");
(async () => {
  await sequelize.sync();
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`API on http://localhost:${port}`));
})();
