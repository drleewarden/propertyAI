#!/bin/bash

# Run Prisma Studio with proper environment variables
export DATABASE_URL="postgresql://postgres:password@localhost:5432/property_investment_ai"

echo "🚀 Starting Prisma Studio with DATABASE_URL=$DATABASE_URL"
echo "📊 Prisma Studio will be available at: http://localhost:5555"
echo ""

npx prisma studio
