-- CreateTable
CREATE TABLE `branch_phones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(40) NULL,
    `number` VARCHAR(20) NOT NULL,
    `isWhatsapp` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `branchId` INTEGER NOT NULL,

    INDEX `branch_phones_branchId_sortOrder_idx`(`branchId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `branch_phones` ADD CONSTRAINT `branch_phones_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
