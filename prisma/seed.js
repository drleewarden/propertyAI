const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Clear existing property evaluations
  await prisma.propertyEvaluation.deleteMany({});

  // Brisbane (Queensland) Property Evaluation Data
  const brisbaneData = [
    {
      state: "QLD",
      city: "Brisbane",
      suburb: "Tingalpa",
      houseMedianPrice: "$1.08 M",
      unitMedianPrice: "$750 K",
      houseYield: "3.7%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
    {
      state: "QLD",
      city: "Brisbane",
      suburb: "Ransome",
      houseMedianPrice: "$3.9 M",
      unitMedianPrice: null,
      houseYield: "2.1%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
    {
      state: "QLD",
      city: "Brisbane",
      suburb: "Redcliffe",
      houseMedianPrice: "$850–900 K",
      unitMedianPrice: "$700–750 K",
      houseYield: "3.6–3.7%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
    {
      state: "QLD",
      city: "Brisbane",
      suburb: "Caboolture",
      houseMedianPrice: "$767–790 K",
      unitMedianPrice: "$432–500 K",
      houseYield: "4.0–4.1%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
    {
      state: "QLD",
      city: "Brisbane",
      suburb: "Southport",
      houseMedianPrice: "$1.05 M",
      unitMedianPrice: "$690–705 K",
      houseYield: "3.9–4.1%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
    {
      state: "QLD",
      city: "Brisbane",
      suburb: "Strathpine",
      houseMedianPrice: "$830–840 K",
      unitMedianPrice: "$583–603 K",
      houseYield: "4.1%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
    {
      state: "QLD",
      city: "Brisbane",
      suburb: "Deception Bay",
      houseMedianPrice: "$750 K",
      unitMedianPrice: "$575.5 K",
      houseYield: "4.14%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
    {
      state: "QLD",
      city: "Brisbane",
      suburb: "Hemmant",
      houseMedianPrice: "$985 K–1.05 M",
      unitMedianPrice: "$305–659 K",
      houseYield: "3.4–3.65%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
    {
      state: "QLD",
      city: "Brisbane",
      suburb: "Carina",
      houseMedianPrice: "$1.26–1.28 M",
      unitMedianPrice: "$898–902 K",
      houseYield: "3.1–3.4%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
  ];

  // Seed Brisbane data
  for (const data of brisbaneData) {
    await prisma.propertyEvaluation.create({
      data: {
        state: data.state,
        city: data.city,
        suburb: data.suburb,
        houseMedianPrice: data.houseMedianPrice,
        unitMedianPrice: data.unitMedianPrice,
        houseYield: data.houseYield,
        unitYield: data.unitYield,
        dataSource: data.dataSource,
      },
    });
  }

  console.log("✅ Property evaluation data seeded successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
