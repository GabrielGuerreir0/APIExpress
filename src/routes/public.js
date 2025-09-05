const { Router } = require("express");
const { Op } = require("sequelize");
const { Article, Category, Tag, User } = require("../models");
const { viewsQueue } = require("../jobs/queues");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         subtitle:
 *           type: string
 *         content:
 *           type: string
 *         slug:
 *           type: string
 *         status:
 *           type: string
 *         publishedAt:
 *           type: string
 *           format: date-time
 *         author:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         tags:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 */

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Lista artigos publicados com filtros e paginação
 *     tags:
 *       - Articles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               q:
 *                 type: string
 *                 description: Termo de busca no título, subtítulo ou conteúdo
 *               category:
 *                 type: string
 *                 description: Slug da categoria para filtrar artigos
 *               tags:
 *                 type: string
 *                 description: Lista de slugs de tags separados por vírgula
 *               page:
 *                 type: integer
 *                 default: 1
 *               pageSize:
 *                 type: integer
 *                 default: 10
 *               sort:
 *                 type: string
 *                 default: publishedAt:desc
 *     responses:
 *       200:
 *         description: Lista paginada de artigos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 */

router.post("/articles", async (req, res) => {
  const {
    q,
    category,
    tags,
    page = 1,
    pageSize = 10,
    sort = "publishedAt:desc",
  } = req.body; // agora vem do body
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
    { model: Category },
    { model: User, as: "author", attributes: ["id", "name"] },
    { model: Tag, as: "tags", through: { attributes: [] } },
  ];

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
  });

  res.json({
    data: result.rows,
    meta: { total: result.count, page: +page, pageSize: +pageSize },
  });
});

/**
 * @swagger
 * /api/articles/{slug}:
 *   get:
 *     summary: Retorna um artigo publicado pelo slug
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug do artigo
 *     responses:
 *       200:
 *         description: Artigo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Artigo não encontrado
 */
router.get("/articles/:slug", async (req, res) => {
  const article = await Article.findOne({
    where: { slug: req.params.slug, status: "published" },
    include: [
      { model: Category },
      { model: User, as: "author", attributes: ["id", "name"] },
      { model: Tag, as: "tags", through: { attributes: [] } },
    ],
  });

  if (!article) return res.status(404).json({ error: "Artigo não encontrado" });

  viewsQueue.add("inc", { articleId: article.id });
  res.json(article);
});

module.exports = router;
