const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const ArticleTag = sequelize.define("ArticleTag", {}, { timestamps: false });
module.exports = ArticleTag;
