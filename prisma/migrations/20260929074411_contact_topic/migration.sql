-- AlterTable
ALTER TABLE `contact_messages` ADD COLUMN `branchId` INTEGER NULL,
    ADD COLUMN `topic` ENUM('GENEL', 'ONERI_GORUS', 'SIKAYET', 'FRANCHISE', 'DIGER') NOT NULL DEFAULT 'GENEL';

-- CreateIndex
CREATE INDEX `contact_messages_topic_idx` ON `contact_messages`(`topic`);

-- CreateIndex
CREATE INDEX `contact_messages_branchId_idx` ON `contact_messages`(`branchId`);

-- AddForeignKey
ALTER TABLE `contact_messages` ADD CONSTRAINT `contact_messages_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
