-- CreateTable
CREATE TABLE "example_explanation" (
    "id" SERIAL NOT NULL,
    "example_id" INTEGER NOT NULL,
    "explanation" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "example_explanation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "example_explanation" ADD CONSTRAINT "example_explanation_example_id_fkey" FOREIGN KEY ("example_id") REFERENCES "example"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
