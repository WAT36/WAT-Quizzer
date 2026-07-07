-- CreateTable
CREATE TABLE "example_source" (
    "id" SERIAL NOT NULL,
    "example_id" INTEGER NOT NULL,
    "source_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "example_source_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "example_source_example_id_source_id_key" ON "example_source"("example_id", "source_id");

-- AddForeignKey
ALTER TABLE "example_source" ADD CONSTRAINT "example_source_example_id_fkey" FOREIGN KEY ("example_id") REFERENCES "example"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "example_source" ADD CONSTRAINT "example_source_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "source"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
