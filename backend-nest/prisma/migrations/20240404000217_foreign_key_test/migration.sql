-- AddForeignKey
ALTER TABLE "advanced_quiz" ADD CONSTRAINT "advanced_quiz_file_num_fkey" FOREIGN KEY ("file_num") REFERENCES "quiz_file"("file_num") ON DELETE RESTRICT ON UPDATE CASCADE;
