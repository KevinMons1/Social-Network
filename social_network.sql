-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3308
-- Généré le : mar. 18 mai 2021 à 19:00
-- Version du serveur :  5.7.31
-- Version de PHP : 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `social_network`
--

-- --------------------------------------------------------

--
-- Structure de la table `friends`
--

DROP TABLE IF EXISTS `friends`;
CREATE TABLE IF NOT EXISTS `friends` (
  `friendId` int(11) NOT NULL AUTO_INCREMENT,
  `user1Id` int(11) NOT NULL,
  `user2Id` int(11) NOT NULL,
  PRIMARY KEY (`friendId`)
) ENGINE=MyISAM AUTO_INCREMENT=47 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `friends`
--

INSERT INTO `friends` (`friendId`, `user1Id`, `user2Id`) VALUES
(5, 33, 29),
(6, 33, 31),
(7, 34, 33),
(8, 34, 31),
(9, 35, 39),
(10, 35, 41),
(11, 35, 40),
(12, 35, 36),
(13, 35, 37),
(14, 35, 38),
(15, 35, 33),
(16, 35, 34),
(17, 35, 31),
(18, 36, 33),
(19, 36, 39),
(20, 36, 37),
(21, 36, 32),
(22, 36, 38),
(23, 41, 39),
(24, 41, 40),
(25, 41, 36),
(26, 41, 37),
(27, 41, 38),
(28, 41, 34),
(29, 42, 41),
(30, 42, 35),
(31, 42, 36),
(32, 42, 39),
(34, 33, 37),
(38, 35, 46),
(36, 39, 33),
(44, 33, 45),
(45, 47, 48),
(46, 48, 49);

-- --------------------------------------------------------

--
-- Structure de la table `likes`
--

DROP TABLE IF EXISTS `likes`;
CREATE TABLE IF NOT EXISTS `likes` (
  `likeId` int(11) NOT NULL AUTO_INCREMENT,
  `publicationId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`likeId`)
) ENGINE=MyISAM AUTO_INCREMENT=245 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `likes`
--

INSERT INTO `likes` (`likeId`, `publicationId`, `userId`) VALUES
(6, 75, 16),
(22, 70, 31),
(7, 75, 21),
(17, 70, 33),
(20, 75, 31),
(21, 78, 31),
(19, 54, 33),
(18, 78, 33),
(23, 84, 32),
(24, 85, 31),
(25, 85, 32),
(26, 103, 33),
(28, 104, 31),
(29, 105, 33),
(30, 147, 38),
(31, 146, 38),
(32, 145, 38),
(33, 144, 38),
(34, 143, 38),
(35, 140, 38),
(36, 139, 38),
(37, 138, 38),
(38, 137, 38),
(39, 106, 38),
(40, 105, 38),
(41, 104, 38),
(42, 103, 38),
(43, 101, 38),
(44, 85, 38),
(45, 84, 38),
(46, 78, 38),
(47, 75, 38),
(48, 150, 39),
(49, 149, 39),
(50, 148, 39),
(51, 147, 39),
(52, 146, 39),
(53, 145, 39),
(54, 144, 39),
(55, 143, 39),
(56, 140, 39),
(57, 139, 39),
(58, 138, 39),
(59, 137, 39),
(60, 106, 39),
(61, 105, 39),
(62, 104, 39),
(63, 103, 39),
(64, 101, 39),
(65, 85, 39),
(66, 84, 39),
(67, 78, 39),
(68, 75, 39),
(69, 152, 39),
(70, 151, 39),
(71, 152, 35),
(72, 151, 35),
(73, 150, 35),
(74, 149, 35),
(75, 148, 35),
(76, 147, 35),
(77, 146, 35),
(78, 139, 35),
(79, 104, 35),
(80, 85, 35),
(81, 148, 40),
(82, 144, 40),
(83, 105, 40),
(84, 151, 41),
(85, 147, 41),
(86, 145, 41),
(87, 105, 41),
(88, 103, 41),
(89, 154, 40),
(90, 151, 40),
(91, 149, 40),
(92, 146, 40),
(93, 149, 41),
(94, 140, 41),
(95, 101, 41),
(96, 156, 36),
(97, 151, 36),
(98, 149, 36),
(99, 144, 36),
(100, 105, 36),
(101, 101, 36),
(102, 157, 42),
(103, 156, 42),
(104, 155, 42),
(105, 150, 42),
(106, 148, 42),
(107, 149, 42),
(108, 144, 42),
(109, 106, 42),
(110, 103, 42),
(111, 154, 42),
(112, 152, 42),
(113, 145, 42),
(114, 140, 42),
(115, 105, 42),
(116, 158, 43),
(117, 155, 43),
(118, 153, 43),
(119, 152, 43),
(120, 149, 43),
(121, 140, 43),
(122, 75, 43),
(123, 160, 33),
(124, 157, 33),
(125, 153, 33),
(126, 154, 33),
(127, 149, 33),
(128, 146, 33),
(129, 145, 33),
(130, 148, 33),
(131, 148, 33),
(171, 164, 35),
(139, 159, 33),
(159, 163, 33),
(170, 163, 35),
(157, 164, 33),
(158, 165, 33),
(145, 162, 33),
(146, 162, 33),
(161, 162, 35),
(162, 162, 35),
(174, 165, 40),
(169, 165, 35),
(168, 165, 35),
(175, 164, 40),
(176, 163, 40),
(178, 165, 42),
(179, 165, 41),
(180, 165, 31),
(181, 161, 35),
(190, 139, 33),
(183, 164, 31),
(184, 164, 31),
(185, 163, 31),
(186, 162, 42),
(187, 163, 42),
(188, 161, 42),
(189, 164, 42),
(191, 161, 33),
(192, 166, 41),
(208, 166, 31),
(207, 166, 31),
(209, 158, 33),
(210, 158, 33),
(211, 174, 33),
(212, 173, 44),
(235, 151, 46),
(243, 175, 33),
(218, 170, 45),
(219, 170, 45),
(234, 173, 45),
(236, 175, 46),
(242, 173, 35),
(240, 175, 35),
(244, 176, 33);

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `notificationId` int(11) NOT NULL AUTO_INCREMENT,
  `senderId` int(11) NOT NULL,
  `receiverId` int(11) NOT NULL,
  `type` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `view` tinyint(1) DEFAULT '0',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notificationId`)
) ENGINE=MyISAM AUTO_INCREMENT=172 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`notificationId`, `senderId`, `receiverId`, `type`, `view`, `date`) VALUES
(169, 33, 45, 'like', 0, '2021-05-18 15:49:15'),
(168, 33, 46, 'like', 0, '2021-05-13 08:12:47'),
(167, 33, 46, 'like', 0, '2021-05-13 08:12:47');

