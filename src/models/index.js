const User = require("./User");
const Category = require("./Category");
const Tag = require("./Tag");
const Article = require("./Article");
const ArticleTag = require("./ArticleTag");

User.hasMany(Article, { foreignKey: "authorId" });
Article.belongsTo(User, { as: "author", foreignKey: "authorId" });

Category.hasMany(Article, { foreignKey: "categoryId" });
Article.belongsTo(Category, { foreignKey: "categoryId" });

Article.belongsToMany(Tag, { through: ArticleTag, as: "tags" });
Tag.belongsToMany(Article, { through: ArticleTag });

module.exports = { User, Category, Tag, Article, ArticleTag };
