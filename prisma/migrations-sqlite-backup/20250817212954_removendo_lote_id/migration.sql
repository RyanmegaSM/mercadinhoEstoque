/*
  Warnings:

  - You are about to drop the column `loteId` on the `Fornecedores` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Fornecedores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL
);
INSERT INTO "new_Fornecedores" ("cnpj", "endereco", "id", "nome", "telefone") SELECT "cnpj", "endereco", "id", "nome", "telefone" FROM "Fornecedores";
DROP TABLE "Fornecedores";
ALTER TABLE "new_Fornecedores" RENAME TO "Fornecedores";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