-- --------------------------------------------------------

--
-- Structure de la table `privaterooms`
--

DROP TABLE IF EXISTS `privaterooms`;
CREATE TABLE IF NOT EXISTS `privaterooms` (
  `roomId` int(11) NOT NULL AUTO_INCREMENT,
  `friendId` int(11) NOT NULL,
  PRIMARY KEY (`roomId`)
) ENGINE=MyISAM AUTO_INCREMENT=71 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `privaterooms`
--

INSERT INTO `privaterooms` (`roomId`, `friendId`) VALUES
(1, 6),
(10, 5),
(12, 7),
(13, 8),
(14, 15),
(15, 17),
(16, 36),
(17, 9),
(45, 38),
(46, 30),
(68, 44),
(69, 45),
(70, 46);

-- --------------------------------------------------------

--
-- Structure de la table `publicationcontent`
--

DROP TABLE IF EXISTS `publicationcontent`;
CREATE TABLE IF NOT EXISTS `publicationcontent` (
  `publicationContentId` int(11) NOT NULL AUTO_INCREMENT,
  `publicationId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `text` text CHARACTER SET latin1,
  `type` varchar(50) CHARACTER SET latin1 NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`publicationContentId`)
) ENGINE=MyISAM AUTO_INCREMENT=118 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `publicationcontent`
--

INSERT INTO `publicationcontent` (`publicationContentId`, `publicationId`, `userId`, `text`, `type`, `date`) VALUES
(1, 70, NULL, 'http://localhost:3001/Images/1612979969710-bezkoder-raw.jpg', 'image', '2021-03-09 11:45:23'),
(93, 168, NULL, 'http://localhost:3001/Images/1618654539870-bezkoder-blob', 'image', '2021-04-17 10:15:39'),
(3, 58, NULL, 'http://localhost:3001/Images/1612715380474-bezkoder-profil.jpg', 'image', '2021-03-09 11:45:23'),
(4, 59, NULL, 'http://localhost:3001/Images/1612715380507-bezkoder-Image_du_Maroc_3.jpg', 'image', '2021-03-09 11:45:23'),
(5, 78, NULL, 'http://localhost:3001/Images/1614261041614-bezkoder-f528b8aba5444331781f6746174c963a.jpg', 'image', '2021-03-09 11:45:23'),
(6, 54, NULL, 'http://localhost:3001/Images/1612715144061-bezkoder-101960072_1295406590850621_5428564065477755011_n.jpg', 'image', '2021-03-09 11:45:23'),
(7, 55, NULL, 'http://localhost:3001/Images/1612715144087-bezkoder-69508153_1052548391803110_8384269601994702848_o.jpg', 'image', '2021-03-09 11:45:23'),
(8, 75, NULL, 'http://localhost:3001/Images/1613582395138-bezkoder-profil4.jpg', 'image', '2021-03-09 11:45:23'),
(9, 85, NULL, 'http://localhost:3001/Images/1614963149224-bezkoder-profil3.jpg', 'image', '2021-03-09 11:45:23'),
(10, 101, NULL, 'http://localhost:3001/Images/1615023606480-bezkoder-blob', 'image', '2021-03-09 11:45:23'),
(11, 103, NULL, 'http://localhost:3001/Images/1615023692699-bezkoder-blob', 'image', '2021-03-09 11:45:23'),
(23, 72, 29, 'Je suis le premier commentaire..', 'comment', '2021-02-17 16:37:03'),
(24, 72, 29, '2eme', 'comment', '2021-02-17 16:55:54'),
(25, 72, 29, 'J\'aime le veau !', 'comment', '2021-02-17 16:56:00'),
(26, 72, 29, 'Salut, je dois tester un grand text alors : Napoléon Bonaparte, né le 15 août 1769 à Ajaccio et mort le 5 mai 1821 sur l\'île Sainte-Hélène, est un militaire et homme d\'État français, premier empereur des Français, du 18 mai 1804 au 6 avril 1814 et du 20 mars au 22 juin 1815, sous le nom de Napoléon Ier.', 'comment', '2021-02-17 17:10:56'),
(27, 72, 32, 'Salut, je suis un test', 'comment', '2021-02-17 17:16:39'),
(28, 70, 33, 'Génial !', 'comment', '2021-02-23 10:52:29'),
(29, 78, 33, 'je m\'auto répond', 'comment', '2021-03-02 14:10:20'),
(54, 144, NULL, 'http://localhost:3001/Images/1615829611102-bezkoder-blob', 'image', '2021-03-15 17:33:31'),
(55, 145, NULL, 'http://localhost:3001/Images/1615829664406-bezkoder-blob', 'image', '2021-03-15 17:34:24'),
(42, 105, NULL, 'http://localhost:3001/Images/1615451985380-bezkoder-blob', 'image', '2021-03-11 08:39:45'),
(94, 169, NULL, 'http://localhost:3001/Images/1618674061727-bezkoder-blob', 'image', '2021-04-17 15:41:01'),
(53, 143, NULL, 'http://localhost:3001/Videos/1615829558814-video-alerteinfo-gros-gros-bordel-a-manifestation-liege-ce-13-mars-les-jeunes-prennent-le-pouvoir.mp4', 'video', '2021-03-15 17:32:38'),
(47, 137, 38, 'http://localhost:3001/Images/1615828697959-bezkoder-blob', 'image', '2021-03-15 17:18:17'),
(48, 138, 38, 'http://localhost:3001/Images/1615828697965-bezkoder-blob', 'image', '2021-03-15 17:18:17'),
(49, 139, NULL, 'http://localhost:3001/Images/1615829233831-bezkoder-blob', 'image', '2021-03-15 17:27:13'),
(50, 140, 35, 'http://localhost:3001/Images/1615829277631-bezkoder-blob', 'image', '2021-03-15 17:27:57'),
(51, 141, NULL, 'http://localhost:3001/Videos/1615829320063-video-alerteinfo-gros-gros-bordel-a-manifestation-liege-ce-13-mars-les-jeunes-prennent-le-pouvoir.mp4', 'video', '2021-03-15 17:28:40'),
(52, 142, NULL, 'http://localhost:3001/Videos/1615829370478-video-alerteinfo-gros-gros-bordel-a-manifestation-liege-ce-13-mars-les-jeunes-prennent-le-pouvoir.mp4', 'video', '2021-03-15 17:29:30'),
(56, 146, NULL, 'http://localhost:3001/Videos/1615829735414-video-le-probleme-des-pauvres-robert-kiyosaki.mp4', 'video', '2021-03-15 17:35:35'),
(57, 147, NULL, 'http://localhost:3001/Images/1615830082769-bezkoder-blob', 'image', '2021-03-15 17:41:22'),
(58, 148, 37, 'http://localhost:3001/Images/1615830162603-bezkoder-blob', 'image', '2021-03-15 17:42:42'),
(59, 149, NULL, 'http://localhost:3001/Videos/1615830198103-video-my-tiktok-video-had-1-million-views-in-less-than-24-hrs-viral-egg-sandwich-hack.mp4', 'video', '2021-03-15 17:43:18'),
(60, 150, 36, 'http://localhost:3001/Images/1615830241265-bezkoder-blob', 'image', '2021-03-15 17:44:01'),
(61, 146, 39, 'Je l\'adore', 'comment', '2021-03-15 17:45:48'),
(62, 151, 39, 'http://localhost:3001/Images/1615830382893-bezkoder-blob', 'image', '2021-03-15 17:46:22'),
(63, 152, 39, 'http://localhost:3001/Images/1615830382941-bezkoder-blob', 'image', '2021-03-15 17:46:22'),
(64, 153, NULL, 'http://localhost:3001/Images/1615830506609-bezkoder-blob', 'image', '2021-03-15 17:48:26'),
(65, 152, 41, 'Magnifique le style !', 'comment', '2021-03-15 17:49:43'),
(66, 154, 41, 'http://localhost:3001/Images/1615830909041-bezkoder-blob', 'image', '2021-03-15 17:55:09'),
(67, 155, NULL, 'http://localhost:3001/Videos/1615830946899-video-genius-tiktok-food-hacks-to-do-in-these-times-at-home-try-it.mp4', 'video', '2021-03-15 17:55:47'),
(68, 156, NULL, 'http://localhost:3001/Images/1615831001630-bezkoder-blob', 'image', '2021-03-15 17:56:41'),
(69, 157, NULL, 'http://localhost:3001/Images/1615831815224-bezkoder-blob', 'image', '2021-03-15 18:10:15'),
(70, 158, 42, 'http://localhost:3001/Images/1615831926924-bezkoder-blob', 'image', '2021-03-15 18:12:06'),
(71, 159, 42, 'http://localhost:3001/Images/1615831926968-bezkoder-blob', 'image', '2021-03-15 18:12:06'),
(72, 155, 43, 'Tiktok c\'est dla merde', 'comment', '2021-03-15 18:14:55'),
(73, 160, NULL, 'http://localhost:3001/Videos/1615832199630-video-la-plus-grosse-erreur-que-commettent-les-jeunes-robert-kiyosaki-fr.mp4', 'video', '2021-03-15 18:16:40'),
(74, 161, NULL, 'http://localhost:3001/Images/1615832274097-bezkoder-blob', 'image', '2021-03-15 18:17:54'),
(75, 162, NULL, 'http://localhost:3001/Videos/1615974585130-video-how-to-make-egg-sandwich-that-went-viral-on-tiktok.mp4', 'video', '2021-03-17 09:49:45'),
(76, 164, 33, 'http://localhost:3001/Images/1617104311217-bezkoder-blob', 'image', '2021-03-30 11:38:31'),
(77, 165, NULL, 'http://localhost:3001/Images/1617184254963-bezkoder-blob', 'image', '2021-03-31 09:50:54'),
(78, 165, 33, 'je m\'auto répond comme un con', 'comment', '2021-03-31 09:51:11'),
(79, 161, 35, 'J\'ai pas compris', 'comment', '2021-04-02 10:06:56'),
(80, 161, 35, 'Ahhh c\'est une blague de codeur ou je sais pas quoi ?', 'comment', '2021-04-02 10:07:37'),
(81, 161, 35, 'Si oui ben c\'est nul', 'comment', '2021-04-02 10:07:44'),
(82, 161, 35, 'Je parle beaucoup pour rien enfaite', 'comment', '2021-04-02 10:09:22'),
(83, 161, 35, 'Je fais des testes enfaite c\'est pour ça ', 'comment', '2021-04-02 10:13:11'),
(84, 161, 35, 'Encore des tests !', 'comment', '2021-04-02 10:14:01'),
(85, 165, 35, 'pd !', 'comment', '2021-04-02 10:30:03'),
(96, 170, NULL, 'http://localhost:3001/Images/1619714569400-bezkoder-blob', 'image', '2021-04-29 16:42:49'),
(87, 164, 35, 'Elles sont jolies !', 'comment', '2021-04-03 11:21:32'),
(88, 165, 31, 'Calme toi Gabriel', 'comment', '2021-04-03 11:26:14'),
(97, 171, NULL, 'http://localhost:3001/Videos/1619716272504-video-tiktok-viral-food-hack-testing-making-quesadilla-in-the-toaster-does-it-work-at-tiktok.mp4', 'video', '2021-04-29 17:11:12'),
(90, 165, 33, 'Ouais calme toi', 'comment', '2021-04-09 16:17:54'),
(99, 173, NULL, 'http://localhost:3001/Images/1619868622152-bezkoder-blob', 'image', '2021-05-01 11:30:22'),
(98, 172, NULL, 'http://localhost:3001/Videos/1619716453924-video-tiktok-viral-food-hack-testing-making-quesadilla-in-the-toaster-does-it-work-at-tiktok.mp4', 'video', '2021-04-29 17:14:14'),
(100, 165, 33, 'YOOOO', 'comment', '2021-05-01 15:13:35'),
(101, 165, 33, 'yoo', 'comment', '2021-05-04 13:38:11'),
(103, 161, 33, 'Moi aussi je fais des tests', 'comment', '2021-05-05 07:02:52'),
(110, 151, 46, 'cool\n', 'comment', '2021-05-11 12:36:20'),
(111, 175, 46, 'http://localhost:3001/Images/1620736625082-bezkoder-blob', 'image', '2021-05-11 12:37:05'),
(112, 176, 45, 'http://localhost:3001/Images/1620894418022-bezkoder-blob', 'image', '2021-05-13 08:26:58'),
(113, 177, 47, 'http://localhost:3001/Images/1621353330593-bezkoder-blob', 'image', '2021-05-18 15:55:30'),
(114, 178, 47, 'http://localhost:3001/Images/1621353331159-bezkoder-blob', 'image', '2021-05-18 15:55:31'),
(115, 179, 48, 'http://localhost:3001/Images/1621353350200-bezkoder-blob', 'image', '2021-05-18 15:55:50'),
(116, 180, NULL, 'http://localhost:3001/Images/1621353974228-bezkoder-blob', 'image', '2021-05-18 16:06:14'),
(117, 181, NULL, 'http://localhost:3001/Videos/1621354011127-video-la-plus-grosse-erreur-que-commettent-les-jeunes-robert-kiyosaki-fr.mp4', 'video', '2021-05-18 16:06:52');

-- --------------------------------------------------------

--
-- Structure de la table `publications`
--

DROP TABLE IF EXISTS `publications`;
CREATE TABLE IF NOT EXISTS `publications` (
  `publicationId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `text` mediumtext,
  `hashtag` mediumtext,
  `commentsTotal` int(11) DEFAULT '0',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`publicationId`)
) ENGINE=MyISAM AUTO_INCREMENT=182 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `publications`
--

