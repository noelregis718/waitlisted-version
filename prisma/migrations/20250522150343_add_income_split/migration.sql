-- CreateTable
CREATE TABLE "IncomeSplit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "strategy" TEXT NOT NULL,
    "needsPercentage" REAL NOT NULL,
    "wantsPercentage" REAL NOT NULL,
    "savingsPercentage" REAL NOT NULL,
    "investmentsPercentage" REAL NOT NULL,
    "totalMonthlyIncome" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "IncomeSplit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "IncomeSplit_userId_key" ON "IncomeSplit"("userId");

-- CreateIndex
CREATE INDEX "IncomeSplit_userId_idx" ON "IncomeSplit"("userId");
