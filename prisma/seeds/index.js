import { PrismaClient } from "@prisma/client";
import { seedCategories } from "./seedCategories.js";
import { seedProducts } from "./seedProducts.js";
import { seedSuppliers } from "./seedSuppliers.js";
import { seedBatches } from "./seedBatches.js";
import { seedUsers } from "./seedUsers.js";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$transaction(async (tx) => {
      await seedUsers(tx);
      await seedCategories(tx);
      await seedProducts(tx);
      await seedSuppliers(tx);
      await seedBatches(tx);
    });

    console.log("🎉 Seed finalizado com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
