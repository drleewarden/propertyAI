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

  console.log("✅ Seed data created successfully");
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
