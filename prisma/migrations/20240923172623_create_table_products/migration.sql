-- CreateTable
CREATE TABLE `products` (
    `barcode` VARCHAR(191) NOT NULL,
    `category_id` INTEGER NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `image` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `flag` ENUM('ACTIVED', 'PENDING', 'DISABLED', 'BANNED', 'DELETED') NOT NULL DEFAULT 'PENDING',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX `products_slug_key`(`slug`),
    INDEX `idx_barcode_name`(`barcode`, `name`),
    FULLTEXT INDEX `idx_name_description`(`name`, `description`),
    PRIMARY KEY (`barcode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
