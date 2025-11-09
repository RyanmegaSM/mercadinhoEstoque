/*
  Warnings:

  - Added the required column `quantidade` to the `BatchOnProducts` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BatchOnProducts" (
    "produtoId" INTEGER NOT NULL,
    "loteId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,

    PRIMARY KEY ("produtoId", "loteId"),
    CONSTRAINT "BatchOnProducts_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BatchOnProducts_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BatchOnProducts" ("loteId", "produtoId") SELECT "loteId", "produtoId" FROM "BatchOnProducts";
DROP TABLE "BatchOnProducts";
ALTER TABLE "new_BatchOnProducts" RENAME TO "BatchOnProducts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
