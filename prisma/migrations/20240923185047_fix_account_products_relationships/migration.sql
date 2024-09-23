/*
  Warnings:

  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `users_username_key` ON `users`;

-- AlterTable
ALTER TABLE `accounts` ADD COLUMN `username` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `email_verify` MODIFY `expired_at` TIMESTAMP(0) NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 5 MINUTE),
    MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `products` MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `username`,
    MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX `accounts_username_key` ON `accounts`(`username`);

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_username_fkey` FOREIGN KEY (`username`) REFERENCES `accounts`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
