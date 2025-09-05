const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Category = sequelize.define("Category", {
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
});
module.exports = Category;
