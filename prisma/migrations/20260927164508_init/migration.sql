-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(100) NOT NULL,
    `role` ENUM('ADMIN', 'EDITOR', 'HR') NOT NULL DEFAULT 'EDITOR',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(64) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `district` VARCHAR(80) NULL,
    `address` VARCHAR(255) NULL,
    `phone` VARCHAR(20) NULL,
    `mapUrl` VARCHAR(500) NULL,
    `openingHours` VARCHAR(120) NULL,
    `imageUrl` VARCHAR(255) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `menuEnabled` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `branches_slug_key`(`slug`),
    INDEX `branches_isActive_sortOrder_idx`(`isActive`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(64) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `imageUrl` VARCHAR(255) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `menu_categories_slug_key`(`slug`),
    INDEX `menu_categories_isActive_sortOrder_idx`(`isActive`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(100) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `imageUrl` VARCHAR(255) NULL,
    `calories` SMALLINT UNSIGNED NULL,
    `allergens` VARCHAR(255) NULL,
    `isNew` BOOLEAN NOT NULL DEFAULT false,
    `isPopular` BOOLEAN NOT NULL DEFAULT false,
    `isSpicy` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `categoryId` INTEGER NOT NULL,

    UNIQUE INDEX `products_slug_key`(`slug`),
    INDEX `products_categoryId_isActive_sortOrder_idx`(`categoryId`, `isActive`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branch_products` (
    `branchId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `price` DECIMAL(10, 2) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `branch_products_productId_idx`(`productId`),
    PRIMARY KEY (`branchId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(64) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `positions_slug_key`(`slug`),
    INDEX `positions_isActive_sortOrder_idx`(`isActive`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `applications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(11) NOT NULL,
    `gender` ENUM('KADIN', 'ERKEK', 'DIGER') NOT NULL,
    `age` TINYINT UNSIGNED NOT NULL,
    `status` ENUM('YENI', 'INCELENIYOR', 'GORUSME', 'KABUL', 'RED') NOT NULL DEFAULT 'YENI',
    `note` TEXT NULL,
    `kvkkConsent` BOOLEAN NOT NULL DEFAULT false,
    `ip` VARCHAR(45) NULL,
    `userAgent` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `positionId` INTEGER NOT NULL,
    `branchId` INTEGER NULL,

    INDEX `applications_status_idx`(`status`),
    INDEX `applications_positionId_idx`(`positionId`),
    INDEX `applications_branchId_idx`(`branchId`),
    INDEX `applications_createdAt_idx`(`createdAt`),
    INDEX `applications_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(20) NULL,
    `subject` VARCHAR(150) NULL,
    `message` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `ip` VARCHAR(45) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `contact_messages_isRead_createdAt_idx`(`isRead`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `key` VARCHAR(64) NOT NULL,
    `value` TEXT NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `menu_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branch_products` ADD CONSTRAINT `branch_products_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branch_products` ADD CONSTRAINT `branch_products_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
