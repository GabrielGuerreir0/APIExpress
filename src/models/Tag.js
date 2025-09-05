const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Tag = sequelize.define("Tag", {
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
});
module.exports = Tag;
