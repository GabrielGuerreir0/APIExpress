const { Router } = require("express");
const { Op } = require("sequelize");
const { Article, Category, Tag, User } = require("../models");
const { viewsQueue } = require("../jobs/queues");

const router = Router();

router.post("/articles", async (req, res) => {
  const {
    q,
    category,
    tags,
    page = 1,
    pageSize = 10,
    sort = "publishedAt:desc",
  } = req.body;
  const [sortField, sortDir] = sort.split(":");

  const where = { status: "published" };
  if (q) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${q}%` } },
      { subtitle: { [Op.iLike]: `%${q}%` } },
      { content: { [Op.iLike]: `%${q}%` } },
    ];
  }

  const include = [
    { model: Category, as: "category" },
    { model: User, as: "author", attributes: ["id", "name"] },
    { model: Tag, as: "tags", through: { attributes: [] } },
  ];

  if (category) {
    const categoryInclude = include.find((i) => i.model === Category);
    if (categoryInclude) {
      categoryInclude.where = { slug: category };
      categoryInclude.required = true;
    }
  }

  const tagFilter = tags ? tags.split(",").map((t) => t.trim()) : null;

  const result = await Article.findAndCountAll({
    where,
    include: tagFilter
      ? [
          ...include,
          {
            model: Tag,
            as: "tags",
            where: { slug: tagFilter },
            required: true,
          },
        ]
      : include,
    order: [[sortField || "publishedAt", (sortDir || "desc").toUpperCase()]],
    limit: +pageSize,
    offset: (+page - 1) * +pageSize,
    distinct: true,
  });

  res.json({
    data: result.rows,
    meta: { total: result.count, page: +page, pageSize: +pageSize },
  });
});

// GET - Artigo por ID
router.get("/articles/id/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findOne({
      where: { id, status: "published" },
      include: [
        { model: Category }, // ✅ sem alias
        { model: User, as: "author", attributes: ["id", "name"] },
        { model: Tag, as: "tags", through: { attributes: [] } },
      ],
    });

    if (!article)
      return res.status(404).json({ error: "Artigo não encontrado" });

    viewsQueue.add("inc", { articleId: article.id });
    res.json(article);
  } catch (err) {
    console.error("Erro ao buscar artigo por ID:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET - Artigo por slug
router.get("/articles/:slug", async (req, res) => {
  const article = await Article.findOne({
    where: { slug: req.params.slug, status: "published" },
    include: [
      { model: Category }, // ✅ sem alias
      { model: User, as: "author", attributes: ["id", "name"] },
      { model: Tag, as: "tags", through: { attributes: [] } },
    ],
  });

  if (!article) return res.status(404).json({ error: "Artigo não encontrado" });

  viewsQueue.add("inc", { articleId: article.id });
  res.json(article);
});

module.exports = router;
