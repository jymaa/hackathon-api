-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Couvert" (
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

    CONSTRAINT "Couvert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentCouvertPractice" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "semiTypes" JSONB NOT NULL,
    "couvertId" TEXT NOT NULL,

    CONSTRAINT "DepartmentCouvertPractice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "DepartmentCouvertPractice" ADD CONSTRAINT "DepartmentCouvertPractice_couvertId_fkey" FOREIGN KEY ("couvertId") REFERENCES "Couvert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
