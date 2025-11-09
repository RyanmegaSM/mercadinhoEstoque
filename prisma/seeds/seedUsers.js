import { hash } from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { SALT } from "../../src/misc/constants.js";

/**
 * Seeder de usuários
 *
 * @param {PrismaClient} prisma
 * @returns {Promise<Array>} lista de usuários criados ou [] se já existirem
 */
export async function seedUsers(prisma) {
  const existing = await prisma.user.count();
  if (existing > 0) {
    console.log("⚠️ Usuários já existem, pulando seed...");
    return [];
  }

  const rawUsers = [
    {
      nome: "Administrador",
      email: "admin@local.com",
      senha: "admin123",
      tipoDeAcesso: 1,
    },
    {
      nome: "Gerente",
      email: "manager@local.com",
      senha: "manager123",
      tipoDeAcesso: 2,
    },
    {
      nome: "Funcionario",
      email: "employee@local.com",
      senha: "employee123",
      tipoDeAcesso: 3,
    },
  ];

  const usersToCreate = [];
  for (const u of rawUsers) {
    const hashed = await hash(u.senha, SALT);
    usersToCreate.push({
      nome: u.nome,
      email: u.email,
      senha: hashed,
      tipoDeAcesso: u.tipoDeAcesso,
    });
  }

  // createManyAndReturn é usado nas seeds existentes; manter o mesmo padrão
  const created = await prisma.user.createManyAndReturn({
    data: usersToCreate,
  });

  console.log(`✅ ${created.length} Usuários criados`);
  return created;
}
