const { Queue } = require("bullmq");
const connection = { host: process.env.REDIS_HOST || "redis", port: 6379 };
const viewsQueue = new Queue("views", { connection });
module.exports = { viewsQueue, connection };