INSERT INTO `publications` (`publicationId`, `userId`, `text`, `hashtag`, `commentsTotal`, `date`) VALUES
(70, 29, 'Elon Musk a provoqué une flambée du bitcoin en annonçant lundi 8 février que Tesla investissait 1,5 milliard de dollars dans la monnaie virtuelle. Mais, pour l’éditorialiste financier du Guardian, “tweeter avec enthousiasme sur le bitcoin est une chose, dépenser 1,5 milliard de dollars, sur les fonds des actionnaires, pour acheter de la cryptomonnaie en est une autre”.', 'bitcoin;investisseurs', 1, '2021-02-10 17:59:29'),
(54, 31, '', 'newProfileImage', 0, '2021-02-07 16:25:44'),
(55, 31, '', 'newBannerImage', 0, '2021-02-07 16:25:44'),
(58, 29, 'Styler non ?', 'newProfileImage', 0, '2021-02-07 16:29:40'),
(72, 29, 'Le bitcoin est une cryptomonnaie soumise à de fortes fluctuations. Forcément, alimenter la trésorerie d’une entreprise en bitcoins n’a pas grand-chose à voir avec une “diversification en francs suisses”, souligne-t-il. Ce que Tesla a concédé au passage dans son communiqué en jugeant que les actifs numériques en bitcoins “ont été et continuent à être assez volatils”. Côté gestion des risques, poursuit le journaliste, “peu importe que Tesla envisage d’accepter le paiement en bitcoins”. Après tout, si d’aucuns veulent acheter “leur voiture électrique avec des bitcoins, c’est leur choix”. Tesla pourrait, par simple prudence, “convertir immédiatement ces paiements en dollars ou dans d’autres devises”.\n\n', 'cypto', 5, '2021-02-17 16:36:47'),
(75, 33, '', 'newProfileImage', 0, '2021-02-17 17:19:55'),
(78, 33, '', 'newBannerImage', 2, '2021-02-25 13:50:41'),
(85, 32, 'Mes cheveux au vent', '', 0, '2021-03-05 16:52:29'),
(101, 34, 'Ben quoi ? J\'adore la bouff', 'newProfileImage', 0, '2021-03-06 09:40:06'),
(103, 34, 'Elle est causée par une onde de choc du vent solaire ou nuage de champ magnétique. Elle est causée par la perturbation temporaire magnétique dans un milieu interplanétaire. Les tempêtes magnétiques sont chose commune durant le cycle solaire durant 11 ans donc les aurores boréales évoluent aussi périodiquement.', 'Finlande;Nature', 0, '2021-03-06 09:41:32'),
(105, 33, 'On la trouver beau avec un pote ', 'panda', 0, '2021-03-11 08:39:45'),
(173, 33, 'Ce n\'est pas moi mais voilà', '', 0, '2021-05-01 11:30:21'),
(137, 38, '', 'newBannerImage', 0, '2021-03-15 17:18:17'),
(138, 38, '\"Citation de fou\"', 'newProfileImage', 0, '2021-03-15 17:18:17'),
(139, 38, 'Le Comité de concertation se réunit à nouveau ce vendredi à 14h00 au Palais d’Egmont à Bruxelles afin de réévaluer la situation épidémique belge et éventuellement de décider d’éventuels assouplissements des mesures sanitaires. Une semaine après la \"douche froide\" de la réunion du vendredi 26 février, les chiffres des hospitalisations n’ont certes pas explosé, mais ils sont en augmentation. Voilà qui pourrait peut-être compliquer les discussions.', 'Coronavirus', 0, '2021-03-15 17:27:12'),
(140, 35, 'Je suis un oeuf !!!!', 'newProfileImage', 0, '2021-03-15 17:27:57'),
(145, 36, 'Ca me manque les voyages...', 'nostalgie;voyage', 0, '2021-03-15 17:34:24'),
(143, 35, 'C\'est la fête pendant la manif !', 'Liege', 0, '2021-03-15 17:32:38'),
(144, 37, 'C\'est un peu ça', 'dev', 0, '2021-03-15 17:33:31'),
(146, 37, 'Robert Kiyosaki ! Un vrai homme', '', 1, '2021-03-15 17:35:35'),
(147, 38, 'La maladie à coronavirus 2019 COVID-19 est une ‎maladie infectieuse due à un coronavirus découvert ‎récemment. ‎\nLa majorité des personnes atteintes de la COVID-19 ‎ne ressentiront que des symptômes bénins ou ‎modérés et guériront sans traitement particulier. ‎', 'coronavirus', 0, '2021-03-15 17:41:22'),
(148, 37, '', 'newProfileImage', 0, '2021-03-15 17:42:42'),
(149, 36, 'OHHHHHHHHH MIAMMMM', 'food;foodHack', 0, '2021-03-15 17:43:18'),
(150, 36, '', 'newProfileImage', 0, '2021-03-15 17:44:01'),
(151, 39, '', 'newBannerImage', 1, '2021-03-15 17:46:22'),
(152, 39, '', 'newProfileImage', 1, '2021-03-15 17:46:22'),
(153, 40, 'Seul l\'élite peut comprend', 'Crypto', 0, '2021-03-15 17:48:26'),
(154, 41, '', 'newProfileImage', 0, '2021-03-15 17:55:09'),
(155, 35, 'Manger ! hahaha', 'foodhack;food', 1, '2021-03-15 17:55:46'),
(156, 39, 'I have a dream', '', 0, '2021-03-15 17:56:41'),
(157, 41, 'Teslaaaaaaaaaa', 'car', 0, '2021-03-15 18:10:14'),
(158, 42, '', 'newProfileImage', 0, '2021-03-15 18:12:06'),
(159, 42, '', 'newBannerImage', 0, '2021-03-15 18:12:06'),
(160, 43, 'Regardez', '', 0, '2021-03-15 18:16:39'),
(161, 33, 'haha', '', 7, '2021-03-15 18:17:53'),
(164, 33, '', 'newProfileImage', 1, '2021-03-30 11:38:31'),
(165, 33, 'haha', '', 6, '2021-03-31 09:50:54'),
(170, 33, 'Its magic', '', 0, '2021-04-29 16:42:49'),
(175, 46, '', 'newProfileImage', 0, '2021-05-11 12:37:05'),
(176, 45, '', 'newProfileImage', 0, '2021-05-13 08:26:58'),
(177, 47, 'Je ne sais pas quoi dire', 'newProfileImage', 0, '2021-05-18 15:55:30'),
(178, 47, 'Tokyo', 'newProfileImage', 0, '2021-05-18 15:55:31'),
(179, 48, '', 'newProfileImage', 0, '2021-05-18 15:55:50'),
(180, 47, 'Tout ce que j\'aime', '', 0, '2021-05-18 16:06:14'),
(181, 47, 'Elle a déjà été partagée mais c\'est à voir', '', 0, '2021-05-18 16:06:51');

