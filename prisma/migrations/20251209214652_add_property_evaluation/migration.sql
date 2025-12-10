-- CreateTable PropertyEvaluation
CREATE TABLE "PropertyEvaluation" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "houseMedianPrice" TEXT,
    "unitMedianPrice" TEXT,
    "houseYield" TEXT,
    "unitYield" TEXT,
    "priceRange" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataSource" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for unique state+suburb combination
CREATE UNIQUE INDEX "PropertyEvaluation_state_suburb_key" ON "PropertyEvaluation"("state", "suburb");

-- CreateIndex for state lookups
CREATE INDEX "PropertyEvaluation_state_idx" ON "PropertyEvaluation"("state");

-- CreateIndex for suburb lookups
CREATE INDEX "PropertyEvaluation_suburb_idx" ON "PropertyEvaluation"("suburb");

-- CreateIndex for state+suburb lookups
CREATE INDEX "PropertyEvaluation_state_suburb_idx" ON "PropertyEvaluation"("state", "suburb");
