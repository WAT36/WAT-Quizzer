-- AddForeignKey
ALTER TABLE "mean_source" ADD CONSTRAINT "mean_source_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mean_source" ADD CONSTRAINT "mean_source_mean_id_fkey" FOREIGN KEY ("mean_id") REFERENCES "mean"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
