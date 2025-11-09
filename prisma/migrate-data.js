// prisma/scripts/migrate-stockmovement-products.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Busca movimentações que apontam para um único produto (antigo formato)
  const movements = await prisma.stockMovement.findMany({
    where: { produtoId: { not: null } },
    select: { id: true, produtoId: true, quantidade: true },
  });

  if (movements.length === 0) {
    console.log("Nenhuma movimentação antiga encontrada para migrar.");
    return;
  }

  console.log(`Migrando ${movements.length} movimentações...`);

  for (const mv of movements) {
    // insere um registro na tabela intermediária para manter a mesma info
    await prisma.stockMovementProduct.create({
      data: {
        produtoId: mv.produtoId,
        movimentacaoId: mv.id,
        quantidade: mv.quantidade ?? 0,
      },
    });
  }

  console.log("Migração concluída.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
