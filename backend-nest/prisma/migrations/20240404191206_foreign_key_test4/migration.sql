-- AddForeignKey
ALTER TABLE "saying" ADD CONSTRAINT "saying_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "selfhelp_book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
