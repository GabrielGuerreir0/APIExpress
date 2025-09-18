const { Router } = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { Article, Tag, Category } = require("../models");
const slugify = require("../utils/slugify");
const { z } = require("zod");
const { Op } = require("sequelize");
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
  authorize({ roles: ["EDITOR", "JOURNALIST"], loadResource: loadArticle }),
  async (req, res) => {
    try {
      const article = await loadArticle(req);

      if (!article) {
        return res.status(404).json({ error: "Artigo não encontrado" });
      }

      // Somente editores ou o próprio jornalista podem atualizar
      if (req.user.role === "JOURNALIST" && article.authorId !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Você não tem permissão para atualizar este artigo" });
      }

      const body = updateArticleSchema.parse(req.body);

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
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao atualizar artigo" });
    }
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
  authorize({
    roles: ["EDITOR", "JOURNALIST"],
    allowOwner: true, // permite que o dono delete
    loadResource: loadArticle,
  }),
  async (req, res) => {
    try {
      const article = await loadArticle(req);

      if (!article)
        return res.status(404).json({ error: "Artigo não encontrado" });

      await article.destroy();
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao deletar artigo" });
    }
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
    try {
      const { q } = req.query;

      const conditions = [];

      // Jornalista vê só os próprios artigos
      if (req.user.role === "JOURNALIST") {
        conditions.push({ authorId: req.user.id });
      }

      // Filtro de busca no título
      if (q) {
        conditions.push({ title: { [Op.iLike]: `%${q}%` } });
      }

      const where = conditions.length ? { [Op.and]: conditions } : {};

      const articles = await Article.findAll({
        where,
        order: [["publishedAt", "DESC"]],
      });

      res.json(articles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar artigos" });
    }
  }
);

module.exports = router;
