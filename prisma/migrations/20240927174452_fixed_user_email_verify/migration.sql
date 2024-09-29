-- DropForeignKey
ALTER TABLE `email_verify` DROP FOREIGN KEY `email_verify_email_fkey`;

-- AlterTable
ALTER TABLE `accounts` MODIFY `is_login` ENUM('LOGIN', 'LOGOUT') NOT NULL DEFAULT 'LOGIN';

-- AlterTable
ALTER TABLE `email_verify` MODIFY `ip` CHAR(20) NULL,
    MODIFY `userAgent` VARCHAR(100) NULL,
    MODIFY `expired_at` TIMESTAMP(0) NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 5 MINUTE),
    MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `products` MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `users` MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE `email_verify` ADD CONSTRAINT `email_verify_email_fkey` FOREIGN KEY (`email`) REFERENCES `users`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
