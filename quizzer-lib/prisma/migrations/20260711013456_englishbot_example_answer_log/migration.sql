-- CreateTable
CREATE TABLE "englishbot_example_answer_log" (
    "id" SERIAL NOT NULL,
    "example_id" INTEGER NOT NULL,
    "result" BOOLEAN,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(6),
    "test_type" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "englishbot_example_answer_log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "englishbot_example_answer_log" ADD CONSTRAINT "englishbot_example_answer_log_example_id_fkey" FOREIGN KEY ("example_id") REFERENCES "example"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
