# 📚 Projeto Tech Challenge – Fase 2

Aplicacao de Blogging dinâmica voltada para professores e professoras da rede pública, com o objetivo de facilitar a publicação de conteúdo educacional. Esta API foi construída utilizando Node.js, MongoDB e Docker, com testes automatizados e documentação via Swagger.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** `v20.3.1`
- **TypeScript**
- **Express.js**
- **MongoDB (NoSQL)**
- **Mongoose**
- **Zod** (validações)
- **Swagger** (documentação de APIs)
- **Jest** e **Supertest** (testes unitários e de integração)
- **Docker & Docker Compose**
- **GitHub Actions** (CI/CD)

---

## 🏠 Arquitetura da Aplicação

```
src/
├── config/             # Configurações (env, MongoDB, Swagger)
├── controllers/        # Controladores das rotas
├── models/             # Schemas do Mongoose
├── repositories/       # Acesso direto ao banco (MongoDB)
├── routes/             # Rotas da API com documentação Swagger
├── services/           # Lógica de negócio
├── types/              # Tipagens TypeScript
├── utils/              # Utilitários (respostas HTTP)
├── validations/        # Schemas de validação Zod
└── tests/              # Testes unitários e de integração
```

---

## 🥪 Cobertura de Testes

✅ Cobertura de +20% com testes automatizados utilizando `Jest` e `Supertest`.
Abrange controladores, serviços e camada de repositório.

Rodar os testes:

```bash
npm test
```

---

## 📁 Endpoints REST

### 📄 Listar Posts

```
GET /api/posts?page=1&limit=10&author=John&subject=Matemática
```

### 📄 Buscar Post por ID

```
GET /api/posts/:id
```

### 🆕 Criar Post

```
POST /api/posts
```

```json
{
  "title": "Nova aula de história",
  "content": "Conteúdo completo aqui...",
  "author": "Professor João",
  "subject": "História"
}
```

### ✏️ Atualizar Post (parcial)

```
PATCH /api/posts/:id
```

```json
{
  "title": "Título atualizado"
}
```

### 🗑️ Deletar Post

```
DELETE /api/posts/:id
```

---

## 📂 Documentação da API

Acesse a documentação Swagger:

👉 [`http://localhost:3333/api-docs`](http://localhost:3333/api-docs)

---

## 🐳 Docker

### Rodar a aplicação com Docker Compose:

```bash
docker-compose up --build
```

A aplicação estará disponível em `http://localhost:3333`.

As variáveis `.env` utilizadas são:

```env
MONGO_USER=ADMIN
MONGO_PASSWORD=POS_TECH12
MONGO_PORT=2525
DATABASE=mongodb
MONGO_HOST=localhost
PORT=3333
```

---

## ⚙️ Scripts disponíveis

| Comando               | Descrição                           |
| --------------------- | ----------------------------------- |
| `npm run start:dev`   | Inicia o servidor com `tsx`         |
| `npm run start:watch` | Inicia com `.env` e modo watch      |
| `npm run dist`        | Transpila o código para produção    |
| `npm run start:dist`  | Roda o build transpileado (`dist/`) |
| `npm test`            | Executa testes com Jest             |

---

## 🔄 CI/CD com GitHub Actions

### 📂 `.github/workflows/ci.yml`

O repositório já está preparado para CI com GitHub Actions:

- Instala dependências
- Roda os testes
- Verifica sucesso nas builds

---

## 🎯 Desafios e Experiências

Durante o desenvolvimento, enfrentamos e solucionamos os seguintes pontos:

- Validação robusta com Zod evitando campos inválidos na criação de posts.
- Testes unitários com mocks para cobrir serviços e controladores.
- Integração do Swagger via JSDoc nas rotas para manter a documentação sincronizada.
- Separação clara por camadas: controller, service, repository.
- Utilização de Docker para padronizar ambientes e facilitar a colaboração.

---

## 👥 Equipe

- Gabriel Silvio – Desenvolvedor Full Stack
- Thais

---

## 📦 Requisitos Atendidos

- ✅ Node.js com Express
- ✅ Banco MongoDB com persistência de dados
- ✅ Documentação Swagger
- ✅ Dockerfile e Docker Compose
- ✅ CI com GitHub Actions
- ✅ Testes automatizados com Jest (20%+ de cobertura)
- ✅ Estrutura MVC com boas práticas
- ✅ Endpoints REST conforme enunciado da Fase 2

---

## 📄 Apresentação em Vídeo

\[🔗 Link para vídeo de apresentação e demonstração do projeto] <!-- Substitua com o link do vídeo gravado -->

---

## 📄 Licença

Este projeto está licenciado sob a licença ISC.

---

> “Desenvolvido como parte do Tech Challenge da Pós Tech FIAP + Alura – Fase 2”
