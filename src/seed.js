// seed.js
const sequelize = require("./db");
const { User, Category, Tag, Article } = require("./models");
const bcrypt = require("bcryptjs");

async function seed() {
  try {
    // recria tabelas
    await sequelize.sync({ force: true });

    // Usuários
    const usersData = [
      {
        name: "Admin",
        email: "admin@example.com",
        role: "EDITOR",
        password: "123456",
      },
      {
        name: "João Silva",
        email: "joao@example.com",
        role: "JOURNALIST",
        password: "123456",
      },
      {
        name: "Maria Oliveira",
        email: "maria@example.com",
        role: "JOURNALIST",
        password: "123456",
      },
      {
        name: "Carlos Souza",
        email: "carlos@example.com",
        role: "EDITOR",
        password: "123456",
      },
      {
        name: "Ana Lima",
        email: "ana@example.com",
        role: "JOURNALIST",
        password: "123456",
      },
    ];

    const users = [];
    for (const u of usersData) {
      const passwordHash = await bcrypt.hash(u.password, 10);
      const user = await User.create({
        name: u.name,
        email: u.email,
        role: u.role,
        passwordHash,
      });
      users.push(user);
    }

    // Categorias
    const categoriesData = [
      { name: "Tecnologia", slug: "tecnologia" },
      { name: "Esporte", slug: "esporte" },
      { name: "Economia", slug: "economia" },
      { name: "Inovação", slug: "inovacao" },
      { name: "Indústria", slug: "industria" },
      { name: "Cultura", slug: "cultura" },
    ];
    const categoryInstances = await Promise.all(
      categoriesData.map((cat) => Category.create(cat))
    );

    // Tags
    const tagsData = [
      { name: "Node.js", slug: "nodejs" },
      { name: "Sequelize", slug: "sequelize" },
      { name: "Startup", slug: "startup" },
      { name: "Futebol", slug: "futebol" },
      { name: "Mercado", slug: "mercado" },
      { name: "Arte", slug: "arte" },
    ];
    const tagInstances = await Promise.all(
      tagsData.map((tag) => Tag.create(tag))
    );

    // Artigos com conteúdo maior
    const articlesData = [
      {
        title: "O Futuro da Tecnologia",
        slug: "futuro-tecnologia",
        subtitle: "Inovações e tendências no mundo tech",
        content:
          "A tecnologia está avançando rapidamente, com IA, blockchain e novas linguagens de programação revolucionando o mercado.\n" +
          "Empresas de todos os setores estão investindo em soluções digitais para otimizar processos e aumentar a produtividade.\n" +
          "O impacto dessas inovações no cotidiano das pessoas ainda está sendo descoberto, mas promete transformar profundamente a sociedade.",
        category: "Tecnologia",
        tags: ["Node.js", "Sequelize"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 1200,
      },
      {
        title: "Economia em 2025",
        slug: "economia-2025",
        subtitle: "O que esperar do mercado financeiro",
        content:
          "Previsões econômicas indicam crescimento em determinados setores e desafios em outros, impactando investimentos e consumo.\n" +
          "A inflação e as taxas de juros serão pontos críticos para empresas e consumidores.\n" +
          "Investidores devem analisar cuidadosamente o mercado antes de tomar decisões estratégicas, considerando riscos e oportunidades.",
        category: "Economia",
        tags: ["Mercado"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 980,
      },
      {
        title: "Startups que estão mudando o mundo",
        slug: "startups-mudando-mundo",
        subtitle: "Inovação e empreendedorismo",
        content:
          "Startups estão transformando indústrias com soluções criativas e disruptivas, atraindo investidores e atenção global.\n" +
          "Muitas dessas empresas nascem de ideias simples que resolvem problemas reais de forma inovadora.\n" +
          "O ecossistema empreendedor continua crescendo, com hubs de inovação surgindo em diferentes regiões.",
        category: "Inovação",
        tags: ["Startup"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1555949963-aa79dcee981d?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 870,
      },
      {
        title: "Indústria 4.0: a revolução na produção",
        slug: "industria-4-0",
        subtitle: "Automação e conectividade",
        content:
          "A indústria 4.0 integra máquinas inteligentes, sensores e análise de dados para otimizar produção e reduzir custos.\n" +
          "A conectividade entre sistemas permite monitoramento em tempo real e ajustes automáticos na produção.\n" +
          "O impacto da transformação digital na indústria promete maior eficiência e competitividade no mercado global.",
        category: "Indústria",
        tags: [],
        coverImageUrl:
          "https://images.unsplash.com/photo-1581092338187-4b0f7998e338?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 650,
      },
      {
        title: "Cultura brasileira em destaque",
        slug: "cultura-brasileira",
        subtitle: "Artes e manifestações culturais",
        content:
          "A cultura brasileira é rica e diversa, abrangendo música, literatura, dança e artes visuais, sendo referência mundial.\n" +
          "Festivais e exposições culturais atraem turistas e incentivam o desenvolvimento artístico.\n" +
          "Projetos de preservação cultural têm grande importância para manter a identidade nacional viva.",
        category: "Cultura",
        tags: ["Arte"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 430,
      },
      {
        title: "Grandes jogos de futebol do ano",
        slug: "jogos-futebol-ano",
        subtitle: "Análise dos principais confrontos",
        content:
          "Os campeonatos nacionais e internacionais trouxeram partidas emocionantes, com destaque para jogadores e técnicos de renome.\n" +
          "Torcedores acompanharam com grande expectativa as disputas, vibrando com cada lance.\n" +
          "Estatísticas e análises táticas foram utilizadas para avaliar o desempenho das equipes e orientar futuras estratégias.",
        category: "Esporte",
        tags: ["Futebol"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 1120,
      },
    ];

    for (const art of articlesData) {
      const catInstance = categoryInstances.find(
        (c) => c.name === art.category
      );
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const article = await Article.create({
        title: art.title,
        slug: art.slug,
        subtitle: art.subtitle,
        content: art.content,
        coverImageUrl: art.coverImageUrl,
        status: art.status,
        views: art.views,
        authorId: randomUser.id,
        categoryId: catInstance.id,
        publishAt: new Date(),
        publishedAt: new Date(),
      });

      const articleTags = tagInstances.filter((t) => art.tags.includes(t.name));
      if (articleTags.length > 0) {
        await article.addTags(articleTags);
      }
    }

    console.log("✅ Seed concluída com sucesso!");
    process.exit();
  } catch (err) {
    console.error("❌ Erro ao rodar seed:", err);
    process.exit(1);
  }
}

seed();
