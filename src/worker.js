const { Worker } = require("bullmq");
const { connection } = require("./jobs/queues");
const { Article } = require("./models");
new Worker(
  "views",
  async (job) => {
    const { articleId } = job.data;
    await Article.increment("views", { by: 1, where: { id: articleId } });
  },
  { connection }
);
