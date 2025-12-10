const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.propertyEvaluation.count();
    console.log(`Total PropertyEvaluation records: ${count}`);
    
    const data = await prisma.propertyEvaluation.findMany({
      take: 5,
    });
    
    console.log("\nFirst 5 records:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
