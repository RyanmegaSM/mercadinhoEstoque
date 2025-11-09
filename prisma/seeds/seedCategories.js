import { PrismaClient } from "@prisma/client";

/**
 *
 * @param {PrismaClient} prisma
 * @returns
 */
export async function seedCategories(prisma) {
  const existing = await prisma.category.count();
  if (existing > 0) {
    console.log("⚠️ Categorias já existem, pulando seed...");
    return [];
  }

  const categorias = await prisma.category.createManyAndReturn({
    data: [
      { nome: "Mercearia", descricao: "Produtos de mercearia em geral" },
      { nome: "Hortifruti", descricao: "Frutas, verduras e legumes frescos" },
      { nome: "Carnes", descricao: "Carnes bovinas, suínas, aves e peixes" },
      { nome: "Padaria", descricao: "Pães, bolos e confeitaria" },
      {
        nome: "Bebidas",
        descricao: "Refrigerantes, sucos, águas e alcoólicos",
      },
      { nome: "Higiene", descricao: "Produtos de higiene pessoal" },
      {
        nome: "Limpeza",
        descricao: "Produtos de limpeza e utilidades domésticas",
      },
      { nome: "Laticínios", descricao: "Leite, queijos, iogurtes e derivados" },
      {
        nome: "Congelados",
        descricao: "Alimentos congelados prontos ou semiprontos",
      },
      { nome: "Pet Shop", descricao: "Produtos para animais de estimação" },
    ],
  });

  console.log(`✅ ${categorias.length} Categorias criadas`);
  return categorias;
}
