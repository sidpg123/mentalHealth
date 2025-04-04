/*
  Warnings:

  - You are about to drop the column `questionType` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `scoreMapping` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `possibleConditions` on the `UserResponse` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `UserResponse` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `UserResponse` table. All the data in the column will be lost.
  - Added the required column `category` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responses` to the `UserResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `results` to the `UserResponse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserResponse" DROP CONSTRAINT "UserResponse_questionnaireId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "questionType",
DROP COLUMN "scoreMapping",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserResponse" DROP COLUMN "possibleConditions",
DROP COLUMN "score",
DROP COLUMN "submittedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "responses" JSONB NOT NULL,
ADD COLUMN     "results" JSONB NOT NULL;

-- DropEnum
DROP TYPE "QuestionType";

-- AddForeignKey
ALTER TABLE "UserResponse" ADD CONSTRAINT "UserResponse_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;
