-- CreateTable
CREATE TABLE "StockMovementOnProducts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantidade" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "movimentacaoId" INTEGER NOT NULL,
    CONSTRAINT "StockMovementOnProducts_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StockMovementOnProducts_movimentacaoId_fkey" FOREIGN KEY ("movimentacaoId") REFERENCES "StockMovement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
