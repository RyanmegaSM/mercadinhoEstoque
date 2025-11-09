import { PrismaClient } from "@prisma/client";

/**
 *
 * @param {PrismaClient} prisma
 * @returns
 */
export async function seedBatches(prisma) {
  const existing = await prisma.batch.count();
  if (existing > 0) {
    console.log("⚠️ Lotes já existem, pulando seed...");
    return [];
  }

  const lotes = [
    {
      preco: 25000, // em centavos = R$250,00
      validade: new Date("2026-01-01"),
      quantidade: 100,
      fornecedorId: 1, // Distribuidora Alimentos Brasil
      produtos: [
        { id: 1, quantidade: 50 },
        { id: 2, quantidade: 50 },
      ], // Arroz, Feijão
    },
    {
      preco: 5000,
      validade: new Date("2025-12-15"),
      quantidade: 200,
      fornecedorId: 2, // HortiFresco
      produtos: [
        { id: 3, quantidade: 100 },
        { id: 4, quantidade: 100 },
      ], // Maçã, Tomate
    },
    {
      preco: 70000,
      validade: new Date("2025-11-20"),
      quantidade: 80,
      fornecedorId: 3, // Frigorífico Boi Bom
      produtos: [
        { id: 5, quantidade: 40 },
        { id: 6, quantidade: 40 },
      ], // Frango, Carne
    },
    {
      preco: 20000,
      validade: new Date("2025-09-15"),
      quantidade: 150,
      fornecedorId: 5, // Bebidas Geladas
      produtos: [
        { id: 9, quantidade: 100 },
        { id: 10, quantidade: 50 },
      ], // Refrigerante, Suco
    },
    {
      preco: 15000,
      validade: new Date("2026-02-10"),
      quantidade: 120,
      fornecedorId: 8, // Laticínios Serra Azul
      produtos: [
        { id: 15, quantidade: 60 },
        { id: 16, quantidade: 60 },
      ], // Leite, Queijo
    },
  ];

  for (const lote of lotes) {
    const created = await prisma.batch.create({
      data: {
        preco: lote.preco,
        validade: lote.validade,
        quantidade: lote.quantidade,
        fornecedorId: lote.fornecedorId,
      },
    });

    for (const produto of lote.produtos) {
      await prisma.batchOnProducts.create({
        data: {
          loteId: created.id,
          produtoId: produto.id,
          quantidade: produto.quantidade,
        },
      });
    }
  }

  console.log("✅ 5 Lotes criados com vínculos de produtos");
}
