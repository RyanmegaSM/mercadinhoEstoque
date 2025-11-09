-- CreateTable
CREATE TABLE "Usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipoDeAcesso" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Categorias" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Produtos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "precoUnitario" REAL NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    CONSTRAINT "Produtos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categorias" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fornecedores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "loteId" INTEGER NOT NULL,
    CONSTRAINT "Fornecedores_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "preco" REAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "validade" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "produtoId" INTEGER,
    "usuarioId" INTEGER,
    CONSTRAINT "StockMovement_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produtos" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "StockMovement_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BatchOnProducts" (
    "produtoId" INTEGER NOT NULL,
    "loteId" INTEGER NOT NULL,

    PRIMARY KEY ("produtoId", "loteId"),
    CONSTRAINT "BatchOnProducts_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BatchOnProducts_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BatchToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BatchToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Batch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BatchToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Produtos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_BatchToProduct_AB_unique" ON "_BatchToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_BatchToProduct_B_index" ON "_BatchToProduct"("B");
