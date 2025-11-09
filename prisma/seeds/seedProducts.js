import { PrismaClient } from "@prisma/client";

/**
 *
 * @param {PrismaClient} prisma
 * @returns
 */
export async function seedProducts(prisma) {
  const existing = await prisma.product.count();
  if (existing > 0) {
    console.log("⚠️ Produtos já existem, pulando seed...");
    return [];
  }

  const produtos = await prisma.product.createManyAndReturn({
    data: [
      {
        nome: "Arroz Branco 5kg",
        descricao: "Arroz tipo 1",
        precoUnitario: 2500, // R$ 25,00
        categoriaId: 1,
      },
      {
        nome: "Feijão Carioca 1kg",
        descricao: "Feijão selecionado",
        precoUnitario: 800, // R$ 8,00
        categoriaId: 1,
      },
      {
        nome: "Maçã Gala",
        descricao: "Maçã fresca",
        precoUnitario: 600, // R$ 6,00
        categoriaId: 2,
      },
      {
        nome: "Tomate Italiano",
        descricao: "Tomate maduro",
        precoUnitario: 500, // R$ 5,00
        categoriaId: 2,
      },
      {
        nome: "Frango Congelado",
        descricao: "Frango inteiro congelado",
        precoUnitario: 2000, // R$ 20,00
        categoriaId: 3,
      },
      {
        nome: "Carne Bovina Patinho",
        descricao: "Carne bovina fresca",
        precoUnitario: 3500, // R$ 35,00
        categoriaId: 3,
      },
      {
        nome: "Pão Francês",
        descricao: "Pão de sal fresco",
        precoUnitario: 80, // R$ 0,80
        categoriaId: 4,
      },
      {
        nome: "Bolo de Chocolate",
        descricao: "Bolo confeitado",
        precoUnitario: 3500, // R$ 35,00
        categoriaId: 4,
      },
      {
        nome: "Refrigerante Cola 2L",
        descricao: "Bebida gaseificada",
        precoUnitario: 1000, // R$ 10,00
        categoriaId: 5,
      },
      {
        nome: "Suco de Laranja 1L",
        descricao: "Suco natural integral",
        precoUnitario: 1200, // R$ 12,00
        categoriaId: 5,
      },
      {
        nome: "Sabonete Neutro",
        descricao: "Sabonete em barra",
        precoUnitario: 300, // R$ 3,00
        categoriaId: 6,
      },
      {
        nome: "Shampoo Anticaspa",
        descricao: "Shampoo 400ml",
        precoUnitario: 1500, // R$ 15,00
        categoriaId: 6,
      },
      {
        nome: "Detergente Líquido",
        descricao: "Detergente neutro 500ml",
        precoUnitario: 250, // R$ 2,50
        categoriaId: 7,
      },
      {
        nome: "Água Sanitária",
        descricao: "Água sanitária 2L",
        precoUnitario: 700, // R$ 7,00
        categoriaId: 7,
      },
      {
        nome: "Leite Integral 1L",
        descricao: "Leite UHT",
        precoUnitario: 500, // R$ 5,00
        categoriaId: 8,
      },
      {
        nome: "Queijo Mussarela",
        descricao: "Queijo fatiado",
        precoUnitario: 3500, // R$ 35,00
        categoriaId: 8,
      },
      {
        nome: "Pizza Congelada",
        descricao: "Pizza sabor calabresa",
        precoUnitario: 2000, // R$ 20,00
        categoriaId: 9,
      },
      {
        nome: "Lasanha Congelada",
        descricao: "Lasanha bolonhesa",
        precoUnitario: 1800, // R$ 18,00
        categoriaId: 9,
      },
      {
        nome: "Ração para Cães 10kg",
        descricao: "Ração premium",
        precoUnitario: 12000, // R$ 120,00
        categoriaId: 10,
      },
      {
        nome: "Areia Sanitária 4kg",
        descricao: "Areia para gatos",
        precoUnitario: 2500, // R$ 25,00
        categoriaId: 10,
      },
    ],
  });

  console.log(`✅ ${produtos.length} Produtos criados`);
  return produtos;
}
