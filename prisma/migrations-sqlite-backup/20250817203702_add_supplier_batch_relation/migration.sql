/*
  Warnings:

  - Added the required column `fornecedorId` to the `Batch` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Batch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "preco" REAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "validade" DATETIME NOT NULL,
    "fornecedorId" INTEGER NOT NULL,
    CONSTRAINT "Batch_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Batch" ("id", "preco", "quantidade", "validade") SELECT "id", "preco", "quantidade", "validade" FROM "Batch";
DROP TABLE "Batch";
ALTER TABLE "new_Batch" RENAME TO "Batch";
CREATE TABLE "new_Fornecedores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "loteId" INTEGER NOT NULL
);
INSERT INTO "new_Fornecedores" ("cnpj", "endereco", "id", "loteId", "nome", "telefone") SELECT "cnpj", "endereco", "id", "loteId", "nome", "telefone" FROM "Fornecedores";
DROP TABLE "Fornecedores";
ALTER TABLE "new_Fornecedores" RENAME TO "Fornecedores";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
