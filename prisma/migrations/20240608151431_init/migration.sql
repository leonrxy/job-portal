-- CreateTable
CREATE TABLE `job_seekers` (
    `job_seeker_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NULL,
    `otpExpires` DATETIME(3) NULL,
    `verified` ENUM('true', 'false') NOT NULL DEFAULT 'false',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `job_seekers_email_key`(`email`),
    PRIMARY KEY (`job_seeker_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_seeker_details` (
    `job_seeker_detail_id` VARCHAR(191) NOT NULL,
    `resume_url` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `job_seeker_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `job_seeker_details_job_seeker_id_key`(`job_seeker_id`),
    PRIMARY KEY (`job_seeker_detail_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `universities` (
    `university_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `university_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NULL,
    `otpExpires` DATETIME(3) NULL,
    `verified` ENUM('true', 'false') NOT NULL DEFAULT 'false',
    `status` ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `universities_email_key`(`email`),
    PRIMARY KEY (`university_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_details` (
    `university_detail_id` VARCHAR(191) NOT NULL,
    `logo_url` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `photo_url` VARCHAR(191) NULL,
    `university_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `university_details_university_id_key`(`university_id`),
    PRIMARY KEY (`university_detail_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companies` (
    `company_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `company_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NULL,
    `otpExpires` DATETIME(3) NULL,
    `verified` ENUM('true', 'false') NOT NULL DEFAULT 'false',
    `status` ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `companies_email_key`(`email`),
    PRIMARY KEY (`company_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_details` (
    `company_detail_id` VARCHAR(191) NOT NULL,
    `logo_url` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `photo_url` VARCHAR(191) NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `company_details_company_id_key`(`company_id`),
    PRIMARY KEY (`company_detail_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `admin_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('superadmin', 'admin') NOT NULL DEFAULT 'admin',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admins_email_key`(`email`),
    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `job_seeker_details` ADD CONSTRAINT `job_seeker_details_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seekers`(`job_seeker_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_details` ADD CONSTRAINT `university_details_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities`(`university_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_details` ADD CONSTRAINT `company_details_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`company_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
