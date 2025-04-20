-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2025 at 08:51 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `streaming_web`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`) VALUES
(1, 'Phim hot', 'phim-hot'),
(2, 'Phim lẻ', 'phim-le'),
(3, 'Phim bộ', 'phim-bo'),
(4, 'Phim chiếu rạp', 'phim-chieu-rap');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` bigint(20) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `movie_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name`, `slug`) VALUES
(1, 'Việt Nam', 'viet-nam'),
(2, 'Hàn Quốc', 'han-quoc'),
(3, 'USA', 'usa'),
(4, 'Trung Quốc', 'trung-quoc'),
(5, 'Nhật Bản', 'nhat-ban');

-- --------------------------------------------------------

--
-- Table structure for table `genres`
--

CREATE TABLE `genres` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `genres`
--

INSERT INTO `genres` (`id`, `name`, `slug`) VALUES
(1, 'Gay cấn', 'gay-can'),
(2, 'Kịch tính ', 'kich-tinh-'),
(3, 'Hài hước', 'hai-huoc'),
(4, 'Tình cảm', 'tinh-cam'),
(5, 'Hành động', 'hanh-dong'),
(6, 'Chiến Tranh & Chính Trị', 'chien-tranh-chinh-tri'),
(7, 'Chính kịch', 'chinh-kich');

-- --------------------------------------------------------

--
-- Table structure for table `invalidated_token`
--

