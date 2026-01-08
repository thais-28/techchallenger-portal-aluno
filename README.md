# 📚 Tech Challenge - Portal do Aluno

> Sistema de blogging educacional com autenticação JWT para professores e alunos da rede pública

[![Node.js](https://img.shields.io/badge/Node.js-20.3.1-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Autenticação](#-autenticação)
- [API](#-api)
- [Testes](#-testes)
- [Equipe](#-equipe)

---

## 🎯 Sobre o Projeto

API RESTful desenvolvida para facilitar a publicação de conteúdo educacional por professores, com sistema completo de autenticação e autorização baseado em roles (professor/aluno).

### Funcionalidades Principais

- ✅ Autenticação JWT com roles (professor/aluno)
- ✅ CRUD completo de Posts, Professores e Alunos
- ✅ Proteção de rotas por permissões
- ✅ Validação de dados com Zod
- ✅ Documentação interativa com Swagger
- ✅ Testes automatizados (Jest + Supertest)
- ✅ Containerização com Docker

---

## 🏗️ Arquitetura

### Estrutura em Camadas

```mermaid
graph TB
    subgraph "Camada de Apresentação"
        A[Routes] --> B[Controllers]
    end

    subgraph "Camada de Negócio"
        B --> C[Services]
        C --> D[Validations]
    end

    subgraph "Camada de Dados"
        C --> E[Repositories]
        E --> F[(MongoDB)]
    end

    subgraph "Infraestrutura"
        G[Middlewares] -.-> B
        H[Utils] -.-> C
    end

    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style C fill:#fff4e1
    style D fill:#fff4e1
    style E fill:#ffe1e1
    style F fill:#ffe1e1
```

### Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant C as Cliente
    participant A as API
    participant M as Middleware Auth
    participant S as Service
    participant DB as MongoDB

    C->>A: POST /api/auth/login
    A->>S: loginService(email, senha)
    S->>DB: findOne({email})
    DB-->>S: Usuário
    S->>S: bcrypt.compare(senha)
    S-->>A: {token, user}
    A-->>C: 200 OK + JWT Token

    Note over C: Cliente armazena token

    C->>A: POST /api/posts (+ Bearer Token)
    A->>M: authMiddleware
    M->>M: verifyToken()
    M->>M: teacherOnly()
    M-->>A: req.user
    A->>S: createPostService()
    S->>DB: create()
    DB-->>S: Post criado
    S-->>A: HttpResponse.created()
    A-->>C: 201 Created
```

### Diagrama de Classes (Simplificado)

```mermaid
classDiagram
    class ITeacher {
        +string nome
        +string cpf
        +string email
        +string disciplina
        +string senha
    }

    class IStudent {
        +string nome
        +string cpf
        +string email
        +string turma
        +string senha
    }

    class Post {
        +string title
        +string content
        +string author
        +string subject
    }

    class TokenPayload {
        +string id
        +string email
        +string role
    }

    ITeacher --|> TokenPayload : role = teacher
    IStudent --|> TokenPayload : role = student
    Post -- ITeacher : created by
```

### Estrutura de Diretórios

```
src/
├── config/          # Configurações (env, MongoDB, Swagger, Seed)
├── controllers/     # Camada de apresentação (req/res)
├── middlewares/     # Auth, validações globais
├── models/          # Schemas Mongoose
├── repositories/    # Acesso direto ao banco
├── routes/          # Definição de endpoints
├── services/        # Lógica de negócio
├── types/           # Interfaces TypeScript
├── utils/           # Helpers (JWT, HTTP responses)
├── validations/     # Schemas Zod
└── tests/           # Testes unitários e de integração
```

---

## 🚀 Tecnologias

| Categoria           | Tecnologia              |
| ------------------- | ----------------------- |
| **Runtime**         | Node.js 20.3.1          |
| **Linguagem**       | TypeScript              |
| **Framework**       | Express.js              |
| **Banco de Dados**  | MongoDB + Mongoose      |
| **Autenticação**    | JWT + Bcrypt            |
| **Validação**       | Zod                     |
| **Documentação**    | Swagger UI              |
| **Testes**          | Jest + Supertest        |
| **Containerização** | Docker + Docker Compose |
| **CI/CD**           | GitHub Actions          |

---

## 📦 Instalação

### Pré-requisitos

- Node.js 20.x
- Docker e Docker Compose
- Git

### Passo a Passo

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd techchallenger-portal-aluno
```

2. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário:

```env
MONGO_USER=ADMIN
MONGO_PASSWORD=POS_TECH12
MONGO_PORT=2525
DATABASE=mongodb
MONGO_HOST=localhost
PORT=3333
JWT_SECRET=seu_secret_super_seguro_aqui_12345
JWT_EXPIRES_IN=7d
```

3. **Inicie com Docker Compose**

```bash
docker-compose up --build
```

A API estará disponível em: `http://localhost:3333`

4. **Ou instale localmente**

```bash
npm install
npm run start:dev
```

### Seed de Dados

Ao iniciar, o banco é automaticamente populado com dados de exemplo:

- **3 Professores** (senha: `senha123`)
- **4 Alunos** (senha: `senha123`)
- **6 Posts** educativos

---

## 💻 Uso

### Exemplo Completo

```bash
# 1. Login como professor
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao.silva@escola.com", "senha": "senha123"}'

# Resposta: { "token": "eyJhbG...", "user": {...} }

# 2. Criar um post (use o token recebido)
curl -X POST http://localhost:3333/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "title": "Introdução à Álgebra",
    "content": "Conceitos básicos...",
    "author": "Prof. João Silva",
    "subject": "Matemática"
  }'

# 3. Listar posts (público - sem token)
curl http://localhost:3333/api/posts
```

### Documentação Interativa

Acesse o Swagger UI em:

👉 **http://localhost:3333/api-docs**

---

## 🔐 Autenticação

### Fluxo de Login

```mermaid
graph LR
    A[Cliente] -->|POST /api/auth/login| B{Credenciais válidas?}
    B -->|Sim| C[Gera JWT Token]
    B -->|Não| D[401 Unauthorized]
    C --> E[Retorna token + user]
    E --> F[Cliente usa token nas requisições]
    F -->|Authorization: Bearer token| G[Acesso às rotas protegidas]
```

### Roles e Permissões

| Recurso                     | Professor | Aluno | Público |
| --------------------------- | --------- | ----- | ------- |
| **GET** `/api/posts`        | ✅        | ✅    | ✅      |
| **POST** `/api/posts`       | ✅        | ❌    | ❌      |
| **PATCH** `/api/posts/:id`  | ✅        | ❌    | ❌      |
| **DELETE** `/api/posts/:id` | ✅        | ❌    | ❌      |
| **GET** `/api/teachers`     | ✅        | ❌    | ❌      |
| **POST** `/api/teachers`    | ✅        | ❌    | ❌      |
| **GET** `/api/students`     | ✅        | ❌    | ❌      |
| **POST** `/api/students`    | ✅        | ❌    | ❌      |

### Exemplo de Uso do Token

```bash
# Header obrigatório para rotas protegidas
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🛣️ API

### Endpoints Públicos

#### Posts

| Método | Endpoint         | Descrição                           |
| ------ | ---------------- | ----------------------------------- |
| GET    | `/api/posts`     | Lista posts com filtros e paginação |
| GET    | `/api/posts/:id` | Busca post por ID                   |

**Exemplo:**

```bash
GET /api/posts?page=1&limit=10&author=João&subject=Matemática
```

### Endpoints Protegidos

#### Posts (apenas professores)

| Método | Endpoint         | Descrição      |
| ------ | ---------------- | -------------- |
| POST   | `/api/posts`     | Cria novo post |
| PATCH  | `/api/posts/:id` | Atualiza post  |
| DELETE | `/api/posts/:id` | Deleta post    |

#### Professores (apenas professores)

| Método | Endpoint            | Descrição          |
| ------ | ------------------- | ------------------ |
| GET    | `/api/teachers`     | Lista professores  |
| POST   | `/api/teachers`     | Cria professor     |
| PATCH  | `/api/teachers/:id` | Atualiza professor |
| DELETE | `/api/teachers/:id` | Deleta professor   |

#### Alunos (apenas professores)

| Método | Endpoint            | Descrição      |
| ------ | ------------------- | -------------- |
| GET    | `/api/students`     | Lista alunos   |
| POST   | `/api/students`     | Cria aluno     |
| PATCH  | `/api/students/:id` | Atualiza aluno |
| DELETE | `/api/students/:id` | Deleta aluno   |

### Exemplos de Requisições

**Criar Post:**

```json
POST /api/posts
Authorization: Bearer {token}

{
  "title": "Teorema de Pitágoras",
  "content": "Explicação detalhada...",
  "author": "Prof. João Silva",
  "subject": "Matemática"
}
```

**Criar Aluno:**

```json
POST /api/students
Authorization: Bearer {token}

{
  "nome": "Maria Oliveira",
  "cpf": "98765432100",
  "nascimento": "2005-08-20",
  "telefone": "11888888888",
  "turma": "3A",
  "email": "maria@escola.com",
  "matricula": "ALU010",
  "senha": "senha123"
}
```

---

## 🧪 Testes

### Cobertura de Testes

O projeto possui cobertura de **20%+** com testes unitários e de integração.

### Executar Testes

```bash
# Todos os testes
npm test

# Com watch mode
npm test -- --watch

# Com coverage
npm test -- --coverage
```

### Estrutura de Testes

```
src/tests/
├── unit/               # Testes unitários (mocks)
│   ├── authService.test.ts
│   ├── teacherService.test.ts
│   └── teacherController.test.ts
├── integration/        # Testes de integração (MongoDB in-memory)
│   ├── postRoutes.test.ts
│   ├── teacherRoutes.test.ts
│   ├── studentRoutes.test.ts
│   └── protectedRoutes.test.ts
└── helpers/
    └── mongoMemorySetup.ts
```

### Exemplo de Teste

```typescript
describe('POST /api/posts', () => {
  it('deve permitir professor criar post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({
        title: 'Post Teste',
        content: 'Conteúdo...',
        author: 'Prof. João',
        subject: 'Matemática'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('deve bloquear aluno de criar post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({...});

    expect(res.status).toBe(403);
  });
});
```

---

## 🐳 Docker

### Arquivos de Configuração

**docker-compose.yaml:**

```yaml
version: "3.8"
services:
  mongo:
    image: mongo:7.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    ports:
      - "${MONGO_PORT}:27017"

  api:
    build: .
    ports:
      - "${PORT}:3333"
    depends_on:
      - mongo
    environment:
      MONGO_HOST: mongo
```

### Comandos Úteis

```bash
# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Parar containers
docker-compose down

# Rebuild
docker-compose up --build
```

---

## ⚙️ Scripts

| Comando               | Descrição                                |
| --------------------- | ---------------------------------------- |
| `npm run start:dev`   | Inicia servidor em desenvolvimento (tsx) |
| `npm run start:watch` | Desenvolvimento com watch mode           |
| `npm run build`       | Build de produção                        |
| `npm run start:build` | Executa build de produção                |
| `npm test`            | Executa testes                           |

---

## 🔄 CI/CD

### GitHub Actions

O projeto possui workflow automatizado em `.github/workflows/workflow.yaml`:

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - run: npm ci
      - run: npm test
```

---

## 👥 Equipe

| Nome           | Papel                    |
| -------------- | ------------------------ |
| Gabriel Silvio | Desenvolvedor Full Stack |
| Thais Santos   | Desenvolvedor            |
| Caio Manhães   | Desenvolvedor            |

---

## 📚 Requisitos Atendidos

### Tech Challenge - Fase 4

- ✅ API RESTful com Node.js + Express
- ✅ Banco de dados MongoDB com Mongoose
- ✅ Sistema de autenticação JWT
- ✅ Autorização baseada em roles (teacher/student)
- ✅ CRUD completo de Posts, Professores e Alunos
- ✅ Proteção de rotas sensíveis
- ✅ Validação de dados com Zod
- ✅ Documentação Swagger completa
- ✅ Testes automatizados (20%+ cobertura)
- ✅ Dockerização completa
- ✅ CI/CD com GitHub Actions
- ✅ Arquitetura em camadas (MVC)
- ✅ Código TypeScript com boas práticas

---

## 📖 Referências

- [Documentação Express.js](https://expressjs.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [JWT.io](https://jwt.io/)
- [Swagger Documentation](https://swagger.io/docs/)
- [Jest Documentation](https://jestjs.io/)

---

## 📄 Licença

ISC License - Projeto acadêmico desenvolvido para a Pós Tech FIAP + Alura

---

<div align="center">

**Desenvolvido como parte do Tech Challenge da Pós Tech FIAP + Alura – Fase 4**

</div>
