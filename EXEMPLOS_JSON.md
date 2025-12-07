# 📋 Exemplos de JSON para Testes da API

## ⚠️ IMPORTANTE: Regras de JSON

1. **NÃO pode ter vírgula após o último campo**
2. **Use aspas duplas** (`"`) para strings, não aspas simples
3. **Não use comentários** dentro do JSON

---

## 🔐 Login

### ✅ Correto

```json
{
  "email": "joao.silva@escola.com",
  "senha": "senha123"
}
```

### ❌ Incorreto (vírgula no final)

```json
{
  "email": "joao.silva@escola.com",
  "senha": "senha123"
}
```

---

## 📝 Criar Post

### ✅ Correto

```json
{
  "title": "Introdução à Álgebra",
  "content": "Nesta aula vamos aprender os conceitos básicos de álgebra e suas aplicações no dia a dia.",
  "author": "Prof. João Silva",
  "subject": "Matemática"
}
```

### ❌ Incorreto (vírgula após subject)

```json
{
  "title": "Introdução à Álgebra",
  "content": "Nesta aula...",
  "author": "Prof. João Silva",
  "subject": "Matemática"
}
```

---

## 📝 Atualizar Post (PATCH)

### ✅ Correto - Atualizar apenas título

```json
{
  "title": "Álgebra Linear - Atualizado"
}
```

### ✅ Correto - Atualizar título e conteúdo

```json
{
  "title": "Álgebra Linear - Atualizado",
  "content": "Novo conteúdo da aula revisado e ampliado"
}
```

---

## 👨‍🏫 Criar Professor

### ✅ Correto

```json
{
  "nome": "Prof. Carlos Alberto",
  "cpf": "12345678900",
  "nascimento": "1985-03-15",
  "telefone": "(11) 98888-7777",
  "disciplina": "Física",
  "email": "carlos.alberto@escola.com",
  "matricula": "PROF005",
  "senha": "senha123"
}
```

---

## 👨‍🏫 Atualizar Professor (PUT)

### ✅ Correto - Atualizar telefone

```json
{
  "telefone": "(11) 99999-8888"
}
```

### ✅ Correto - Atualizar disciplina e telefone

```json
{
  "disciplina": "Física Quântica",
  "telefone": "(11) 99999-8888"
}
```

---

## 👨‍🎓 Criar Aluno

### ✅ Correto

```json
{
  "nome": "João Pedro Santos",
  "cpf": "98765432100",
  "nascimento": "2006-08-20",
  "telefone": "(11) 97777-6666",
  "turma": "2B",
  "email": "joao.pedro@escola.com",
  "matricula": "ALU010",
  "senha": "senha123"
}
```

---

## 👨‍🎓 Atualizar Aluno (PUT)

### ✅ Correto - Mudar de turma

```json
{
  "turma": "3A"
}
```

### ✅ Correto - Atualizar múltiplos campos

```json
{
  "turma": "3A",
  "telefone": "(11) 96666-5555",
  "email": "joao.pedro.novo@escola.com"
}
```

---

## 🔧 Testando com cURL

### Login

```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao.silva@escola.com","senha":"senha123"}'
```

### Criar Post (com token)

```bash
curl -X POST http://localhost:3333/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"title":"Nova Aula","content":"Conteúdo...","author":"Prof. João","subject":"Matemática"}'
```

### Atualizar Post (com token)

```bash
curl -X PATCH http://localhost:3333/api/posts/ID_DO_POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"title":"Título Atualizado"}'
```

---

## 🛠️ Dicas para Insomnia/Postman

1. **Body**: Selecione `JSON` no dropdown
2. **Headers**: Adicione `Content-Type: application/json`
3. **Authorization**: Para rotas protegidas, adicione `Bearer Token`
4. **Validação**: Use um validador JSON online antes de enviar

---

## ✅ Checklist de Validação

Antes de enviar, verifique:

- [ ] Não há vírgulas após o último campo de cada objeto
- [ ] Todas as strings usam aspas duplas (`"`)
- [ ] Todos os colchetes e chaves estão balanceados `{}` `[]`
- [ ] Não há comentários dentro do JSON
- [ ] O Content-Type está definido como `application/json`
- [ ] Para rotas protegidas, o token Bearer está no header

---

## 🔍 Erros Comuns e Soluções

### Erro: `SyntaxError: Unexpected non-whitespace character`

**Causa**: Vírgula após o último campo  
**Solução**: Remova a vírgula do último campo

### Erro: `400 - Dados inválidos`

**Causa**: Campos obrigatórios faltando ou formato incorreto  
**Solução**: Verifique se todos os campos obrigatórios estão presentes

### Erro: `401 - Token não fornecido`

**Causa**: Tentando acessar rota protegida sem token  
**Solução**: Faça login e adicione o token no header `Authorization: Bearer TOKEN`

### Erro: `403 - Acesso negado: apenas professores`

**Causa**: Aluno tentando acessar recurso exclusivo de professor  
**Solução**: Faça login com conta de professor

---

## 📊 Resumo dos Campos Obrigatórios

### Post

- `title` (string)
- `content` (string)
- `author` (string)
- `subject` (string)

### Professor

- `nome` (string)
- `cpf` (string, 11 dígitos)
- `nascimento` (string, formato: YYYY-MM-DD)
- `telefone` (string)
- `disciplina` (string)
- `email` (string, formato de email válido)
- `matricula` (string)
- `senha` (string)

### Aluno

- `nome` (string, mín. 3 caracteres)
- `cpf` (string, 11 dígitos)
- `nascimento` (string, formato: YYYY-MM-DD)
- `telefone` (string, mín. 10 caracteres)
- `turma` (string)
- `email` (string, formato de email válido)
- `matricula` (string, mín. 5 caracteres)
- `senha` (string, mín. 6 caracteres)
