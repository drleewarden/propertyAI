import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing questions
  await prisma.propertyQuestion.deleteMany({});

  // Property Information Questions
  await prisma.propertyQuestion.create({
    data: {
      question: "What is the property address?",
      type: "text",
      category: "property",
      required: true,
      order: 1,
    },
  });

  await prisma.propertyQuestion.create({
    data: {
      question: "What is the property type?",
      type: "select",
      options: JSON.stringify([
        "Single Family Home",
        "Multi-Family",
        "Commercial",
        "Land",
        "Other",
      ]),
      category: "property",
      required: true,
      order: 2,
    },
  });

  await prisma.propertyQuestion.create({
    data: {
      question: "How many bedrooms?",
      type: "number",
      category: "property",
      required: false,
      order: 3,
    },
  });

  await prisma.propertyQuestion.create({
    data: {
      question: "How many bathrooms?",
      type: "number",
      category: "property",
      required: false,
      order: 4,
    },
  });

  await prisma.propertyQuestion.create({
    data: {
      question: "Square footage?",
      type: "number",
      category: "property",
      required: false,
      order: 5,
    },
  });

  await prisma.propertyQuestion.create({
    data: {
      question: "Year built?",
      type: "number",
      category: "property",
      required: false,
      order: 6,
    },
  });

  // Market Information Questions
  await prisma.propertyQuestion.create({
    data: {
      question: "List price or asking price?",
      type: "number",
      category: "market",
      required: true,
      order: 7,
    },
  });

  await prisma.propertyQuestion.create({
    data: {
      question: "Current market conditions (increasing/stable/declining)?",
      type: "select",
      options: JSON.stringify([
        "Increasing",
        "Stable",
        "Declining",
        "Uncertain",
      ]),
      category: "market",
      required: true,
      order: 8,
    },
  });

  await prisma.propertyQuestion.create({
    data: {
      question: "What is the average rental income in this area (monthly)?",
      type: "number",
      category: "market",
      required: false,
      order: 9,
    },
  });

  // Financial Questions
  await prisma.propertyQuestion.create({
    data: {
      question: "Estimated annual property taxes?",
      type: "number",
      category: "financial",
      required: false,
      order: 10,
    },
  });

  await prisma.propertyQuestion.create({
    data: {
      question: "Estimated annual insurance cost?",
      type: "number",
      category: "financial",
      required: false,
      order: 11,
    },
  });

  await prisma.propertyQuestion.create({
    data: {
      question: "Estimated annual maintenance costs?",
      type: "number",
      category: "financial",
      required: false,
      order: 12,
    },
  });

  await prisma.propertyQuestion.create({
    data: {
      question: "Down payment percentage planned?",
      type: "number",
      category: "financial",
      required: false,
      order: 13,
    },
  });

  // Additional Information Questions
  await prisma.propertyQuestion.create({
    data: {
      question: "Any property conditions or issues to note?",
      type: "textarea",
      category: "additional",
      required: false,
      order: 14,
    },
  });

  await prisma.propertyQuestion.create({
    data: {
      question: "Investment goals and timeline?",
      type: "textarea",
      category: "additional",
      required: false,
      order: 15,
    },
  });

  console.log("✅ Property questions seeded successfully");

  // Clear existing property evaluations
  await prisma.propertyEvaluation.deleteMany({});

  // Brisbane (Queensland) Property Evaluation Data
  const brisbaneData = [
    {
      state: "QLD",
      suburb: "Tingalpa",
      houseMedianPrice: "$1.08 M",
      unitMedianPrice: "$750 K",
      houseYield: "3.7%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
    {
      state: "QLD",
      suburb: "Ransome",
      houseMedianPrice: "$3.9 M",
      unitMedianPrice: null,
      houseYield: "2.1%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
    {
      state: "QLD",
      suburb: "Redcliffe",
      houseMedianPrice: "$850–900 K",
      unitMedianPrice: "$700–750 K",
      houseYield: "3.6–3.7%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
    {
      state: "QLD",
      suburb: "Caboolture",
      houseMedianPrice: "$767–790 K",
      unitMedianPrice: "$432–500 K",
      houseYield: "4.0–4.1%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
    {
      state: "QLD",
      suburb: "Southport",
      houseMedianPrice: "$1.05 M",
      unitMedianPrice: "$690–705 K",
      houseYield: "3.9–4.1%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
    {
      state: "QLD",
      suburb: "Strathpine",
      houseMedianPrice: "$830–840 K",
      unitMedianPrice: "$583–603 K",
      houseYield: "4.1%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
    {
      state: "QLD",
      suburb: "Deception Bay",
      houseMedianPrice: "$750 K",
      unitMedianPrice: "$575.5 K",
      houseYield: "4.14%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
    {
      state: "QLD",
      suburb: "Hemmant",
      houseMedianPrice: "$985 K–1.05 M",
      unitMedianPrice: "$305–659 K",
      houseYield: "3.4–3.65%",
      unitYield: null,
      dataSource: "Real Estate Database",
    },
    {
      state: "QLD",
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