-- --------------------------------------------------------

--
-- Structure de la table `roommessages`
--

DROP TABLE IF EXISTS `roommessages`;
CREATE TABLE IF NOT EXISTS `roommessages` (
  `msgId` int(11) NOT NULL AUTO_INCREMENT,
  `roomId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `text` text NOT NULL,
  `type` varchar(50) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`msgId`)
) ENGINE=MyISAM AUTO_INCREMENT=130 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `roommessages`
--

INSERT INTO `roommessages` (`msgId`, `roomId`, `userId`, `text`, `type`, `date`) VALUES
(11, 1, 31, 'Je code et toi ?', 'text', '2021-03-07 10:48:38'),
(10, 1, 33, 'Super, tu fais quoi ?', 'text', '2021-03-07 10:47:31'),
(9, 1, 31, 'Salut ! Bien et toi ?', 'text', '2021-03-07 10:47:09'),
(8, 1, 33, 'Salut ça va ?', 'text', '2021-03-07 10:46:23'),
(12, 1, 33, 'Pareil ! Tu code quoi ?', 'text', '2021-03-07 10:48:49'),
(14, 1, 31, 'Un tchat et ça à l\'air de fonctionner en tout cas et toi ?', 'text', '2021-03-07 10:50:40'),
(15, 1, 33, 'Pareil ! Tu utilises quoi pour le faire ?', 'text', '2021-03-07 10:52:34'),
(16, 1, 31, 'Socket.io, c\'est une API qui fait du temps réel ', 'text', '2021-03-07 10:52:51'),
(17, 1, 33, 'Ah je connais pas, moi j\'utilise l\'ajax à l\'ancienne haha', 'text', '2021-03-07 10:53:12'),
(18, 1, 31, 'Socket.io est super facile', 'text', '2021-03-07 10:53:22'),
(19, 1, 31, 'En quelque petite ligne tu as un tchat', 'text', '2021-03-07 10:53:31'),
(20, 1, 31, 'Beaucoup de grosse entreprise l\'utilise comme Uber pour voir les voitures ce déplacer sur la carte sans refresh l\'appli. Le temps réel ce n\'est pas que pour les tchat hein, tu peux l\'utiliser aussi pour des graphiques, des cartes, des jeux en multijoueur etc', 'text', '2021-03-07 10:56:00'),
(21, 12, 33, 'Salut', 'text', '2021-03-07 11:28:55'),
(22, 1, 31, 'Tu comprends ?', 'text', '2021-03-07 11:29:17'),
(23, 1, 33, 'Oui ! C\'est génial haha', 'text', '2021-03-07 11:29:35'),
(24, 1, 31, 'Super alors, essaye de l\'utiliser', 'text', '2021-03-07 11:31:37'),
(25, 1, 33, 'Ouais t\'inquète pas', 'text', '2021-03-07 16:08:26'),
(33, 1, 33, 'Hahaha j\'adore', 'text', '2021-03-11 08:34:52'),
(32, 1, 31, 'http://localhost:3001/Images/1615451589336-bezkoder-blob', 'image', '2021-03-11 08:33:09'),
(34, 1, 33, 'http://localhost:3001/Images/1615451709020-bezkoder-blob', 'image', '2021-03-11 08:35:09'),
(35, 12, 33, 'Salut ?', 'text', '2021-03-12 16:56:23'),
(36, 1, 33, 'https://giphy.com/embed/BUtUpRZQhHuU0', 'gif', '2021-03-13 10:50:41'),
(37, 1, 33, 'https://giphy.com/embed/3jcgPn9fzfaXc1EHJC', 'gif', '2021-03-13 10:53:34'),
(38, 1, 31, 'hahahahahhahah', 'text', '2021-03-13 10:54:14'),
(39, 1, 31, 'https://giphy.com/embed/3oriO6a2KKLMej1GyQ', 'gif', '2021-03-13 10:54:35'),
(40, 1, 33, 'https://giphy.com/embed/UuebWyG4pts3rboawU', 'gif', '2021-03-15 08:40:21'),
(41, 1, 33, 'https://giphy.com/embed/UuebWyG4pts3rboawU', 'gif', '2021-03-15 08:51:26'),
(42, 1, 33, 'test', 'text', '2021-03-30 11:53:00'),
(43, 1, 33, 'test', 'text', '2021-03-30 11:53:03'),
(44, 1, 33, 'https://giphy.com/embed/3o6ZsZKbgw4QVWEbzq', 'gif', '2021-03-31 09:50:22'),
(45, 14, 35, 'Bonjour, comment allez-vous ?\n', 'text', '2021-04-01 09:08:17'),
(46, 14, 33, 'Bien et vous ?', 'text', '2021-04-01 09:08:27'),
(47, 14, 35, 'Bonjour, comment allez-vous ?\n', 'text', '2021-04-01 09:08:57'),
(48, 14, 33, 'Ben j\'ai dis que ça allait', 'text', '2021-04-01 09:30:27'),
(49, 14, 35, 'ok', 'text', '2021-04-01 09:30:51'),
(50, 14, 35, 'ok', 'text', '2021-04-01 09:31:41'),
(51, 14, 33, 'Ben j\'ai dis que ça allait', 'text', '2021-04-01 09:31:42'),
(52, 14, 35, 'Tout ce double, il va falloir vérifier ça après', 'text', '2021-04-01 16:21:52'),
(53, 14, 33, 'okey... t bizarre toi', 'text', '2021-04-01 16:22:11'),
(54, 14, 35, 'Tout ce double, il va falloir vérifier ça après', 'text', '2021-04-01 16:24:59'),
(55, 14, 33, 'okey... t bizarre toi', 'text', '2021-04-01 16:24:59'),
(56, 1, 33, 'loooooool', 'text', '2021-04-10 17:48:50'),
(57, 1, 33, 'loooooool', 'text', '2021-04-10 17:49:25'),
(58, 1, 33, 'Oh t la', 'text', '2021-04-10 17:53:17'),
(59, 1, 33, 'oooo', 'text', '2021-04-10 17:53:45'),
(60, 1, 33, 'oooo', 'text', '2021-04-10 17:56:08'),
(61, 1, 33, 'je fais des tests', 'text', '2021-04-10 17:56:49'),
(62, 1, 33, 'je fais des tests', 'text', '2021-04-10 17:57:21'),
(63, 1, 33, 'testtt', 'text', '2021-04-10 17:57:32'),
(64, 1, 33, 'testtt', 'text', '2021-04-10 17:57:54'),
(65, 14, 35, 'je fais des tests', 'text', '2021-04-10 17:59:04'),
(66, 14, 35, 'testt', 'text', '2021-04-10 18:02:09'),
(67, 14, 35, 'lol', 'text', '2021-04-10 18:02:19'),
(68, 14, 35, 'testeuh', 'text', '2021-04-10 18:03:57'),
(69, 14, 35, 'test', 'text', '2021-04-10 18:05:12'),
(70, 14, 35, 'testtt', 'text', '2021-04-10 18:12:41'),
(71, 14, 35, 'testtt', 'text', '2021-04-10 18:14:12'),
(72, 14, 35, 'encore test', 'text', '2021-04-10 18:18:01'),
(73, 14, 35, 'test', 'text', '2021-04-10 18:18:50'),
(74, 14, 35, 'testtt', 'text', '2021-04-10 18:28:03'),
(75, 14, 35, 'testtttt', 'text', '2021-04-10 18:31:16'),
(76, 14, 35, 'retest', 'text', '2021-04-10 18:31:23'),
(77, 14, 35, 'peut-être le dernier test ?', 'text', '2021-04-10 18:31:59'),
(78, 14, 35, 'ooo', 'text', '2021-04-10 18:33:02'),
(79, 14, 35, 'd', 'text', '2021-04-10 18:33:30'),
(80, 14, 35, 'fsq', 'text', '2021-04-10 18:34:32'),
(81, 14, 35, 'fff', 'text', '2021-04-10 18:35:13'),
(82, 14, 35, 'test ?', 'text', '2021-04-10 18:35:18'),
(83, 14, 35, 'svp', 'text', '2021-04-10 18:36:21'),
(84, 14, 35, 'lol', 'text', '2021-04-10 18:37:24'),
(85, 14, 35, 'd', 'text', '2021-04-10 18:38:11'),
(86, 14, 35, 'yo je refais des tests', 'text', '2021-04-12 08:56:25'),
(87, 1, 31, 'http://localhost:3001/Images/1618560759791-bezkoder-blob', 'image', '2021-04-16 08:12:39'),
(88, 1, 33, 'nice', 'text', '2021-04-16 08:13:02'),
(89, 1, 31, 'salut', 'text', '2021-04-16 10:44:30'),
(90, 1, 33, 'ça va ?', 'text', '2021-04-17 08:49:09'),
(91, 1, 31, 'bien et toi', 'text', '2021-04-17 09:09:54'),
(92, 1, 31, 'bien et toi', 'text', '2021-04-17 09:11:24'),
(93, 1, 31, 'f', 'text', '2021-04-17 15:30:55'),
(94, 1, 31, 'f', 'text', '2021-04-17 15:32:01'),
(95, 14, 35, 'Salut ça va ?', 'text', '2021-04-18 14:26:43'),
(96, 14, 33, 'et toi ?', 'text', '2021-04-18 14:26:55'),
(97, 1, 33, 'https://giphy.com/embed/3jcgPn9fzfaXc1EHJC', 'gif', '2021-04-18 14:34:34'),
(98, 1, 31, 'https://giphy.com/embed/cLcxtL1z8t8oo', 'gif', '2021-05-03 07:42:47'),
(99, 1, 33, 'https://giphy.com/embed/2C2qwckZzyiz8UzvzK', 'gif', '2021-05-03 07:42:54'),
(100, 1, 31, 'mdr', 'text', '2021-05-03 07:43:08'),
(101, 14, 35, 'bien bien', 'text', '2021-05-03 07:49:51'),
(102, 16, 33, 'Salut', 'text', '2021-05-03 08:02:42'),
(103, 12, 33, 'Oh !', 'text', '2021-05-03 09:15:41'),
(104, 1, 33, 'je fais un test', 'text', '2021-05-03 09:30:32'),
(105, 1, 33, '', 'text', '2021-05-03 09:30:34'),
(106, 1, 33, 'testttt', 'text', '2021-05-03 09:33:16'),
(107, 1, 33, 'https://giphy.com/embed/O6Aubv7sJW7bgwBwia', 'gif', '2021-05-04 13:39:07'),
(108, 14, 35, 'oh cogne', 'text', '2021-05-04 13:39:42'),
(109, 14, 33, 'test', 'text', '2021-05-05 07:33:14'),
(110, 14, 35, 'test aussi', 'text', '2021-05-05 07:34:39'),
(111, 14, 33, 'testttt', 'text', '2021-05-05 07:34:44'),
(112, 14, 33, 'encore test', 'text', '2021-05-05 07:36:05'),
(113, 14, 35, 'moi aussi test', 'text', '2021-05-05 07:36:18'),
(120, 14, 35, 'yo', 'text', '2021-05-13 07:45:52'),
(121, 68, 45, 'Salut', 'text', '2021-05-13 07:45:59'),
(122, 68, 33, 'Ca va ?', 'text', '2021-05-13 07:46:07'),
(123, 68, 45, 'https://giphy.com/embed/B2vBunhgt9Pc4', 'gif', '2021-05-13 07:46:12'),
(124, 14, 35, 'yo', 'text', '2021-05-13 08:04:46'),
(125, 69, 47, 'Salut ça va ?', 'text', '2021-05-18 16:05:29'),
(126, 69, 48, 'Salut, super et toi . :)', 'text', '2021-05-18 16:05:48'),
(127, 69, 48, '?', 'text', '2021-05-18 16:05:55'),
(128, 70, 49, 'yooo', 'text', '2021-05-18 17:34:05'),
(129, 70, 49, 'ça va ?', 'text', '2021-05-18 17:34:13');

-- --------------------------------------------------------

--
-- Structure de la table `userimages`
--

DROP TABLE IF EXISTS `userimages`;
CREATE TABLE IF NOT EXISTS `userimages` (
  `imgId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `url` text NOT NULL,
  `type` varchar(50) NOT NULL,
  PRIMARY KEY (`imgId`)
) ENGINE=MyISAM AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `userimages`
--

