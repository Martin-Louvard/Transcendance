/*
  Warnings:

  - The `status` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Created';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'inacttive',
ALTER COLUMN "rank" SET DEFAULT 'Noobie';

-- DropEnum
DROP TYPE "GameStatus";

-- DropEnum
DROP TYPE "UserStatus";
