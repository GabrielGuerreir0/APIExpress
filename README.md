# Portal de Artigos - API Express

API REST para gerenciamento de artigos, categorias, tags e usuários, com autenticação JWT, controle de acesso por papéis (JOURNALIST, EDITOR), agendamento de publicação, contagem de visualizações e documentação Swagger.

## Funcionalidades

- Cadastro e login de usuários (JOURNALIST, EDITOR)
- CRUD de artigos, categorias e tags
- Agendamento automático de publicação de artigos
- Fila para contagem de visualizações (BullMQ + Redis)
- Filtros por categoria, tags, busca textual e paginação
- Autorização por papel e dono do recurso
- Documentação interativa via Swagger UI

## Tecnologias

- Node.js, Express
- Sequelize (PostgreSQL)
- BullMQ (Redis)
- Swagger (OpenAPI)
- Zod (validação)
- Docker e Docker Compose

## Instalação

1. **Clone o repositório**

   ```sh
   git clone <url-do-repo>
   cd APIExpress
   ```

2. **Instale as dependências**

   ```sh
   npm install
   ```

3. **Configure o ambiente**

   - Use Docker Compose para subir banco, Redis e app:
     ```sh
     docker-compose up
     ```
   - Ou configure variáveis de ambiente manualmente:
     ```
     DB_HOST=localhost
     DB_USER=admin
     DB_PASS=admin
     DB_NAME=portal
     DB_DIALECT=postgres
     REDIS_HOST=localhost
     JWT_SECRET=supersecret
     ```

4. **Rode a seed para popular o banco**
   ```sh
   node src/seed.js
   ```

## Uso

- **API rodando:** http://localhost:3000
- **Swagger UI:** http://localhost:3000/api-docs

### Principais Endpoints

#### Autenticação

- `POST /api/auth/register` — Cadastro de usuário
- `POST /api/auth/login` — Login (retorna JWT)

#### Artigos Públicos

- `POST /api/articles` — Busca paginada/filtrada de artigos publicados
- `GET /api/articles/id/:id` — Busca artigo publicado por ID
- `GET /api/articles/:slug` — Busca artigo publicado por slug

#### Administração de Artigos (JWT obrigatório)

- `POST /api/admin/articles` — Cria artigo (JOURNALIST, EDITOR)
- `PATCH /api/admin/articles/:id` — Atualiza artigo (EDITOR ou autor)
- `DELETE /api/admin/articles/:id` — Remove artigo (EDITOR ou autor)
- `GET /api/admin/articles` — Lista artigos (JOURNALIST vê só os próprios)

## Estrutura do Projeto

```
.
├── src/
│   ├── app.js
│   ├── server.js
│   ├── db.js
│   ├── seed.js
│   ├── swagger.js
│   ├── worker.js
│   ├── jobs/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── validations/
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Documentação

Acesse [Swagger UI](http://localhost:3000/api-docs) para exemplos de requisição, modelos e respostas.

## Licença

Este projeto está sob licença ISC.

---

**Dúvidas?**  
Abra uma issue ou entre em contato!
