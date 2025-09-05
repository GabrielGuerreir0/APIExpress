const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Article = sequelize.define("Article", {
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true },
  subtitle: DataTypes.STRING,
  content: { type: DataTypes.TEXT, allowNull: false },
  coverImageUrl: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM("draft", "scheduled", "published"),
    defaultValue: "draft",
  },
  publishAt: DataTypes.DATE,
  publishedAt: DataTypes.DATE,
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
});
module.exports = Article;
