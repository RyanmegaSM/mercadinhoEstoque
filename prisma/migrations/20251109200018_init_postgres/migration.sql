-- CreateTable
CREATE TABLE "public"."Usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipoDeAcesso" INTEGER NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Categorias" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Produtos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "precoUnitario" DOUBLE PRECISION NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "Produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Fornecedores" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,

    CONSTRAINT "Fornecedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Batch" (
    "id" SERIAL NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "validade" TIMESTAMP(3) NOT NULL,
    "fornecedorId" INTEGER NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StockMovement" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "tipo" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "produtoId" INTEGER,
    "usuarioId" INTEGER,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StockMovementOnProducts" (
    "id" SERIAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "movimentacaoId" INTEGER NOT NULL,

    CONSTRAINT "StockMovementOnProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BatchOnProducts" (
    "produtoId" INTEGER NOT NULL,
    "loteId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "BatchOnProducts_pkey" PRIMARY KEY ("produtoId","loteId")
);

-- CreateTable
CREATE TABLE "public"."_BatchToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BatchToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "public"."Usuarios"("email");

-- CreateIndex
CREATE INDEX "_BatchToProduct_B_index" ON "public"."_BatchToProduct"("B");

-- AddForeignKey
ALTER TABLE "public"."Produtos" ADD CONSTRAINT "Produtos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."Categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Batch" ADD CONSTRAINT "Batch_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "public"."Fornecedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockMovement" ADD CONSTRAINT "StockMovement_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "public"."Produtos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockMovement" ADD CONSTRAINT "StockMovement_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockMovementOnProducts" ADD CONSTRAINT "StockMovementOnProducts_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "public"."Produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockMovementOnProducts" ADD CONSTRAINT "StockMovementOnProducts_movimentacaoId_fkey" FOREIGN KEY ("movimentacaoId") REFERENCES "public"."StockMovement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BatchOnProducts" ADD CONSTRAINT "BatchOnProducts_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "public"."Produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BatchOnProducts" ADD CONSTRAINT "BatchOnProducts_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "public"."Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BatchToProduct" ADD CONSTRAINT "_BatchToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BatchToProduct" ADD CONSTRAINT "_BatchToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
