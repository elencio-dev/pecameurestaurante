/*
  Warnings:

  - You are about to drop the column `emoji` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `emoji` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `icon` to the `MenuItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "emoji",
ADD COLUMN     "icon" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "emoji",
ADD COLUMN     "icon" TEXT NOT NULL;
