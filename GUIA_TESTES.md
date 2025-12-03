# 🧪 Guia de Testes - Sistema de Autenticação

## 📋 Pré-requisitos

1. Servidor rodando: `npm run start:dev`
2. MongoDB rodando (via Docker ou local)
3. Ferramenta de testes de API (Postman, Insomnia, Thunder Client ou curl)

---

## 🔄 Fluxo Completo de Testes

### 1️⃣ Criar um Professor

**Endpoint:** `POST http://localhost:3333/api/teachers`

⚠️ **Nota:** Este endpoint precisa estar temporariamente sem autenticação para criar o primeiro professor, ou você pode criar diretamente no banco.

```json
{
  "nome": "Professor João Silva",
  "cpf": "12345678900",
  "nascimento": "1980-05-15",
  "telefone": "11999999999",
  "disciplina": "Matemática",
  "email": "joao@professor.com",
  "matricula": "PROF001",
  "senha": "senha123"
}
```

---

### 2️⃣ Fazer Login como Professor

**Endpoint:** `POST http://localhost:3333/api/auth/login`

```json
{
  "email": "joao@professor.com",
  "senha": "senha123"
}
```

**Resposta esperada:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "nome": "Professor João Silva",
    "email": "joao@professor.com",
    "role": "teacher"
  }
}
```

📋 **Copie o token** para usar nos próximos passos!

---

### 3️⃣ Criar um Post (Com Autenticação)

**Endpoint:** `POST http://localhost:3333/api/posts`

**Headers:**

```
Authorization: Bearer {SEU_TOKEN_AQUI}
Content-Type: application/json
```

**Body:**

```json
{
  "title": "Introdução à Álgebra",
  "content": "Nesta aula vamos aprender os conceitos básicos de álgebra...",
  "author": "Professor João Silva",
  "subject": "Matemática"
}
```

---

### 4️⃣ Listar Posts (Sem Autenticação - Público)

**Endpoint:** `GET http://localhost:3333/api/posts`

Não precisa de token! Qualquer pessoa pode listar posts.

---

### 5️⃣ Criar um Aluno (Com Autenticação)

**Endpoint:** `POST http://localhost:3333/api/students`

**Headers:**

```
Authorization: Bearer {SEU_TOKEN_AQUI}
Content-Type: application/json
```

**Body:**

```json
{
  "nome": "Maria Oliveira",
  "cpf": "98765432100",
  "nascimento": "2005-08-20",
  "telefone": "11888888888",
  "curso": "Ensino Médio",
  "email": "maria@aluno.com",
  "matricula": "ALU001",
  "senha": "senha123"
}
```

---

### 6️⃣ Fazer Login como Aluno

**Endpoint:** `POST http://localhost:3333/api/auth/login`

```json
{
  "email": "maria@aluno.com",
  "senha": "senha123"
}
```

**Resposta esperada:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "nome": "Maria Oliveira",
    "email": "maria@aluno.com",
    "role": "student"
  }
}
```

---

### 7️⃣ Tentar Criar Post como Aluno (Deve Falhar)

**Endpoint:** `POST http://localhost:3333/api/posts`

**Headers:**

```
Authorization: Bearer {TOKEN_DO_ALUNO}
Content-Type: application/json
```

**Body:**

```json
{
  "title": "Post de Teste",
  "content": "Tentando criar um post como aluno...",
  "author": "Maria",
  "subject": "Teste"
}
```

**Resposta esperada (403 Forbidden):**

```json
{
  "message": "Acesso negado: apenas professores"
}
```

✅ **Sucesso!** O sistema está protegendo corretamente as rotas!

---

## 🔐 Testando Erros de Autenticação

### Sem Token

**Endpoint:** `POST http://localhost:3333/api/posts`

**Sem header `Authorization`**

**Resposta esperada (401):**

```json
{
  "message": "Token não fornecido"
}
```

### Token Inválido

**Headers:**

```
Authorization: Bearer token_invalido_123
```

**Resposta esperada (401):**

```json
{
  "message": "Token inválido"
}
```

---

## 📊 Resumo de Permissões

| Endpoint                   | Professor | Aluno | Público |
| -------------------------- | --------- | ----- | ------- |
| `POST /api/auth/login`     | ✅        | ✅    | ✅      |
| `GET /api/posts`           | ✅        | ✅    | ✅      |
| `GET /api/posts/:id`       | ✅        | ✅    | ✅      |
| `POST /api/posts`          | ✅        | ❌    | ❌      |
| `PATCH /api/posts/:id`     | ✅        | ❌    | ❌      |
| `DELETE /api/posts/:id`    | ✅        | ❌    | ❌      |
| `GET /api/teachers`        | ✅        | ❌    | ❌      |
| `POST /api/teachers`       | ✅        | ❌    | ❌      |
| `PUT /api/teachers/:id`    | ✅        | ❌    | ❌      |
| `DELETE /api/teachers/:id` | ✅        | ❌    | ❌      |
| `GET /api/students`        | ✅        | ❌    | ❌      |
| `POST /api/students`       | ✅        | ❌    | ❌      |
| `PUT /api/students/:id`    | ✅        | ❌    | ❌      |
| `DELETE /api/students/:id` | ✅        | ❌    | ❌      |

---

## 🌐 Testar no Swagger

Acesse: **http://localhost:3333/api-docs**

1. Clique no botão **"Authorize"** no topo da página
2. Digite: `Bearer {SEU_TOKEN}`
3. Clique em **"Authorize"**
4. Agora você pode testar todas as rotas diretamente no Swagger!

---

## ✅ Checklist de Testes

- [ ] Criar professor via POST
- [ ] Login como professor
- [ ] Criar post com token de professor
- [ ] Listar posts sem autenticação
- [ ] Criar aluno com token de professor
- [ ] Login como aluno
- [ ] Tentar criar post como aluno (deve falhar)
- [ ] Tentar acessar rota protegida sem token (deve falhar)
- [ ] Tentar usar token inválido (deve falhar)
- [ ] Testar documentação Swagger com autenticação

---

## 🐛 Troubleshooting

### Erro: "Token não fornecido"

- Certifique-se de adicionar o header `Authorization: Bearer {token}`

### Erro: "Token inválido"

- Verifique se copiou o token completo
- Verifique se o JWT_SECRET no `.env` está correto
- Faça login novamente para obter um novo token

### Erro: "Acesso negado: apenas professores"

- Verifique se você está usando o token de um professor, não de um aluno

---

🎉 **Pronto!** Sua API está com autenticação JWT funcionando perfeitamente!
