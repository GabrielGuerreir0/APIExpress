const User = require("./User");
const Category = require("./Category");
const Tag = require("./Tag");
const Article = require("./Article");
const ArticleTag = require("./ArticleTag");

// 🔹 User -> Article (autor do artigo)
User.hasMany(Article, { foreignKey: "authorId", as: "articles" });
Article.belongsTo(User, { as: "author", foreignKey: "authorId" });

// 🔹 Category -> Article (categoria do artigo)
Category.hasMany(Article, { foreignKey: "categoryId", as: "articles" });
Article.belongsTo(Category, { as: "category", foreignKey: "categoryId" });

// 🔹 Article -> Tag (tags do artigo)
Article.belongsToMany(Tag, { through: ArticleTag, as: "tags" });
Tag.belongsToMany(Article, { through: ArticleTag, as: "articles" });

module.exports = { User, Category, Tag, Article, ArticleTag };