INSERT INTO `userimages` (`imgId`, `userId`, `url`, `type`) VALUES
(1, 31, 'http://localhost:3001/Images/1612715144087-bezkoder-69508153_1052548391803110_8384269601994702848_o.jpg', 'banner'),
(2, 29, 'http://localhost:3001/Images/1612715144087-bezkoder-69508153_1052548391803110_8384269601994702848_o.jpg', 'banner'),
(3, 32, 'http://localhost:3001/Images/1613582243150-bezkoder-profil_publication2.jpg', 'banner'),
(4, 33, 'http://localhost:3001/Images/1613582395171-bezkoder-f528b8aba5444331781f6746174c963a.jpg', 'banner'),
(5, 34, 'http://localhost:3001/Images/banner_default.jpg', 'banner'),
(6, 29, 'http://localhost:3001/Images/1612715380474-bezkoder-profil.jpg', 'profile'),
(7, 31, 'http://localhost:3001/Images/1612715144061-bezkoder-101960072_1295406590850621_5428564065477755011_n.jpg', 'profile'),
(8, 32, 'http://localhost:3001/Images/1613582243130-bezkoder-Macaca_nigra_self-portrait_large-e1524567086123-1100x715.jpg', 'profile'),
(9, 33, 'http://localhost:3001/Images/1617104311217-bezkoder-blob', 'profile'),
(10, 34, 'http://localhost:3001/Images/1615023606480-bezkoder-blob', 'profile'),
(11, 35, 'http://localhost:3001/Images/1615829277631-bezkoder-blob', 'profile'),
(12, 35, 'http://localhost:3001/Images/banner_default.jpg', 'banner'),
(13, 36, 'http://localhost:3001/Images/1615830241265-bezkoder-blob', 'profile'),
(14, 36, 'http://localhost:3001/Images/banner_default.jpg', 'banner'),
(15, 37, 'http://localhost:3001/Images/1615830162603-bezkoder-blob', 'profile'),
(16, 37, 'http://localhost:3001/Images/banner_default.jpg', 'banner'),
(17, 38, 'http://localhost:3001/Images/1615828697965-bezkoder-blob', 'profile'),
(18, 38, 'http://localhost:3001/Images/1615828697959-bezkoder-blob', 'banner'),
(19, 39, 'http://localhost:3001/Images/1615830382941-bezkoder-blob', 'profile'),
(20, 39, 'http://localhost:3001/Images/1615830382893-bezkoder-blob', 'banner'),
(21, 40, 'http://localhost:3001/Images/profile_default.jpg', 'profile'),
(22, 40, 'http://localhost:3001/Images/banner_default.jpg', 'banner'),
(23, 41, 'http://localhost:3001/Images/1615830909041-bezkoder-blob', 'profile'),
(24, 41, 'http://localhost:3001/Images/banner_default.jpg', 'banner'),
(25, 42, 'http://localhost:3001/Images/1615831926924-bezkoder-blob', 'profile'),
(26, 42, 'http://localhost:3001/Images/1615831926968-bezkoder-blob', 'banner'),
(27, 43, 'http://localhost:3001/Images/profile_default.jpg', 'profile'),
(28, 43, 'http://localhost:3001/Images/banner_default.jpg', 'banner'),
(29, 44, 'http://localhost:3001/Images/profile_default.jpg', 'profile'),
(30, 44, 'http://localhost:3001/Images/banner_default.jpg', 'banner'),
(31, 45, 'http://localhost:3001/Images/1620894418022-bezkoder-blob', 'profile'),
(32, 45, 'http://localhost:3001/Images/banner_default.jpg', 'banner'),
(33, 46, 'http://localhost:3001/Images/1620736625082-bezkoder-blob', 'profile'),
(34, 46, 'http://localhost:3001/Images/banner_default.jpg', 'banner'),
(35, 47, 'http://localhost:3001/Images/1621353330593-bezkoder-blob', 'profile'),
(36, 47, 'http://localhost:3001/Images/1621353331159-bezkoder-blob', 'banner'),
(37, 48, 'http://localhost:3001/Images/1621353350200-bezkoder-blob', 'profile'),
(38, 48, 'http://localhost:3001/Images/banner_default.jpg', 'banner'),
(39, 49, 'http://localhost:3001/Images/profile_default.jpg', 'profile'),
(40, 49, 'http://localhost:3001/Images/banner_default.jpg', 'banner');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `lastName` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `bio` text,
  PRIMARY KEY (`userId`)
) ENGINE=MyISAM AUTO_INCREMENT=50 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`userId`, `lastName`, `firstName`, `email`, `password`, `bio`) VALUES
(31, 'Monsieur', 'Kévin', 'kevin@gmail.com', '$2a$10$9J5/5K815gLVl0nbNs07KOTiMIKhhepyKTrq6HM2/19y3pfy0JUWS', 'Yo !'),
(32, 'Pont', 'Hugo', 'jsp@gmail.com', '$2a$10$9LJoPgDA6bB53nNRkXanROteHYQ5o/DbJF9jI1QMddALGWJtOxB/m', 'Salut'),
(33, 'Noël', 'Pierre', 'bonjour@gmail.com', '$2a$10$zGrWbjp6SKFDArd.43cl8uEq58ye9MBjFp8FFPNFHT4Qc6fjeiaTm', 'YO LES GENS'),
(29, 'Le Roi', 'Mathieu', 'mathieu@gmail.com', '$2a$10$OwWGf57OhKCHtEUm5jM5k.ll0P6m8NAQ9CSl7UlR.W3fxU.P41fEy', 'Je suis qu\'un fucking test'),
(34, 'Noêl', 'Louis', 'test@gmail.com', '$2a$10$96.adfUIME1qTbDmYY7fnOJsa0YVrkfSnDNlL1EO0WaNjMFPae5KS', 'pizzaaa (en vrai c\'est bof)'),
(35, 'Martin', 'Gabriel', 'test1@gmail.com', '$2a$10$9ynk2EGJrgo48uzwDDRAe.K/1kQJ2FdTEm3uiJYwsWaD5qHA9lbWm', 'La vie d\'un oeuf'),
(36, 'Legrand', 'Emma', 'test2@gmail.com', '$2a$10$MD/1n33WiyaJZET.2oPKk.0vJSbWiAIdeq2a//uI9uyAYJNBiOwl6', NULL),
(37, 'Marchand', 'Léo', 'test3@gmail.com', '$2a$10$g3AjR.PfTVC4.lfdhYtqVOo/6ldV27OGT13NcicuqV3UmzdOP3Uo6', 'I have a dream'),
(38, 'Robin', 'Jade', 'test4@gmail.com', '$2a$10$AzzgUqQIPFSYybJqQwyBzOmMKr8cmmQLpuJY16gpNqDrbktyrPJEu', NULL),
(39, 'Brun', 'Adam', 'test5@gmail.com', '$2a$10$5wWgQzGzJymIZQWwhzpPr./nK.LLspdGvoQgoJw.k5aRk2N1Atk8a', 'Je suis un philisophe'),
(40, 'Dupuis', 'Mia', 'test6@gmail.com', '$2a$10$Qu1WqoKueCfHlKdW5.J1C.Y7h8oLozvljVGiWkabxaV/9EPMHxEH6', NULL),
(41, 'Broyer', 'Anna', 'test7@gmail.com', '$2a$10$0MDPcdkwI1Wn.5K7B4NeuugIwDFks5gudcPsm32iV2ncu1Jz96Rv6', NULL),
(42, 'Fontaine', 'Ethan', 'test8@gmail.com', '$2a$10$9JVizQAs2VpLJ3/pUpdT0ePmuwNWzXsi1h676AfxCnOWlEWN14myy', NULL),
(43, 'Picard', 'Paul', 'test9@gmail.com', '$2a$10$a3/9.TaoxsdkQix2VfENoOipLXrTI6JAcmqiveu4rVDnytPIQNuNy', NULL),
(44, 'Vignac', 'Louis', 'test10@gmail.com', '$2a$10$OquedFZGhcbUPTEyFsTuvu1o7Q8Ewg7drSQHq6smrev/B1TSBqFuO', NULL),
(45, 'Marchand', 'Matthias', 'test11@gmail.com', '$2a$10$Wdc40msNd9FhbJxjczm2a.2o.T4WKoVNn1.1s0HcRNFpKUuC1p3oq', NULL),
(46, 'Ndongo', 'Bastien', 'neitgame121@gmail.com', '$2a$10$8TZS34wsKM3DVhjOi8wGAuw.fesNJHWRtuA/BzMPKPZRKzZhUVj3y', NULL),
(47, 'Pirote', 'Jade', 'jade@gmail.com', '$2a$10$NwULiQ/x80yYAWElz9p0iOtHT4LM0j6HoB8k2ZE5vG7jHyvE.ESMu', 'C\'est l\'heure du dududuDUEL'),
(48, 'Benhiaya', 'Apolline', 'Apoline@gmail.com', '$2a$10$ZM8YisKT4TZ5N6vKykRoKORfVXwvmNiiPr.HFlL7E2m1IYIHrmu8K', NULL),
(49, 'Diert', 'Manon', 'manon@gmail.com', '$2a$10$YMahs3GX1xoSKTgKO.oCket0tVeAnXf6kNIbdWj1g1txWnrf45Lcy', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
