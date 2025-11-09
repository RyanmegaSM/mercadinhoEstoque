# MercadinhoJS

MercadinhoJS é uma API REST desenvolvida em Node.js para gerenciamento de estoque de um pequeno mercado. O sistema permite controle de produtos, categorias, fornecedores, lotes e movimentações de estoque, com diferentes níveis de acesso de usuários.

## Arquitetura

O projeto segue uma arquitetura em camadas:

- **Controllers**: Responsáveis por receber as requisições HTTP e coordenar o fluxo de dados
- **Services**: Contém a lógica de negócio da aplicação
- **Middlewares**: Interceptadores para autenticação e autorização
- **Routes**: Definição das rotas da API
- **Utils**: Funções utilitárias compartilhadas
- **Misc**: Constantes, mensagens e regras de validação
- **Errors**: Classes customizadas de erro

## Tecnologias

### Core

- Node.js 18+
- Express.js - Framework web
- Prisma ORM - ORM para banco de dados
- SQLite - Banco de dados

### Segurança

- JWT (jsonwebtoken) - Autenticação
- Bcrypt - Criptografia de senhas
- Cors - Proteção CORS

### Documentação

- Swagger UI Express - Documentação da API
- JSDoc - Documentação do código

## Funcionalidades

- Autenticação e autorização de usuários (3 níveis de acesso)
- Gerenciamento de produtos e categorias
- Controle de fornecedores
- Gestão de lotes
- Movimentações de estoque (entrada/saída)
- Documentação via Swagger

## Níveis de Acesso

- **ADMIN (1)**: Acesso total ao sistema
- **MANAGER (2)**: Gerenciamento de produtos e estoque
- **EMPLOYEE (3)**: Consultas e movimentações básicas

A API estará disponível em `http://localhost:3333`
A documentação Swagger pode ser acessada em `http://localhost:3333/api-docs`

## Estrutura de Diretórios

```
src/
├── controller/     # Controladores da API
├── services/      # Lógica de negócio
├── middlewares/   # Middlewares Express
├── routes/        # Definição de rotas
├── utils/         # Funções utilitárias
├── misc/          # Constantes e configurações
├── errors/        # Classes de erro
└── prisma/        # Configuração do Prisma
```

# TODOs do Projeto

## 📦 Lógica de Negócio

- [ ] Criar lógica de **criar movimentação** (`StockMovement`)
- [ ] Criar lógica de **criar lote** (`Batch`)

## 🔍 Filtros de Busca

- [ ] Adicionar filtros na **busca de usuários** (ex: nome, email, tipo de acesso)
- [x] Adicionar filtros na **busca de produtos** (ex: nome, categoria, preço)
- [ ] Adicionar filtros na **busca de lote** (ex: fornecedor, validade, quantidade)

## 📑 Paginação

- [ ] Implementar elementos de **paginação** nas listagens:
  - [ ] Usuários
  - [x] Produtos
  - [ ] Lotes
  - [ ] Movimentações de estoque
