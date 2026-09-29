-- CreateTable
CREATE TABLE `ad_entries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `platform` ENUM('META', 'GOOGLE', 'TIKTOK', 'TRENDYOL', 'YEMEKSEPETI', 'GETIR', 'MIGROS', 'DIGER') NOT NULL,
    `campaign` VARCHAR(150) NULL,
    `periodStart` DATE NOT NULL,
    `periodEnd` DATE NOT NULL,
    `spend` DECIMAL(12, 2) NOT NULL,
    `impressions` INTEGER UNSIGNED NULL,
    `clicks` INTEGER UNSIGNED NULL,
    `orders` INTEGER UNSIGNED NULL,
    `revenue` DECIMAL(12, 2) NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` INTEGER NULL,

    INDEX `ad_entries_platform_periodStart_idx`(`platform`, `periodStart`),
    INDEX `ad_entries_periodStart_idx`(`periodStart`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('YAPILACAK', 'DEVAM', 'TAMAM') NOT NULL DEFAULT 'YAPILACAK',
    `priority` ENUM('DUSUK', 'NORMAL', 'YUKSEK') NOT NULL DEFAULT 'NORMAL',
    `category` ENUM('REKLAM', 'SOSYAL_MEDYA', 'KAMPANYA', 'OPERASYON', 'MENU', 'IK', 'DIGER') NOT NULL DEFAULT 'DIGER',
    `platform` ENUM('META', 'GOOGLE', 'TIKTOK', 'TRENDYOL', 'YEMEKSEPETI', 'GETIR', 'MIGROS', 'DIGER') NULL,
    `dueDate` DATE NOT NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `assigneeId` INTEGER NULL,
    `createdById` INTEGER NULL,

    INDEX `tasks_dueDate_idx`(`dueDate`),
    INDEX `tasks_status_dueDate_idx`(`status`, `dueDate`),
    INDEX `tasks_assigneeId_idx`(`assigneeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ad_entries` ADD CONSTRAINT `ad_entries_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_assigneeId_fkey` FOREIGN KEY (`assigneeId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
