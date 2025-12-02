# 📚 Projeto Tech Challenge – Fase 4

Aplicação de Blogging dinâmica voltada para professores e professoras da rede pública, com o objetivo de facilitar a publicação de conteúdo educacional. Esta API foi construída utilizando Node.js, MongoDB e Docker, com **autenticação JWT**, testes automatizados e documentação via Swagger.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** `v20.3.1`
- **TypeScript**
- **Express.js**
- **MongoDB (NoSQL)**
- **Mongoose**
- **Zod** (validações)
- **JWT (JSON Web Token)** (autenticação)
- **Bcrypt** (hash de senhas)
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
├── middlewares/        # Middlewares (autenticação, autorização)
├── models/             # Schemas do Mongoose
├── repositories/       # Acesso direto ao banco (MongoDB)
├── routes/             # Rotas da API com documentação Swagger
├── services/           # Lógica de negócio
├── types/              # Tipagens TypeScript
├── utils/              # Utilitários (respostas HTTP, JWT)
├── validations/        # Schemas de validação Zod
└── tests/              # Testes unitários e de integração
```

---

## 🔐 Autenticação e Autorização

### 🔑 Login

Tanto professores quanto alunos podem fazer login utilizando email e senha:

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "professor@email.com",
  "senha": "senha123"
}
```

**Resposta de sucesso:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "nome": "João Silva",
    "email": "professor@email.com",
    "role": "teacher"
  }
}
```

### 🔒 Usando o Token

Para acessar rotas protegidas, adicione o token no header `Authorization`:

```bash
Authorization: Bearer seu_token_aqui
```

### 👥 Permissões

- **Professores (`teacher`)**: Podem criar, editar e deletar posts, professores e alunos
- **Alunos (`student`)**: Podem apenas visualizar posts (leitura pública)

---

## 📁 Endpoints REST

### 🔓 Endpoints Públicos (sem autenticação)

#### 📄 Listar Posts

```bash
GET /api/posts?page=1&limit=10&author=John&subject=Matemática
```

#### 📄 Buscar Post por ID

```bash
GET /api/posts/:id
```

---

### 🔐 Endpoints Protegidos (requerem autenticação)

#### Posts

**Criar Post** (apenas professores)

```bash
POST /api/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Nova aula de história",
  "content": "Conteúdo completo aqui...",
  "author": "Professor João",
  "subject": "História"
}
```

**Atualizar Post** (apenas professores)

```bash
PATCH /api/posts/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Título atualizado"
}
```

**Deletar Post** (apenas professores)

```bash
DELETE /api/posts/:id
Authorization: Bearer {token}
```

---

#### Professores (apenas professores autenticados)

**Listar Professores**

```bash
GET /api/teachers?page=1&limit=10&nome=João
Authorization: Bearer {token}
```

**Criar Professor**

```bash
POST /api/teachers
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Maria Silva",
  "cpf": "12345678900",
  "nascimento": "1985-03-15",
  "telefone": "11999999999",
  "disciplina": "Matemática",
  "email": "maria@email.com",
  "matricula": "MAT001",
  "senha": "senha123"
}
```

**Atualizar Professor**

```bash
PUT /api/teachers/:id
Authorization: Bearer {token}
```

**Deletar Professor**

```bash
DELETE /api/teachers/:id
Authorization: Bearer {token}
```

---

#### Alunos (apenas professores autenticados)

**Listar Alunos**

```bash
GET /api/students?page=1&limit=10
Authorization: Bearer {token}
```

**Criar Aluno**

```bash
POST /api/students
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Pedro Santos",
  "cpf": "98765432100",
  "nascimento": "2005-08-20",
  "telefone": "11888888888",
  "curso": "Ensino Médio",
  "email": "pedro@email.com",
  "matricula": "ALU001",
  "senha": "senha123"
}
```

**Atualizar Aluno**

```bash
PUT /api/students/:id
Authorization: Bearer {token}
```

**Deletar Aluno**

```bash
DELETE /api/students/:id
Authorization: Bearer {token}
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
JWT_SECRET=seu_secret_super_seguro_aqui_12345
JWT_EXPIRES_IN=7d
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

- **Autenticação JWT**: Implementação de sistema de login simples e seguro com tokens JWT, permitindo controle de acesso baseado em roles (professor/aluno).
- **Middleware de Autorização**: Criação de middlewares para proteger rotas sensíveis, garantindo que apenas professores autenticados possam gerenciar posts, professores e alunos.
- **Hash de Senhas**: Utilização do bcrypt para armazenar senhas de forma segura no banco de dados.
- Validação robusta com Zod evitando campos inválidos na criação de posts, professores e alunos.
- Testes unitários com mocks para cobrir serviços e controladores.
- Integração do Swagger via JSDoc nas rotas para manter a documentação sincronizada, incluindo endpoints de autenticação.
- Separação clara por camadas: controller, service, repository, middleware.
- Utilização de Docker para padronizar ambientes e facilitar a colaboração.

---

## 👥 Equipe

- Gabriel Silvio – Desenvolvedor Full Stack
- Thais Santos
- Caio Manhães

---

## 📦 Requisitos Atendidos

### Backend (Fase 2-4)

- ✅ Node.js com Express
- ✅ Banco MongoDB com persistência de dados
- ✅ **Autenticação JWT com login para professores e alunos**
- ✅ **Autorização baseada em roles (teacher/student)**
- ✅ **Proteção de rotas sensíveis (criar/editar/deletar)**
- ✅ CRUD completo de Posts
- ✅ CRUD completo de Professores (protegido)
- ✅ CRUD completo de Alunos (protegido)
- ✅ Documentação Swagger atualizada com autenticação
- ✅ Dockerfile e Docker Compose
- ✅ CI com GitHub Actions
- ✅ Testes automatizados com Jest (20%+ de cobertura)
- ✅ Estrutura MVC com boas práticas
- ✅ Endpoints REST conforme enunciado

---

## 📄 Apresentação em Vídeo

\[🔗 Link para vídeo de apresentação e demonstração do projeto] <!-- Substitua com o link do vídeo gravado -->

---

## 📄 Licença

Este projeto está licenciado sob a licença ISC.

---

> "Desenvolvido como parte do Tech Challenge da Pós Tech FIAP + Alura – Fase 4"
