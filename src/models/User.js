const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = sequelize.define("User", {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("JOURNALIST", "EDITOR"), allowNull: false },
});
module.exports = User;
