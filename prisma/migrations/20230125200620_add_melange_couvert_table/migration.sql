-- DropForeignKey
ALTER TABLE "DepartmentCouvertPractice" DROP CONSTRAINT "DepartmentCouvertPractice_couvertId_fkey";

-- AlterTable
ALTER TABLE "DepartmentCouvertPractice" ADD COLUMN     "couvertMelangeId" TEXT,
ALTER COLUMN "couvertId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CouvertMelange" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "properties" JSONB NOT NULL,
    "benefices" JSONB NOT NULL,
    "cultureAdaptation" JSONB NOT NULL,
    "nextCultureAdaptation" JSONB NOT NULL,
    "semiMode" JSONB NOT NULL,
    "destructionMode" JSONB NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "CouvertMelange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DepartmentCouvertPractice" ADD CONSTRAINT "DepartmentCouvertPractice_couvertId_fkey" FOREIGN KEY ("couvertId") REFERENCES "Couvert"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentCouvertPractice" ADD CONSTRAINT "DepartmentCouvertPractice_couvertMelangeId_fkey" FOREIGN KEY ("couvertMelangeId") REFERENCES "CouvertMelange"("id") ON DELETE SET NULL ON UPDATE CASCADE;
