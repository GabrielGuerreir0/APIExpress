const cron = require("node-cron");
const { Article } = require("../models");
cron.schedule("* * * * *", async () => {
  const now = new Date();
  await Article.update(
    { status: "published", publishedAt: now },
    {
      where: {
        status: "scheduled",
        publishAt: { [require("sequelize").Op.lte]: now },
      },
    }
  );
});
