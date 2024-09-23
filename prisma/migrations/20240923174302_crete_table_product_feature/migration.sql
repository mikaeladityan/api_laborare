-- CreateTable
CREATE TABLE `features` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `barcode` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `value` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `flag` ENUM('ACTIVED', 'PENDING', 'DISABLED', 'BANNED', 'DELETED') NOT NULL DEFAULT 'ACTIVED',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `features` ADD CONSTRAINT `features_barcode_fkey` FOREIGN KEY (`barcode`) REFERENCES `products`(`barcode`) ON DELETE RESTRICT ON UPDATE CASCADE;