CREATE TABLE `invalidated_token` (
  `id` varchar(255) NOT NULL,
  `expiry_time` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invalidated_token`
--

INSERT INTO `invalidated_token` (`id`, `expiry_time`) VALUES
('35af3d23-0f06-41ab-8a84-ffa91bbe4933', '2025-05-28 01:35:27.000000'),
('3e0a61f8-4b30-48b9-8507-d4d472597d75', '2025-05-28 02:56:55.000000'),
('57b09f44-02fd-4757-a67a-ce50da77f68d', '2025-05-28 07:57:47.000000');

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `id` varchar(255) NOT NULL,
  `average_rating` double DEFAULT NULL,
  `backdrop` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text NOT NULL,
  `duration` double NOT NULL,
  `folder_id` varchar(255) DEFAULT NULL,
  `original_title` varchar(255) DEFAULT NULL,
  `premium` bit(1) NOT NULL,
  `rating_count` int(11) DEFAULT NULL,
  `release_year` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `stream_url` varchar(255) NOT NULL,
  `thumbnail` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `trailer_link` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `video_id` varchar(255) NOT NULL,
  `views` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`id`, `average_rating`, `backdrop`, `created_at`, `description`, `duration`, `folder_id`, `original_title`, `premium`, `rating_count`, `release_year`, `status`, `stream_url`, `thumbnail`, `title`, `trailer_link`, `updated_at`, `video_id`, `views`) VALUES
('164b3c74-c87d-4f4c-bbc9-a0266a35e56e', 0, 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744788189/vc3qcmt7cowpsoatm8zg.jpg', '2025-04-16 14:23:18.000000', 'Dựa trên trò chơi điện tử năm 2013 do Naughty Dog phát triển, sê-ri sẽ theo chân Joel, một kẻ buôn lậu được giao nhiệm vụ hộ tống cô gái tuổi teen Ellie băng qua một nước Mỹ hậu tận thế.', 120, '1rhr8vLUVO-E-Xl6c-MlykpDSO4UZloLy', 'Những người còn sót lại (2023)', b'1', 0, 2023, 'PUBLIC', 'https://drive.google.com/file/d/1xsfkNdLjkV1Jmu04QoEjmjLqhASXTwdp/view?usp=drivesdk', 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744788187/skmd6rmuxyazkl3tofif.webp', 'The Last of Us', 'https://www.youtube.com/watch?v=osYpGSz_0i4&t=1s', NULL, '1xsfkNdLjkV1Jmu04QoEjmjLqhASXTwdp', 0),
('17b0f79c-d1c7-47fa-adf1-710ed646cde3', 0, 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744777022/popx3zxb0zh3miqo14wt.jpg', '2025-04-16 11:17:10.000000', '123123', 125, '1XHIZFq_VXQ13-_A7pEGmgE6zsjxW_XPd', 'Mickey 17 (2025)', b'1', 0, 2025, 'PUBLIC', 'https://drive.google.com/file/d/1u09z3KcJsvNFG7BvBtjZBb_z561DEqls/view?usp=drivesdk', 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744777021/xkxebghizcgst2jtojav.webp', 'ABC ', 'https://www.youtube.com/watch?v=osYpGSz_0i4&t=1s', NULL, '1u09z3KcJsvNFG7BvBtjZBb_z561DEqls', 0),
('285a42ee-14b1-463a-b386-a89359900fd4', 0, 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744776001/ri3roit2lqkpnjx5ejh3.jpg', '2025-04-16 10:25:15.000000', 'Được chuyển thể từ tiểu thuyết Mickey 7 của nhà văn Edward Ashton, Cuốn tiểu thuyết xoay quanh các phiên bản nhân bản vô tính mang tên “Mickey”, dùng để thay thế con người thực hiện cuộc chinh phạt nhằm thuộc địa hóa vương quốc băng giá Niflheim. Mỗi khi một Mickey chết đi, một Mickey mới sẽ được tạo ra, với phiên bản được đánh số 1, 2, 3 tiếp theo. Mickey số 17 được cho rằng đã chết, để rồi một ngày kia, hắn quay lại và bắt gặp phiên bản tiếp theo của mình.', 0, '1TpbteJagUaZCQTggTZDa8fQ3zLLEcQzy', 'Mickey 17 (2025)', b'1', 0, 2024, 'PUBLIC', 'https://drive.google.com/file/d/1uG2h4XKt5pS6Bsdjfinqkcfle0W1ynv6/view?usp=drivesdk', 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744773905/seh0n6fyanezlp8dag7r.webp', 'Mickey 17', 'https://www.youtube.com/watch?v=osYpGSz_0i4&t=1s', NULL, '1uG2h4XKt5pS6Bsdjfinqkcfle0W1ynv6', 0),
('45eac8cd-bb8f-4688-83f3-d47db916adc0', 0, 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744794344/kl1kna9edg8kfzvsyar0.jpg', '2025-04-16 16:06:33.000000', 'ádasdzxc', 123, '1IeW53RL_y423u8g8k2Zrsh8JVllo5mHM', 'ádxz', b'1', 0, 2023, 'PUBLIC', 'https://drive.google.com/file/d/1oCWXti_ox8cJo-42BFPjeB7rH09Mbo7g/view?usp=drivesdk', 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744794342/tbun0ycezodmfisf3seq.webp', 'abcd', 'https://www.youtube.com/watch?v=MklqyAU5MRc', NULL, '1oCWXti_ox8cJo-42BFPjeB7rH09Mbo7g', 0),
('56554ed1-3a6a-463b-9412-8369ecb5aa04', 0, 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744788035/vheltnp5xfgnwnidqyp0.jpg', '2025-04-16 14:20:42.000000', 'Ẩn tu sĩ Ưu Văn Hóa và yêu cơ Diệp Thiên Mạch đã trải qua nhiều kiếp gặp gỡ rồi lại quên nhau. Lần này, họ lại tình cờ tái ngộ vào thế kỷ 21. Nhưng Diệp Thiên Mạch đã bị Thiên tôn lợi dụng, hóa thân thành ba hình tượng khác nhau, một chị đại quyến rũ, một người phụ nữ trưởng thành, và một mỹ nhân lạnh lùng để tiếp cận Ưu Văn Hóa, nhằm chiếm đoạt tinh nguyên của anh. Đối mặt với cuộc truy sát của người yêu qua nhiều kiếp, sự phục hồi ký ức, đại kiếp nạn của giới ẩn tu và cả lôi kiếp trăm năm của bản thân, trong tình thế rối ren chồng chất, Ưu Văn Hóa phải làm thế nào để xoay chuyển cục diện, giữ vững tình yêu của mình và lật ngược ván cờ?', 0, '1-r_WM08WOx9gLaJDVFZMOaz99pZUZhdd', 'Strange Memories', b'0', 0, 2025, 'PUBLIC', 'https://drive.google.com/file/d/1pbiXyvGpbitiIeTBT3N9VqmT-qof_I7W/view?usp=drivesdk', 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744788033/wbjr1ii6n4crxr4i5aat.webp', 'Ký ức kỳ lạ', 'https://www.youtube.com/watch?v=T0sHaz4H9MQ', NULL, '1pbiXyvGpbitiIeTBT3N9VqmT-qof_I7W', 0),
('6139f199-9263-40a8-9092-6d1b1be11467', 0, 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744465270/zqpdaectfiphar7ovc8x.jpg', '2025-04-16 10:41:24.000000', 'Xin Đừng Tin Cô Ấy là một bộ phim hài lãng mạn Trung Quốc, dựa trên bộ phim Hàn Quốc cùng tên ra mắt năm 2004. Câu chuyện xoay quanh một người phụ nữ lừa đảo, giả làm bạn gái của con trai trưởng thôn, và dần dần trở thành một phần trong gia đình. Cô ấy tạo ra nhiều tình huống hài hước khi mưu đồ của mình bị phơi bày.', 126, '18qumhNnGklSowiOuGJ-RzSywPLcXgq15', 'Don\'t Trust Her', b'1', 0, 2025, 'PUBLIC', 'https://drive.google.com/file/d/1fbDkr3BnC4bfzOXFmQgLPqtY1ICtZl-9/view?usp=drivesdk', 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744774876/fiqbpnkrdpinoxl0qlwn.jpg', 'Xin đừng tin cô ấy', 'https://www.youtube.com/watch?v=MklqyAU5MRc', NULL, '1fbDkr3BnC4bfzOXFmQgLPqtY1ICtZl-9', 0);

-- --------------------------------------------------------

--
-- Table structure for table `movie_actor`
--

CREATE TABLE `movie_actor` (
  `movie_id` varchar(255) NOT NULL,
  `person_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movie_actor`
--

INSERT INTO `movie_actor` (`movie_id`, `person_id`) VALUES
('164b3c74-c87d-4f4c-bbc9-a0266a35e56e', 4),
('17b0f79c-d1c7-47fa-adf1-710ed646cde3', 6),
('285a42ee-14b1-463a-b386-a89359900fd4', 3),
('285a42ee-14b1-463a-b386-a89359900fd4', 4),
('285a42ee-14b1-463a-b386-a89359900fd4', 7),
('45eac8cd-bb8f-4688-83f3-d47db916adc0', 4),
('56554ed1-3a6a-463b-9412-8369ecb5aa04', 4),
('6139f199-9263-40a8-9092-6d1b1be11467', 4),
('6139f199-9263-40a8-9092-6d1b1be11467', 7);

-- --------------------------------------------------------

--
-- Table structure for table `movie_category`
--

CREATE TABLE `movie_category` (
  `movie_id` varchar(255) NOT NULL,
  `category_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movie_category`
--

INSERT INTO `movie_category` (`movie_id`, `category_id`) VALUES
('164b3c74-c87d-4f4c-bbc9-a0266a35e56e', 1),
('164b3c74-c87d-4f4c-bbc9-a0266a35e56e', 2),
('17b0f79c-d1c7-47fa-adf1-710ed646cde3', 3),
('285a42ee-14b1-463a-b386-a89359900fd4', 1),
('285a42ee-14b1-463a-b386-a89359900fd4', 2),
('45eac8cd-bb8f-4688-83f3-d47db916adc0', 1),
('56554ed1-3a6a-463b-9412-8369ecb5aa04', 1),
('6139f199-9263-40a8-9092-6d1b1be11467', 1),
('6139f199-9263-40a8-9092-6d1b1be11467', 4);

-- --------------------------------------------------------

--
-- Table structure for table `movie_country`
--

CREATE TABLE `movie_country` (
  `movie_id` varchar(255) NOT NULL,
  `country_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movie_country`
--

INSERT INTO `movie_country` (`movie_id`, `country_id`) VALUES
('164b3c74-c87d-4f4c-bbc9-a0266a35e56e', 3),
('17b0f79c-d1c7-47fa-adf1-710ed646cde3', 4),
('285a42ee-14b1-463a-b386-a89359900fd4', 3),
('45eac8cd-bb8f-4688-83f3-d47db916adc0', 2),
('56554ed1-3a6a-463b-9412-8369ecb5aa04', 3),
('6139f199-9263-40a8-9092-6d1b1be11467', 2);

-- --------------------------------------------------------

--
-- Table structure for table `movie_director`
--

CREATE TABLE `movie_director` (
  `movie_id` varchar(255) NOT NULL,
  `person_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movie_director`
--

INSERT INTO `movie_director` (`movie_id`, `person_id`) VALUES
('164b3c74-c87d-4f4c-bbc9-a0266a35e56e', 9),
('17b0f79c-d1c7-47fa-adf1-710ed646cde3', 8),
('285a42ee-14b1-463a-b386-a89359900fd4', 9),
('45eac8cd-bb8f-4688-83f3-d47db916adc0', 9),
('56554ed1-3a6a-463b-9412-8369ecb5aa04', 8),
('6139f199-9263-40a8-9092-6d1b1be11467', 1),
('6139f199-9263-40a8-9092-6d1b1be11467', 8);

-- --------------------------------------------------------

--
-- Table structure for table `movie_genre`
--

CREATE TABLE `movie_genre` (
  `movie_id` varchar(255) NOT NULL,
  `genre_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movie_genre`
--

INSERT INTO `movie_genre` (`movie_id`, `genre_id`) VALUES
('164b3c74-c87d-4f4c-bbc9-a0266a35e56e', 2),
('17b0f79c-d1c7-47fa-adf1-710ed646cde3', 2),
('285a42ee-14b1-463a-b386-a89359900fd4', 3),
('285a42ee-14b1-463a-b386-a89359900fd4', 5),
('285a42ee-14b1-463a-b386-a89359900fd4', 6),
('45eac8cd-bb8f-4688-83f3-d47db916adc0', 1),
('56554ed1-3a6a-463b-9412-8369ecb5aa04', 7),
('6139f199-9263-40a8-9092-6d1b1be11467', 4);

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `persons`
--

CREATE TABLE `persons` (
  `id` bigint(20) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `biography` varchar(255) DEFAULT NULL,
  `birth_date` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `persons`
--

INSERT INTO `persons` (`id`, `avatar`, `biography`, `birth_date`, `name`, `role`) VALUES
(1, 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744771826/gpsxrscellcdgq7q55x3.png', NULL, '2003-01-12', 'Phan Đăng Quân ', 'Director'),
(2, 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744772690/wpvmxstxiqfoldcxuvse.webp', NULL, '2002-03-21', 'Anamaria Vartolomei', 'Actor'),
(3, 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744772790/yfm96akumrkflpfo9wbp.webp', NULL, '2003-11-05', 'Mark Ruffalo', 'Actor'),
(4, 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744772818/pekyghxbngeq03m2gpgs.webp', NULL, '1997-12-20', 'Robert Pattinson', 'Actor'),
(5, 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744772897/xi95axauqlpl0lckd73r.webp', NULL, '2003-01-01', 'Pedro Pascal', 'Actor'),
(6, 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744772935/blillx5tmvqicjdyuweq.webp', NULL, '2000-03-12', 'Gabriel Luna', 'Actor'),
(7, 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744773004/kjuzmgfgzrssmglneryh.webp', NULL, '2002-10-06', 'Isabela Moner', 'Actor'),
(8, 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744773170/ts9asp1mabyovvkreffv.webp', NULL, '1998-10-06', 'Craig Mazin', 'Director'),
(9, 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744773215/qcwxu16abavd393aht5r.webp', NULL, '2000-01-01', 'Neil Druckmann', 'Director'),
(10, 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744776001/ri3roit2lqkpnjx5ejh3.jpg', NULL, '2002-03-12', 'Nguyễn Văn A', 'Actor');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `star_value` varbinary(255) DEFAULT NULL,
  `movie_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`name`, `description`) VALUES
