import { PrismaClient } from "@prisma/client";

/**
 *
 * @param {PrismaClient} prisma
 * @returns
 */
export async function seedSuppliers(prisma) {
  const existing = await prisma.supplier.count();
  if (existing > 0) {
    console.log("⚠️ Fornecedores já existem, pulando seed...");
    return [];
  }

  const fornecedores = await prisma.supplier.createManyAndReturn({
    data: [
      {
        nome: "Distribuidora Alimentos Brasil",
        telefone: "11999990001",
        endereco: "Av. Brasil, 1000 - São Paulo/SP",
        cnpj: "12.345.678/0001-11",
      },
      {
        nome: "HortiFresco LTDA",
        telefone: "11999990002",
        endereco: "Rua das Flores, 200 - Campinas/SP",
        cnpj: "23.456.789/0001-22",
      },
      {
        nome: "Frigorífico Boi Bom",
        telefone: "11999990003",
        endereco: "Rodovia BR-101, km 55 - Santos/SP",
        cnpj: "34.567.890/0001-33",
      },
      {
        nome: "Padaria Pão Quentinho",
        telefone: "11999990004",
        endereco: "Rua Central, 50 - São Paulo/SP",
        cnpj: "45.678.901/0001-44",
      },
      {
        nome: "Bebidas Geladas Distribuidora",
        telefone: "11999990005",
        endereco: "Av. dos Andradas, 400 - Belo Horizonte/MG",
        cnpj: "56.789.012/0001-55",
      },
      {
        nome: "Higiclean Produtos de Higiene",
        telefone: "11999990006",
        endereco: "Rua São João, 90 - Rio de Janeiro/RJ",
        cnpj: "67.890.123/0001-66",
      },
      {
        nome: "Quimix Limpeza LTDA",
        telefone: "11999990007",
        endereco: "Rua Verde, 321 - Curitiba/PR",
        cnpj: "78.901.234/0001-77",
      },
      {
        nome: "Laticínios Serra Azul",
        telefone: "11999990008",
        endereco: "Estrada da Serra, km 15 - Poços de Caldas/MG",
        cnpj: "89.012.345/0001-88",
      },
      {
        nome: "Congelados Sabor Caseiro",
        telefone: "11999990009",
        endereco: "Av. Norte, 700 - Recife/PE",
        cnpj: "90.123.456/0001-99",
      },
      {
        nome: "PetFood Brasil",
        telefone: "11999990010",
        endereco: "Rua dos Animais, 12 - Porto Alegre/RS",
        cnpj: "11.222.333/0001-00",
      },
    ],
  });

  console.log(`✅ ${fornecedores.length} Fornecedores criados`);
  return fornecedores;
}
