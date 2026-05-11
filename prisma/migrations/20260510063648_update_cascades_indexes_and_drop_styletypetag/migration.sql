/*
  Warnings:

  - You are about to drop the `StyleTypeTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Choice" DROP CONSTRAINT "Choice_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Outfit" DROP CONSTRAINT "Outfit_styleTypeId_fkey";

-- DropForeignKey
ALTER TABLE "StyleTypeTag" DROP CONSTRAINT "StyleTypeTag_styleTypeId_fkey";

-- DropTable
DROP TABLE "StyleTypeTag";

-- CreateIndex
CREATE INDEX "Choice_questionId_idx" ON "Choice"("questionId");

-- CreateIndex
CREATE INDEX "DiagnosisResult_styleTypeId_idx" ON "DiagnosisResult"("styleTypeId");

-- CreateIndex
CREATE INDEX "DiagnosisResult_sessionId_idx" ON "DiagnosisResult"("sessionId");

-- CreateIndex
CREATE INDEX "Outfit_styleTypeId_idx" ON "Outfit"("styleTypeId");

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outfit" ADD CONSTRAINT "Outfit_styleTypeId_fkey" FOREIGN KEY ("styleTypeId") REFERENCES "StyleType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
