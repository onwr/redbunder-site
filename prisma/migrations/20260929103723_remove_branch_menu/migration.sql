-- DropForeignKey
ALTER TABLE `branch_products` DROP FOREIGN KEY `branch_products_branchId_fkey`;

-- DropForeignKey
ALTER TABLE `branch_products` DROP FOREIGN KEY `branch_products_productId_fkey`;

-- AlterTable
ALTER TABLE `branches` DROP COLUMN `menuEnabled`;

-- DropTable
DROP TABLE `branch_products`;

