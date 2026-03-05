-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 04, 2026 at 10:20 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `agriculture_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `advisory_services`
--

CREATE TABLE `advisory_services` (
  `article_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `category` enum('crop_management','pest_control','market_trends') DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `price_per_unit` decimal(10,2) NOT NULL,
  `quantity_available` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity_bought` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `commission_fee` decimal(10,2) NOT NULL,
  `payment_status` enum('pending','completed','failed') DEFAULT 'pending',
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(15) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `user_type` enum('farmer','cooperative','buyer','admin') NOT NULL,
  `is_premium` tinyint(1) DEFAULT 0,
  `location` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `phone_number`, `password_hash`, `user_type`, `is_premium`, `location`, `created_at`) VALUES
(6, 'Mordekai', 'mordekai@gmail.com', '0786019076', '$2b$10$MVcRbPvR1NMdkhimR2zMFuvouk0y/6p/C31cXZs6YwsxX2SYeGHWG', 'admin', 0, 'Kigali', '2026-02-26 09:56:23'),
(7, 'Mordekai', 'mordekai893@gmail.com', '09876', '$2b$10$QabBQXy5cF0RvtmRWxRxTe641Aju18jVgSfW4qziAcp7zrvZDMVdq', 'buyer', 0, 'kjh', '2026-02-26 09:57:14'),
(8, 'mama', 'mama@gmail.com', '0786019076', '$2b$10$CztGDpWLZHv2EnIQgDFmLOzSWIM8auIH2Zw1DyB2xOZA.Apa/UuP2', 'farmer', 0, 'musanze', '2026-02-26 10:24:28'),
(10, 'umwana', 'umwana@gmail.com', '0786019076', '$2b$10$aMv6ettkiWdJruSshpmmpuyTqe.DviJHVJ3rd84gr0AcSsrg9T6/O', 'farmer', 0, 'kini', '2026-02-26 12:16:49'),
(11, 'Muheta', 'm@gmail.com', '9876543', '$2b$10$V.3B/E7XXjdEfaTouISj8uvHGfQpzCRYaEQAQxBVS0aiT3oUmByNG', 'farmer', 0, 'kinini', '2026-02-27 04:12:15'),
(12, 'karenzi', 'karenzi@gmail.com', '0796381024', '$2b$10$2v68tp.1sZKSUCrjaCCfauy/EJnbhg41zHV139jB.qjDSfV3k5psK', 'farmer', 0, 'mm', '2026-02-27 04:16:33'),
(13, 'samuel', 'sa@gmail.com', '07866666', '$2b$10$nliU0Os9A3bR8FI6rrYhROldVylvg1KpVEWnD.PGVnj3GjJ0foL/y', 'farmer', 0, 'musanze', '2026-02-27 04:23:12'),
(14, 'UKOBUKEYE Mordekai', 'umordekai4@gmail.com', '0796381024', '$2b$10$uDGp2ktw2vTOI1nzFag5keosBJ4veIGXoTtOnrmAGU5XeaaZgf3i2', 'admin', 0, 'Gicumbi', '2026-02-27 04:25:02'),
(15, 'Hakiza', 'ha@gmail.com', '04567654', '$2b$10$VhewVa3X7QLjjYRRp1yIAuNn/93Qxq5sSjXZX9AzCDTH38DAuo95m', 'farmer', 0, 'mabuye', '2026-02-28 15:31:22'),
(16, 'mami', 'mami@gmail.com', '09876543', '$2b$10$A1j0gsm3p0rBAn92QPU14.KOeD5oNaGEe757w5JeqnJ1S/oYuw91u', 'buyer', 0, 'kigali', '2026-03-02 18:46:34'),
(17, 'karabo', 'karabo@gmail.com', '123456', '$2b$10$UCZm1THKCiXAdhoxGWNGrOlceROTmX1rYaw5UQMfKK0x8zJGF141G', 'farmer', 0, 'mana', '2026-03-02 18:47:21');

-- --------------------------------------------------------

--
-- Table structure for table `weather_updates`
--

CREATE TABLE `weather_updates` (
  `weather_id` int(11) NOT NULL,
  `district` varchar(50) NOT NULL,
  `temperature` decimal(4,2) DEFAULT NULL,
  `rainfall_probability` int(11) DEFAULT NULL,
  `forecast_text` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `advisory_services`
--
ALTER TABLE `advisory_services`
  ADD PRIMARY KEY (`article_id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `farmer_id` (`farmer_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `buyer_id` (`buyer_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `weather_updates`
--
ALTER TABLE `weather_updates`
  ADD PRIMARY KEY (`weather_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `advisory_services`
--
ALTER TABLE `advisory_services`
  MODIFY `article_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `weather_updates`
--
ALTER TABLE `weather_updates`
  MODIFY `weather_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `advisory_services`
--
ALTER TABLE `advisory_services`
  ADD CONSTRAINT `advisory_services_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
