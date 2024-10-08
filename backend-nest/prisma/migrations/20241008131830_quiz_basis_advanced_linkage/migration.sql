-- DropForeignKey
ALTER TABLE "quiz_basis_advanced_linkage" DROP CONSTRAINT "quiz_basis_advanced_linkage_advanced_quiz_id_fkey";

-- AlterTable
ALTER TABLE "answer_log" ALTER COLUMN "quiz_id" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "quiz_basis_advanced_linkage" ADD CONSTRAINT "quiz_basis_advanced_linkage_advanced_quiz_id_fkey" FOREIGN KEY ("advanced_quiz_id") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
