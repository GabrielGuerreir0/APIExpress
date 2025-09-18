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
      { name: "Inteligência Artificial", slug: "inteligencia-artificial" },
      { name: "Cibersegurança", slug: "ciberseguranca" },
      { name: "Fintech", slug: "fintech" },
      { name: "Sustentabilidade", slug: "sustentabilidade" },
      { name: "Games", slug: "games" },
      { name: "Cinema", slug: "cinema" },
    ];
    const tagInstances = await Promise.all(
      tagsData.map((tag) => Tag.create(tag))
    );

    // Artigos com conteúdo maior
    const articlesData = [
      // DADOS ANTERIORES
      {
        title: "O Futuro da Tecnologia",
        slug: "futuro-tecnologia",
        subtitle: "Inovações e tendências no mundo tech",
        content:
          "A tecnologia está avançando rapidamente, com IA, blockchain e novas linguagens de programação revolucionando o mercado.\n" +
          "Empresas de todos os setores estão investindo em soluções digitais para otimizar processos e aumentar a produtividade.\n" +
          "O impacto dessas inovações no cotidiano das pessoas ainda está sendo descoberto, mas promete transformar profundamente a sociedade.",
        category: "Tecnologia",
        tags: ["Node.js", "Sequelize", "Inteligência Artificial"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 1200,
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
        tags: ["Startup", "Mercado"],
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
        tags: ["Sustentabilidade"],
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
        title: "A Ascensão da IA Generativa",
        slug: "ascensao-ia-generativa",
        subtitle: "Como a Inteligência Artificial está criando arte e conteúdo",
        content:
          "Modelos de IA generativa estão revolucionando setores criativos, produzindo imagens, textos e músicas com qualidade impressionante.\n" +
          "O debate sobre os direitos autorais e a ética por trás dessas criações está cada vez mais intenso.\n" +
          "Profissionais de diversas áreas já utilizam essas ferramentas para acelerar o processo criativo e explorar novas possibilidades.",
        category: "Inovação",
        tags: ["Inteligência Artificial", "Arte"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1677756119517-756a188d2d94?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 1350,
      },
      {
        title: "Desafios da Cibersegurança em 2025",
        slug: "desafios-ciberseguranca-2025",
        subtitle: "Protegendo dados na era da IoT e 5G",
        content:
          "A expansão da Internet das Coisas (IoT) e da rede 5G cria novas vulnerabilidades que exigem abordagens de segurança mais robustas.\n" +
          "Ataques de ransomware e phishing continuam sendo as principais ameaças para empresas de todos os portes.\n" +
          "A conscientização e o treinamento de funcionários são essenciais para formar a primeira linha de defesa contra invasões.",
        category: "Tecnologia",
        tags: ["Cibersegurança", "Mercado"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1544890225-2f3faec4cd60?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 950,
      },

      {
        title: "A Indústria de Games e seu Crescimento Exponencial",
        slug: "industria-games-crescimento",
        subtitle: "Analisando o mercado de entretenimento que mais cresce",
        content:
          "O mercado global de games já supera as indústrias de cinema e música combinadas, com um faturamento bilionário.\n" +
          "Os eSports se consolidaram como uma modalidade esportiva legítima, com atletas profissionais e grandes premiações.\n" +
          "O desenvolvimento de jogos no Brasil vem ganhando destaque internacional, mostrando o potencial criativo do país.",
        category: "Esporte",
        tags: ["Games", "Mercado"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=800&q=80",
        status: "draft",
        views: 250,
      },
      {
        title: "Sustentabilidade na Prática: Como as Indústrias se Adaptam",
        slug: "sustentabilidade-na-pratica-industrial",
        subtitle: "Da economia circular ao uso de energia limpa",
        content:
          "A pressão por práticas ESG (Ambiental, Social e Governança) está levando a uma transformação no setor industrial.\n" +
          "A economia circular, que visa reutilizar e reciclar materiais ao máximo, ganha força como modelo de produção.\n" +
          "Investimentos em fontes de energia renovável, como solar e eólica, reduzem custos e a pegada de carbono das fábricas.",
        category: "Indústria",
        tags: ["Sustentabilidade", "Inovação"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 590,
      },
      {
        title: "O Renascimento do Cinema Pós-Pandemia",
        slug: "renascimento-cinema-pos-pandemia",
        subtitle: "Como as salas de cinema estão atraindo o público de volta",
        content:
          "Após um período de incertezas, a indústria cinematográfica aposta em grandes blockbusters e experiências imersivas.\n" +
          "A relação entre os lançamentos nos cinemas e nos serviços de streaming continua sendo um ponto de debate e experimentação.\n" +
          "Festivais de cinema, como Cannes e Veneza, retornam com força total, celebrando a sétima arte e ditando tendências.",
        category: "Cultura",
        tags: ["Cinema", "Arte"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 810,
      },
      {
        title: "Investimentos Verdes: Lucrando com a Sustentabilidade",
        slug: "investimentos-verdes-lucrando-sustentabilidade",
        subtitle:
          "O mercado de investimentos ESG e seu potencial de crescimento.",
        content:
          "Investir em empresas com forte desempenho ambiental, social e de governança (ESG) deixou de ser um nicho.\n" +
          "Hoje, é visto como uma estratégia inteligente para mitigar riscos e obter retornos sólidos a longo prazo.\n" +
          "Descubra como funciona este mercado e quais setores são os mais promissores.",
        category: "Economia",
        tags: ["Sustentabilidade", "Mercado"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1622630998477-208223c3581d?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 880,
      },
      {
        title: "Construindo APIs Robustas com Node.js e Sequelize",
        slug: "construindo-apis-nodejs-sequelize",
        subtitle: "Um guia prático para desenvolvedores back-end.",
        content:
          "Node.js se tornou um padrão de mercado para a construção de APIs rápidas e escaláveis.\n" +
          "Combinado com o ORM Sequelize, o gerenciamento de banco de dados se torna uma tarefa muito mais simples e segura.\n" +
          "Neste artigo, exploramos as melhores práticas para estruturar seu projeto, autenticação e validação de dados.",
        category: "Tecnologia",
        tags: ["Node.js", "Sequelize"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 2150,
      },
      {
        title: "VAR e Big Data: A Tecnologia que Transforma o Futebol",
        slug: "var-big-data-tecnologia-futebol",
        subtitle: "Da análise de desempenho de atletas à arbitragem de vídeo.",
        content:
          "O futebol moderno vai muito além das quatro linhas. A tecnologia está presente em cada aspecto do jogo.\n" +
          "O VAR (Video Assistant Referee) mudou a dinâmica da arbitragem, enquanto a análise de dados (Big Data) otimiza treinos e táticas.\n" +
          "Clubes que investem em tecnologia ganham uma vantagem competitiva significativa dentro e fora de campo.",
        category: "Esporte",
        tags: ["Futebol", "Inovação"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1593341646782-e01614c027d0?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 1420,
      },
      {
        title: "A Direção de Fotografia no Cinema Moderno",
        slug: "direcao-fotografia-cinema-moderno",
        subtitle: "Como a luz, a cor e o enquadramento contam uma história.",
        content:
          "A fotografia é um dos elementos mais poderosos da linguagem cinematográfica, capaz de evocar emoções e criar atmosferas únicas.\n" +
          "Diretores de fotografia utilizam técnicas complexas de iluminação e composição para traduzir a visão do diretor em imagens.\n" +
          "Analisamos o trabalho de grandes nomes e o impacto das novas tecnologias digitais nesta arte.",
        category: "Cultura",
        tags: ["Cinema", "Arte"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1543141441-6154817c1873?auto=format&fit=crop&w=800&q=80",
        status: "draft",
        views: 190,
      },
      {
        title: "Healthtechs: Como a IA está Salvando Vidas",
        slug: "healthtechs-como-ia-esta-salvando-vidas",
        subtitle: "A inovação no diagnóstico e tratamento de doenças.",
        content:
          "Startups do setor de saúde, as healthtechs, estão na vanguarda do uso de Inteligência Artificial.\n" +
          "Algoritmos de IA conseguem analisar exames de imagem com uma precisão surpreendente, auxiliando no diagnóstico precoce de doenças como o câncer.\n" +
          "Além disso, a IA otimiza a gestão hospitalar e o desenvolvimento de novos medicamentos.",
        category: "Inovação",
        tags: ["Inteligência Artificial", "Startup"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1576091160550-2173dba9996a?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 1800,
      },

      // ===== NOVOS 24 ARTIGOS (4 POR CATEGORIA) =====

      // --- Categoria: Tecnologia ---
      {
        title: "Computação Quântica: A Próxima Fronteira",
        slug: "computacao-quantica-proxima-fronteira",
        subtitle:
          "O que esperar dos computadores do futuro e seu poder revolucionário.",
        content:
          "A computação quântica promete resolver problemas hoje considerados impossíveis para os supercomputadores clássicos.\n" +
          "Seu potencial disruptivo abrange áreas como criptografia, desenvolvimento de novos materiais e medicina.\n" +
          "Empresas de tecnologia e governos estão em uma corrida para alcançar a supremacia quântica.",
        category: "Tecnologia",
        tags: ["Inovação", "Inteligência Artificial"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1614926121113-f36554437a6b?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 1950,
      },
      {
        title: "A Cultura DevOps e a Automação de Processos",
        slug: "cultura-devops-automacao-processos",
        subtitle:
          "Integrando desenvolvimento e operações para entregas mais rápidas e seguras.",
        content:
          "DevOps é mais do que um conjunto de ferramentas, é uma mudança cultural que une equipes de desenvolvimento e operações (TI).\n" +
          "A automação de builds, testes e deployments (CI/CD) é um pilar fundamental para acelerar o ciclo de vida do software.\n" +
          "Empresas que adotam DevOps relatam maior frequência de deployments, menor taxa de falhas e tempo de recuperação mais rápido.",
        category: "Tecnologia",
        tags: ["Node.js", "Startup"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1573495627361-ab2b3c616c8e?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 1100,
      },
      {
        title: "Plataformas Low-Code: O Fim da Programação Tradicional?",
        slug: "plataformas-low-code-fim-programacao",
        subtitle:
          "Democratizando a criação de software com interfaces visuais.",
        content:
          "Plataformas low-code e no-code permitem que pessoas com pouco ou nenhum conhecimento de programação criem aplicativos.\n" +
          "Elas aceleram drasticamente o desenvolvimento, mas também levantam questões sobre personalização e escalabilidade.\n" +
          "O debate está aberto: seriam elas o futuro do desenvolvimento ou apenas uma ferramenta para nichos específicos?",
        category: "Tecnologia",
        tags: ["Startup", "Inovação"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=800&q=80",
        status: "draft",
        views: 350,
      },

      // --- Categoria: Esporte ---
      {
        title: "Engenharia e Estratégia: Os Segredos da Fórmula 1",
        slug: "engenharia-estrategia-segredos-formula-1",
        subtitle: "Muito além da velocidade: a ciência por trás das corridas.",
        content:
          "Cada carro de Fórmula 1 é um protótipo de alta tecnologia, moldado por regras complexas de aerodinâmica e engenharia.\n" +
          "As estratégias de pit stop, gerenciamento de pneus e análise de dados em tempo real são tão cruciais quanto a habilidade do piloto.\n" +
          "A categoria serve como um laboratório para tecnologias que, eventualmente, chegam aos carros de rua.",
        category: "Esporte",
        tags: ["Inovação"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1599422555563-8db4a45056de?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 990,
      },
      {
        title: "Nutrição Esportiva: O Combustível dos Atletas",
        slug: "nutricao-esportiva-combustivel-atletas",
        subtitle:
          "A ciência da alimentação para máxima performance e recuperação.",
        content:
          "A dieta de um atleta de elite é meticulosamente planejada para otimizar energia, força e recuperação muscular.\n" +
          "Macronutrientes e micronutrientes são balanceados de acordo com a modalidade e a fase de treinamento.\n" +
          "A suplementação, quando bem orientada, pode fazer a diferença entre o primeiro e o segundo lugar.",
        category: "Esporte",
        tags: ["Inovação"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 760,
      },

      // --- Categoria: Economia ---
      {
        title: "Criptomoedas e o Futuro do Dinheiro",
        slug: "criptomoedas-futuro-dinheiro",
        subtitle:
          "Além do Bitcoin: entendendo o universo das finanças descentralizadas (DeFi).",
        content:
          "As criptomoedas representam uma mudança de paradigma na forma como entendemos e transacionamos valor.\n" +
          "O ecossistema de Finanças Descentralizadas (DeFi) busca recriar o sistema financeiro tradicional em blockchain, sem intermediários.\n" +
          "A volatilidade e os desafios regulatórios são os principais obstáculos para a adoção em massa.",
        category: "Economia",
        tags: ["Fintech", "Mercado"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 1500,
      },
      {
        title: "AgroTech: A Inovação no Agronegócio Brasileiro",
        slug: "agrotech-inovacao-agronegocio-brasileiro",
        subtitle:
          "Como a tecnologia está aumentando a produtividade e a sustentabilidade no campo.",
        content:
          "Startups do agronegócio, as AgTechs, estão levando a transformação digital para o campo.\n" +
          "Drones, sensores, GPS e inteligência artificial são usados para otimizar o plantio, a colheita e o uso de recursos.\n" +
          "Essa inovação é crucial para garantir a segurança alimentar global de forma mais sustentável.",
        category: "Economia",
        tags: ["Startup", "Sustentabilidade"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1621926943593-c98b6f334a17?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 920,
      },

      // --- Categoria: Inovação ---
      {
        title: "A Nova Corrida Espacial: Startups e a Exploração Privada",
        slug: "nova-corrida-espacial-startups-exploracao-privada",
        subtitle: "O espaço deixou de ser um domínio exclusivo de governos.",
        content:
          "Empresas como SpaceX, Blue Origin e Virgin Galactic estão barateando o acesso ao espaço e impulsionando uma nova era de exploração.\n" +
          "O foco vai desde o turismo espacial até a criação de constelações de satélites para internet global.\n" +
          "Essa nova corrida espacial promete acelerar a inovação tecnológica em diversas áreas.",
        category: "Inovação",
        tags: ["Startup"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1610296669228-602fa827fc1f?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 1600,
      },
      {
        title: "Biotecnologia: Editando o Futuro com CRISPR",
        slug: "biotecnologia-editando-futuro-crispr",
        subtitle:
          "A ferramenta de edição genética que está revolucionando a medicina.",
        content:
          "CRISPR é uma tecnologia que permite 'recortar e colar' trechos de DNA com uma precisão sem precedentes.\n" +
          "Seu potencial para curar doenças genéticas é imenso, mas também levanta profundas questões éticas.\n" +
          "A pesquisa avança rapidamente, prometendo transformar a forma como tratamos o câncer, o HIV e outras doenças.",
        category: "Inovação",
        tags: ["Tecnologia"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1532187643623-dbf26353d95c?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 1320,
      },
      {
        title: "O Poder do UX/UI Design em Produtos Digitais",
        slug: "poder-ux-ui-design-produtos-digitais",
        subtitle:
          "Por que uma boa experiência do usuário é crucial para o sucesso.",
        content:
          "UX (User Experience) e UI (User Interface) são disciplinas focadas em tornar produtos digitais fáceis e agradáveis de usar.\n" +
          "Um bom design não é apenas sobre aparência, mas sobre funcionalidade, acessibilidade e a jornada do usuário.\n" +
          "Empresas que investem em design centrado no usuário veem maior engajamento, conversão e lealdade dos clientes.",
        category: "Inovação",
        tags: ["Startup", "Tecnologia"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 1150,
      },
      {
        title: "Economia Circular: Inovando para um Futuro sem Desperdício",
        slug: "economia-circular-inovando-futuro-sem-desperdicio",
        subtitle:
          "Repensando o ciclo de vida dos produtos, do design ao descarte.",
        content:
          "Diferente do modelo linear 'extrair-produzir-descartar', a economia circular busca eliminar o lixo e a poluição.\n" +
          "O modelo se baseia em três princípios: design sem resíduos, manter produtos e materiais em uso, e regenerar sistemas naturais.\n" +
          "Além do benefício ambiental, a economia circular representa uma enorme oportunidade de negócio.",
        category: "Inovação",
        tags: ["Sustentabilidade", "Indústria"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1604187351543-85570b2a76a8?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 840,
      },

      // --- Categoria: Indústria ---
      {
        title: "Manufatura Aditiva: A Revolução da Impressão 3D",
        slug: "manufatura-aditiva-revolucao-impressao-3d",
        subtitle:
          "Da prototipagem rápida à produção de peças finais complexas.",
        content:
          "A impressão 3D, ou manufatura aditiva, está transformando a indústria ao permitir a criação de objetos camada por camada.\n" +
          "Ela é usada para criar desde protótipos rápidos até peças de avião, próteses médicas e até mesmo casas.\n" +
          "A tecnologia reduz desperdício de material e permite designs que seriam impossíveis com métodos tradicionais.",
        category: "Indústria",
        tags: ["Tecnologia", "Inovação"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1611606013214-38a34a87071e?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 790,
      },
      {
        title: "Logística 4.0: Cadeias de Suprimentos Inteligentes",
        slug: "logistica-4-0-cadeias-suprimentos-inteligentes",
        subtitle:
          "Como a tecnologia está otimizando o fluxo de mercadorias globalmente.",
        content:
          "A Logística 4.0 utiliza tecnologias como IoT, IA e blockchain para criar cadeias de suprimentos mais eficientes e transparentes.\n" +
          "O rastreamento de cargas em tempo real, a automação de armazéns e a previsão de demanda são algumas de suas aplicações.\n" +
          "A otimização logística é fundamental para a competitividade em um mercado globalizado.",
        category: "Indústria",
        tags: ["Tecnologia", "Mercado"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1577562432857-19a6b1e6be48?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 880,
      },
      {
        title: "A Transição Energética na Indústria Pesada",
        slug: "transicao-energetica-industria-pesada",
        subtitle:
          "Os desafios e oportunidades de descarbonizar setores como aço e cimento.",
        content:
          "A indústria pesada é um dos maiores emissores de gases de efeito estufa, e sua descarbonização é um desafio complexo.\n" +
          "Alternativas como o hidrogênio verde, a eletrificação de processos e a captura de carbono estão sendo exploradas.\n" +
          "A transição energética não é apenas uma necessidade ambiental, mas também uma oportunidade de modernização e inovação.",
        category: "Indústria",
        tags: ["Sustentabilidade"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1543499459-d8c35231c548?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 610,
      },
      {
        title: "Robótica Colaborativa: Humanos e Máquinas Lado a Lado",
        slug: "robotica-colaborativa-humanos-maquinas-lado-a-lado",
        subtitle:
          "Os 'cobots' estão tornando a automação mais segura e acessível.",
        content:
          "Diferentes dos robôs industriais tradicionais, os robôs colaborativos (cobots) são projetados para trabalhar com segurança ao lado de humanos.\n" +
          "Eles são mais fáceis de programar e mais flexíveis, ideais para pequenas e médias empresas.\n" +
          "Os cobots não substituem os trabalhadores, mas os auxiliam em tarefas repetitivas ou perigosas, aumentando a produtividade.",
        category: "Indústria",
        tags: ["Tecnologia", "Inovação"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1562028214-8e47f2d5a350?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 940,
      },

      // --- Categoria: Cultura ---
      {
        title: "A Guerra dos Streamings e o Futuro do Entretenimento",
        slug: "guerra-streamings-futuro-entretenimento",
        subtitle:
          "Como a competição por assinantes está mudando a produção de conteúdo.",
        content:
          "A batalha entre Netflix, Disney+, HBO Max e outros gigantes está resultando em um investimento massivo em produções originais.\n" +
          "O consumidor tem mais opções do que nunca, mas também enfrenta a fragmentação do conteúdo e o aumento dos custos.\n" +
          "O modelo de negócios do cinema e da TV tradicional está sendo permanentemente alterado por essa nova dinâmica.",
        category: "Cultura",
        tags: ["Cinema", "Mercado"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 1300,
      },
      {
        title: "Do Grafite à Galeria: A Validação da Arte Urbana",
        slug: "grafite-galeria-validacao-arte-urbana",
        subtitle:
          "O percurso da arte de rua do vandalismo ao reconhecimento institucional.",
        content:
          "Artistas como Banksy e Os Gêmeos elevaram o status do grafite, que hoje é celebrado em galerias e leilões de arte.\n" +
          "A arte urbana transformou a paisagem das cidades, trazendo cor, crítica social e identidade para os espaços públicos.\n" +
          "A linha entre o que é considerado arte e o que é vandalismo continua a ser um tema de intenso debate.",
        category: "Cultura",
        tags: ["Arte"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1541341443427-c21626219323?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 720,
      },
      {
        title: "A Era de Ouro dos Podcasts no Brasil",
        slug: "era-ouro-podcasts-brasil",
        subtitle:
          "O formato de áudio que conquistou o público e o mercado publicitário.",
        content:
          "Os podcasts se consolidaram como uma mídia de grande alcance no Brasil, com uma enorme variedade de temas e formatos.\n" +
          "A intimidade da voz e a conveniência do consumo sob demanda são fatores-chave para o seu sucesso.\n" +
          "Grandes empresas de mídia e criadores independentes disputam a atenção dos ouvintes em um mercado cada vez mais profissional.",
        category: "Cultura",
        tags: ["Mercado", "Startup"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1590602848950-e3a1a2485500?auto=format&fit=crop&w=800&q=80",
        status: "draft",
        views: 380,
      },
      {
        title: "Gastronomia como Expressão Cultural: A Cozinha Regional",
        slug: "gastronomia-expressao-cultural-cozinha-regional",
        subtitle:
          "Sabores, ingredientes e técnicas que contam a história de um povo.",
        content:
          "A culinária é um dos mais ricos patrimônios culturais de uma nação, refletindo sua história, geografia e diversidade.\n" +
          "Chefs de cozinha estão resgatando ingredientes e técnicas ancestrais, valorizando os produtores locais e a biodiversidade.\n" +
          "Viajar através dos sabores é uma das formas mais deliciosas de conhecer uma nova cultura.",
        category: "Cultura",
        tags: ["Arte"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1556761223-4c4282c73f77?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 1050,
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
      {
        title: "O Crescimento Global do Jiu-Jitsu Brasileiro",
        slug: "crescimento-global-jiu-jitsu-brasileiro",
        subtitle:
          "Como a 'arte suave' conquistou academias e competições no mundo todo.",
        content:
          "Originado no Brasil, o Jiu-Jitsu se tornou um fenômeno global, essencial para lutadores de MMA e praticado por milhões.\n" +
          "Sua filosofia enfatiza a técnica sobre a força, permitindo que uma pessoa menor neutralize um oponente maior.\n" +
          "Grandes competições internacionais e a disseminação de academias solidificaram seu status como uma das artes marciais mais eficazes.",
        category: "Esporte",
        tags: [],
        coverImageUrl:
          "https://images.unsplash.com/photo-1599496413218-3a6a9c159847?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 680,
      },
      {
        title: "A Carreira de Manager de eSports",
        slug: "carreira-manager-esports",
        subtitle:
          "Gerenciando talentos e negócios no competitivo mundo dos games.",
        content:
          "Um manager de eSports cuida de tudo, desde contratos e patrocínios até a saúde mental e o bem-estar dos jogadores.\n" +
          "É uma profissão que exige conhecimento do mercado de games, habilidades de negociação e gestão de pessoas.\n" +
          "O crescimento do setor abriu um novo e promissor campo de trabalho para além de ser um jogador profissional.",
        category: "Esporte",
        tags: ["Games", "Mercado"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1593305531782-61a2935a82a2?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 1250,
      },
      {
        title: "O Impacto das Fintechs no Mercado de Crédito",
        slug: "impacto-fintechs-mercado-credito",
        subtitle: "Como a tecnologia está democratizando o acesso financeiro",
        content:
          "Fintechs utilizam análise de dados e IA para oferecer crédito de forma mais rápida e personalizada, desafiando os bancos tradicionais.\n" +
          "A redução da burocracia e das taxas de juros atrai milhões de clientes para essas novas plataformas.\n" +
          "A regulação do setor busca equilibrar a inovação com a segurança e a proteção do consumidor.",
        category: "Economia",
        tags: ["Fintech", "Startup"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=800&q=80",
        status: "published",
        views: 780,
      },
      {
        title: "A 'Gig Economy' e as Novas Relações de Trabalho",
        slug: "gig-economy-novas-relacoes-trabalho",
        subtitle:
          "A ascensão dos trabalhadores de aplicativo e os debates sobre seus direitos.",
        content:
          "A economia de bicos, impulsionada por aplicativos, oferece flexibilidade mas também gera insegurança para os trabalhadores.\n" +
          "A discussão global sobre a regulamentação dessas atividades busca equilibrar inovação e proteção social.\n" +
          "O futuro do trabalho será cada vez mais híbrido, combinando modelos tradicionais e novas formas de prestação de serviço.",
        category: "Economia",
        tags: ["Startup", "Mercado"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80",
        status: "draft",
        views: 410,
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
        publishedAt: art.status === "published" ? new Date() : null,
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
