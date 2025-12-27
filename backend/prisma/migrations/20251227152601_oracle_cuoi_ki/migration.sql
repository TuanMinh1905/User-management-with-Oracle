-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `position` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MANAGER', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    `status` ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE') NOT NULL DEFAULT 'ACTIVE',
    `avatar` VARCHAR(191) NULL,
    `join_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_employee_id_key`(`employee_id`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
