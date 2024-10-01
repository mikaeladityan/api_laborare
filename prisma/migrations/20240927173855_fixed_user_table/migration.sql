/*
  Warnings:

  - You are about to drop the column `clerkId` on the `users` table. All the data in the column will be lost.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `flag` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `users_clerkId_key` ON `users`;

-- AlterTable
ALTER TABLE `email_verify` MODIFY `expired_at` TIMESTAMP(0) NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 5 MINUTE),
    MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `products` MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `clerkId`,
    MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `password` VARCHAR(100) NOT NULL,
    MODIFY `flag` ENUM('ACTIVED', 'PENDING', 'DISABLED', 'BANNED', 'DELETED') NOT NULL DEFAULT 'PENDING',
    MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
