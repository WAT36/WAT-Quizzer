-- AlterTable
ALTER TABLE "quiz" ALTER COLUMN "format_id" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_format_id_fkey" FOREIGN KEY ("format_id") REFERENCES "quiz_format"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
