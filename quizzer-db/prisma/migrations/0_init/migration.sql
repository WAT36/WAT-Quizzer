-- CreateTable
CREATE TABLE "advanced_quiz" (
    "id" SERIAL NOT NULL,
    "file_num" INTEGER NOT NULL,
    "quiz_num" INTEGER NOT NULL,
    "advanced_quiz_type_id" INTEGER NOT NULL,
    "quiz_sentense" VARCHAR(256) NOT NULL,
    "answer" VARCHAR(256) NOT NULL,
    "img_file" VARCHAR(128),
    "checked" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "advanced_quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advanced_quiz_explanation" (
    "id" SERIAL NOT NULL,
    "advanced_quiz_id" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "advanced_quiz_explanation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advanced_quiz_type" (
    "id" SERIAL NOT NULL,
    "type_name" VARCHAR(256) NOT NULL,
    "type_nickname" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "advanced_quiz_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_log" (
    "id" SERIAL NOT NULL,
    "quiz_format_id" INTEGER NOT NULL,
    "file_num" INTEGER NOT NULL,
    "quiz_num" INTEGER NOT NULL,
    "is_corrected" BOOLEAN,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "answer_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "file_num" INTEGER NOT NULL,
    "category" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "category_pkey" PRIMARY KEY ("file_num","category")
);

-- CreateTable
CREATE TABLE "dummy_choice" (
    "id" SERIAL NOT NULL,
    "advanced_quiz_id" INTEGER NOT NULL,
    "dummy_choice_sentense" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "dummy_choice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "englishbot_answer_log" (
    "id" SERIAL NOT NULL,
    "word_id" INTEGER NOT NULL,
    "result" BOOLEAN,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "englishbot_answer_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "example" (
    "id" SERIAL NOT NULL,
    "en_example_sentense" VARCHAR(256) NOT NULL,
    "ja_example_sentense" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "example_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idiom" (
    "id" SERIAL NOT NULL,
    "word_id" INTEGER NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "idiom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idiom_mean" (
    "id" SERIAL NOT NULL,
    "idiom_id" INTEGER NOT NULL,
    "idiommean_id" INTEGER NOT NULL,
    "partsofspeech_id" INTEGER NOT NULL,
    "meaning" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "idiom_mean_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mean" (
    "id" SERIAL NOT NULL,
    "word_id" INTEGER NOT NULL,
    "wordmean_id" INTEGER NOT NULL,
    "partsofspeech_id" INTEGER NOT NULL,
    "meaning" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "mean_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mean_example" (
    "example_sentense_id" INTEGER NOT NULL,
    "mean_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "mean_example_pkey" PRIMARY KEY ("example_sentense_id","mean_id")
);

-- CreateTable
CREATE TABLE "mean_source" (
    "mean_id" INTEGER NOT NULL,
    "source_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "mean_source_pkey" PRIMARY KEY ("mean_id","source_id")
);

-- CreateTable
CREATE TABLE "partsofspeech" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "partsofspeech_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz" (
    "id" SERIAL NOT NULL,
    "file_num" INTEGER NOT NULL,
    "quiz_num" INTEGER NOT NULL,
    "quiz_sentense" VARCHAR(256) NOT NULL,
    "answer" VARCHAR(256) NOT NULL,
    "category" VARCHAR(256),
    "img_file" VARCHAR(128),
    "checked" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_basis_advanced_linkage" (
    "id" SERIAL NOT NULL,
    "file_num" INTEGER NOT NULL,
    "basis_quiz_id" INTEGER NOT NULL,
    "advanced_quiz_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "quiz_basis_advanced_linkage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_dependency" (
    "id" SERIAL NOT NULL,
    "preliminary_quiz_id" INTEGER NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "quiz_dependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_file" (
    "file_num" SERIAL NOT NULL,
    "file_name" VARCHAR(256) NOT NULL,
    "file_nickname" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "quiz_file_pkey" PRIMARY KEY ("file_num")
);

-- CreateTable
CREATE TABLE "quiz_format" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "quiz_format_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_similarity" (
    "id" SERIAL NOT NULL,
    "similarity_group_id" INTEGER NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "quiz_similarity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_similarity_group" (
    "id" SERIAL NOT NULL,
    "similarity_group_name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "quiz_similarity_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saying" (
    "id" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "book_saying_id" INTEGER NOT NULL,
    "saying" VARCHAR(256) NOT NULL,
    "explanation" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "saying_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "selfhelp_book" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "selfhelp_book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "pronounce" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word_etymology" (
    "id" SERIAL NOT NULL,
    "word_etymology_group_id" INTEGER NOT NULL,
    "word_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "word_etymology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word_etymology_group" (
    "id" SERIAL NOT NULL,
    "word_etymology_group_name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "word_etymology_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word_similarity" (
    "id" SERIAL NOT NULL,
    "word_similarity_group_id" INTEGER NOT NULL,
    "word_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "word_similarity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word_similarity_group" (
    "id" SERIAL NOT NULL,
    "word_similarity_group_name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "word_similarity_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word_subsource" (
    "id" SERIAL NOT NULL,
    "word_id" INTEGER NOT NULL,
    "subsource" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "word_subsource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "advanced_quiz_quiz_sentense_key" ON "advanced_quiz"("quiz_sentense");

-- CreateIndex
CREATE UNIQUE INDEX "advanced_quiz_file_num_quiz_num_key" ON "advanced_quiz"("file_num", "quiz_num");

-- CreateIndex
CREATE UNIQUE INDEX "advanced_quiz_explanation_advanced_quiz_id_key" ON "advanced_quiz_explanation"("advanced_quiz_id");

-- CreateIndex
CREATE UNIQUE INDEX "advanced_quiz_type_type_name_key" ON "advanced_quiz_type"("type_name");

-- CreateIndex
CREATE UNIQUE INDEX "idiom_mean_idiom_id_idiommean_id_key" ON "idiom_mean"("idiom_id", "idiommean_id");

-- CreateIndex
CREATE UNIQUE INDEX "mean_word_id_wordmean_id_key" ON "mean"("word_id", "wordmean_id");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_quiz_sentense_key" ON "quiz"("quiz_sentense");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_file_num_quiz_num_key" ON "quiz"("file_num", "quiz_num");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_basis_advanced_linkage_basis_quiz_id_advanced_quiz_id_key" ON "quiz_basis_advanced_linkage"("basis_quiz_id", "advanced_quiz_id");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_file_file_name_key" ON "quiz_file"("file_name");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_file_file_nickname_key" ON "quiz_file"("file_nickname");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_format_name_key" ON "quiz_format"("name");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_similarity_similarity_group_id_quiz_id_key" ON "quiz_similarity"("similarity_group_id", "quiz_id");

-- CreateIndex
CREATE UNIQUE INDEX "saying_saying_key" ON "saying"("saying");

-- CreateIndex
CREATE UNIQUE INDEX "word_name_key" ON "word"("name");

-- CreateIndex
CREATE UNIQUE INDEX "word_etymology_word_etymology_group_id_word_id_key" ON "word_etymology"("word_etymology_group_id", "word_id");

-- CreateIndex
CREATE UNIQUE INDEX "word_similarity_word_similarity_group_id_word_id_key" ON "word_similarity"("word_similarity_group_id", "word_id");

-- CreateIndex
CREATE UNIQUE INDEX "word_subsource_word_id_subsource_key" ON "word_subsource"("word_id", "subsource");

-- AddForeignKey
ALTER TABLE "idiom" ADD CONSTRAINT "idiom_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "idiom_mean" ADD CONSTRAINT "idiom_mean_idiom_id_fkey" FOREIGN KEY ("idiom_id") REFERENCES "idiom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "idiom_mean" ADD CONSTRAINT "idiom_mean_partsofspeech_id_fkey" FOREIGN KEY ("partsofspeech_id") REFERENCES "partsofspeech"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mean" ADD CONSTRAINT "mean_partsofspeech_id_fkey" FOREIGN KEY ("partsofspeech_id") REFERENCES "partsofspeech"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mean" ADD CONSTRAINT "mean_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mean_example" ADD CONSTRAINT "mean_example_example_sentense_id_fkey" FOREIGN KEY ("example_sentense_id") REFERENCES "example"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mean_example" ADD CONSTRAINT "mean_example_mean_id_fkey" FOREIGN KEY ("mean_id") REFERENCES "mean"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

