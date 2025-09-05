const { Router } = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { Article, Tag, Category } = require("../models");
const slugify = require("../utils/slugify");
const { z } = require("zod");
const {
  createArticleSchema,
  updateArticleSchema,
} = require("../validations/article");

const router = Router();
router.use(auth);

const loadArticle = async (req) => Article.findByPk(req.params.id);

/**
 * @swagger
 * tags:
 *   - name: Articles
 *     description: Rotas de gerenciamento de artigos (somente admins/jornalistas)
 *
 * components:
 *   schemas:
 *     ArticleAdmin:
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
 *         authorId:
 *           type: integer
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
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/admin/articles:
 *   post:
 *     summary: Cria um novo artigo
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleAdmin'
 *     responses:
 *       201:
 *         description: Artigo criado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
router.post(
  "/articles",
  authorize({ roles: ["JOURNALIST", "EDITOR"] }),
  async (req, res) => {
    const body = createArticleSchema.parse(req.body);

    let slug = body.slug || slugify(body.title);
    const exists = await Article.findOne({ where: { slug } });
    if (exists) slug = `${slug}-${Date.now().toString().slice(-5)}`;

    const article = await Article.create({
      ...body,
      slug,
      authorId: req.user.id,
      status: body.status || "draft",
    });

    if (body.tagSlugs?.length) {
      const tags = await Tag.findAll({ where: { slug: body.tagSlugs } });
      await article.setTags(tags);
    }
    if (body.categorySlug) {
      const category = await Category.findOne({
        where: { slug: body.categorySlug },
      });
      if (category) await article.setCategory(category);
    }
    res.status(201).json(article);
  }
);

/**
 * @swagger
 * /api/admin/articles/{id}:
 *   patch:
 *     summary: Atualiza um artigo existente
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do artigo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleAdmin'
 *     responses:
 *       200:
 *         description: Artigo atualizado
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Artigo não encontrado
 */
router.patch(
  "/articles/:id",
  authorize({ roles: ["EDITOR"], allowOwner: true, loadResource: loadArticle }),
  async (req, res) => {
    const body = updateArticleSchema.parse(req.body);
    const article = await loadArticle(req);
    if (!article) return res.status(404).json({ error: "Não encontrado" });

    if (body.title && !body.slug) {
      article.slug = slugify(body.title);
    }
    await article.update(body);

    if (body.tagSlugs) {
      const tags = await Tag.findAll({ where: { slug: body.tagSlugs } });
      await article.setTags(tags);
    }
    if (body.categorySlug) {
      const category = await Category.findOne({
        where: { slug: body.categorySlug },
      });
      if (category) await article.setCategory(category);
    }
    res.json(article);
  }
);

/**
 * @swagger
 * /api/admin/articles/{id}:
 *   delete:
 *     summary: Remove um artigo
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do artigo
 *     responses:
 *       204:
 *         description: Artigo removido com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Artigo não encontrado
 */
router.delete(
  "/articles/:id",
  authorize({ roles: ["EDITOR"], allowOwner: true, loadResource: loadArticle }),
  async (req, res) => {
    const article = await loadArticle(req);
    if (!article) return res.status(404).end();
    await article.destroy();
    res.status(204).end();
  }
);

/**
 * @swagger
 * /api/admin/articles:
 *   get:
 *     summary: Lista todos os artigos (somente admin/jornalista)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de artigos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ArticleAdmin'
 */
router.get(
  "/articles",
  authorize({ roles: ["JOURNALIST", "EDITOR"] }),
  async (req, res) => {
    const data = await Article.findAll({
      include: [{ all: true, nested: true }],
    });
    res.json(data);
  }
);

module.exports = router;