('ADMIN', 'Admin role'),
('USER', 'User role');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_name` varchar(255) NOT NULL,
  `permissions_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `avatar`, `dob`, `email`, `full_name`, `password`, `username`) VALUES
('92565301-84a1-4ce9-8c35-69e1435c04b3', 'https://res.cloudinary.com/dhn3lfvlf/image/upload/v1744775765/q2645n8ubg757w9xepgf.jpg', '2003-10-06', 'itsbn610@gmail.com', 'Bảo Ngô', '$2a$08$NwisF8QJXLT1bOT.zCro4OnOlcyH6pyUtx.sBlRldAxOjklHO1DY6', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `users_roles`
--

CREATE TABLE `users_roles` (
  `user_id` varchar(255) NOT NULL,
  `roles_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_roles`
--

INSERT INTO `users_roles` (`user_id`, `roles_name`) VALUES
('92565301-84a1-4ce9-8c35-69e1435c04b3', 'ADMIN');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKr1xv5xvew7k2aed5qu5lci3kt` (`movie_id`),
  ADD KEY `FK8omq0tc18jd43bu5tjh6jvraq` (`user_id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invalidated_token`
--
ALTER TABLE `invalidated_token`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `movie_actor`
--
ALTER TABLE `movie_actor`
  ADD PRIMARY KEY (`movie_id`,`person_id`),
  ADD KEY `FKaaio870sung6o5g15omwrqovg` (`person_id`);

--
-- Indexes for table `movie_category`
--
ALTER TABLE `movie_category`
  ADD PRIMARY KEY (`movie_id`,`category_id`),
  ADD KEY `FKdglw5871flcg87i60sfs9i75c` (`category_id`);

--
-- Indexes for table `movie_country`
--
ALTER TABLE `movie_country`
  ADD PRIMARY KEY (`movie_id`,`country_id`),
  ADD KEY `FKt4ul4mvv1gjnw90bm6pygnweq` (`country_id`);

--
-- Indexes for table `movie_director`
--
ALTER TABLE `movie_director`
  ADD PRIMARY KEY (`movie_id`,`person_id`),
  ADD KEY `FKlfi576qesckgrcc9fvaeqid3p` (`person_id`);

--
-- Indexes for table `movie_genre`
--
ALTER TABLE `movie_genre`
  ADD PRIMARY KEY (`movie_id`,`genre_id`),
  ADD KEY `FK3pdaf1ai9eafeypc7qe401l07` (`genre_id`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `persons`
--
ALTER TABLE `persons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK44trpo3u915t27ybt03ib4h0o` (`movie_id`),
  ADD KEY `FKb3354ee2xxvdrbyq9f42jdayd` (`user_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_name`,`permissions_name`),
  ADD KEY `FKf5aljih4mxtdgalvr7xvngfn1` (`permissions_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_roles`
--
ALTER TABLE `users_roles`
  ADD PRIMARY KEY (`user_id`,`roles_name`),
  ADD KEY `FK7tacasmhqivyolfjjxseeha5c` (`roles_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `genres`
--
ALTER TABLE `genres`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `persons`
--
ALTER TABLE `persons`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `FK8omq0tc18jd43bu5tjh6jvraq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKr1xv5xvew7k2aed5qu5lci3kt` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`);

--
-- Constraints for table `movie_actor`
--
ALTER TABLE `movie_actor`
  ADD CONSTRAINT `FK90bbe6vpr6eoahw20ta95nkta` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
  ADD CONSTRAINT `FKaaio870sung6o5g15omwrqovg` FOREIGN KEY (`person_id`) REFERENCES `persons` (`id`);

--
-- Constraints for table `movie_category`
--
ALTER TABLE `movie_category`
  ADD CONSTRAINT `FKdglw5871flcg87i60sfs9i75c` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `FKqvd8pujjfprrqnsykk3rjwo6k` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`);

--
-- Constraints for table `movie_country`
--
ALTER TABLE `movie_country`
  ADD CONSTRAINT `FK69n4x6w2r5t4i98v1bo1nj5lb` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
  ADD CONSTRAINT `FKt4ul4mvv1gjnw90bm6pygnweq` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`);

--
-- Constraints for table `movie_director`
--
ALTER TABLE `movie_director`
  ADD CONSTRAINT `FK9ydac07lpj14ahlf1wcep7qyq` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
  ADD CONSTRAINT `FKlfi576qesckgrcc9fvaeqid3p` FOREIGN KEY (`person_id`) REFERENCES `persons` (`id`);

--
-- Constraints for table `movie_genre`
--
ALTER TABLE `movie_genre`
  ADD CONSTRAINT `FK3pdaf1ai9eafeypc7qe401l07` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`),
  ADD CONSTRAINT `FKg7f38h6umffo51no9ywq91438` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`);

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `FK44trpo3u915t27ybt03ib4h0o` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
  ADD CONSTRAINT `FKb3354ee2xxvdrbyq9f42jdayd` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `FKcppvu8fk24eqqn6q4hws7ajux` FOREIGN KEY (`role_name`) REFERENCES `role` (`name`),
  ADD CONSTRAINT `FKf5aljih4mxtdgalvr7xvngfn1` FOREIGN KEY (`permissions_name`) REFERENCES `permission` (`name`);

--
-- Constraints for table `users_roles`
--
ALTER TABLE `users_roles`
  ADD CONSTRAINT `FK2o0jvgh89lemvvo17cbqvdxaa` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FK7tacasmhqivyolfjjxseeha5c` FOREIGN KEY (`roles_name`) REFERENCES `role` (`name`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
