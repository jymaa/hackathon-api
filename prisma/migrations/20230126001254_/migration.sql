/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Couvert` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `CouvertMelange` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Couvert_title_key" ON "Couvert"("title");

-- CreateIndex
CREATE UNIQUE INDEX "CouvertMelange_title_key" ON "CouvertMelange"("title");
