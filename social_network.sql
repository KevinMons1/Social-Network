-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3308
-- Généré le : Dim 20 juin 2021 à 13:02
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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `friends`
--

INSERT INTO `friends` (`friendId`, `user1Id`, `user2Id`) VALUES
(1, 1, 2),
(2, 1, 5);

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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `likes`
--

INSERT INTO `likes` (`likeId`, `publicationId`, `userId`) VALUES
(1, 25, 1),
(2, 29, 4);

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
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`notificationId`, `senderId`, `receiverId`, `type`, `view`, `date`) VALUES
(2, 4, 1, 'like', 1, '2021-06-19 07:49:58');

-- --------------------------------------------------------

--
-- Structure de la table `privaterooms`
--

DROP TABLE IF EXISTS `privaterooms`;
CREATE TABLE IF NOT EXISTS `privaterooms` (
  `roomId` int(11) NOT NULL AUTO_INCREMENT,
  `friendId` int(11) NOT NULL,
  PRIMARY KEY (`roomId`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `privaterooms`
--

INSERT INTO `privaterooms` (`roomId`, `friendId`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Structure de la table `publicationcontent`
--

DROP TABLE IF EXISTS `publicationcontent`;
CREATE TABLE IF NOT EXISTS `publicationcontent` (
  `publicationContentId` int(11) NOT NULL AUTO_INCREMENT,
  `publicationId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `cloudinaryPublicId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `text` text CHARACTER SET latin1,
  `type` varchar(50) CHARACTER SET latin1 NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`publicationContentId`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `publicationcontent`
--

INSERT INTO `publicationcontent` (`publicationContentId`, `publicationId`, `userId`, `cloudinaryPublicId`, `text`, `type`, `date`) VALUES
(1, 2, NULL, 'publications/videos/lebaf1e7gmynvkjieeaj', 'http://res.cloudinary.com/ho3vjbvoi/raw/upload/v1623595819/publications/videos/lebaf1e7gmynvkjieeaj', 'video', '2021-06-13 14:50:19'),
(2, 3, NULL, 'publications/images/dodxg5jmpiav3qqchisf', 'http://res.cloudinary.com/ho3vjbvoi/image/upload/v1623595952/publications/images/dodxg5jmpiav3qqchisf.jpg', 'image', '2021-06-13 14:52:32'),
(7, 8, 1, NULL, 'commentaires test', 'comment', '2021-06-13 15:04:30'),
(16, 21, NULL, 'publications/images/xcpikclxajibraf3p9at', 'http://res.cloudinary.com/ho3vjbvoi/image/upload/v1623742728/publications/images/xcpikclxajibraf3p9at.png', 'image', '2021-06-15 07:38:49'),
(6, 7, NULL, 'publications/videos/k1mnozzoxta03stbabp0', 'http://res.cloudinary.com/ho3vjbvoi/raw/upload/v1623596587/publications/videos/k1mnozzoxta03stbabp0', 'video', '2021-06-13 15:03:08'),
(17, 26, NULL, 'publications/images/sjg6dejtms9dlbn7sg3c', 'http://res.cloudinary.com/ho3vjbvoi/image/upload/v1623748392/publications/images/sjg6dejtms9dlbn7sg3c.png', 'image', '2021-06-15 09:13:13'),
(18, 28, NULL, 'publications/images/pdyk73mxak3e7g5wv0co', 'http://res.cloudinary.com/ho3vjbvoi/image/upload/v1624016807/publications/images/pdyk73mxak3e7g5wv0co.jpg', 'image', '2021-06-18 11:46:47'),
(21, 38, NULL, 'publications/images/qtyjjriwdilxugermdn0', 'http://res.cloudinary.com/ho3vjbvoi/image/upload/v1624177281/publications/images/qtyjjriwdilxugermdn0.jpg', 'image', '2021-06-20 08:21:21');

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
) ENGINE=MyISAM AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `publications`
--

INSERT INTO `publications` (`publicationId`, `userId`, `text`, `hashtag`, `commentsTotal`, `date`) VALUES
(8, 1, 'test', '', 1, '2021-06-13 15:04:18'),
(7, 1, 'dddd', '', 0, '2021-06-13 15:02:53'),
(9, 1, 'test1', '', 0, '2021-06-13 15:05:30'),
(10, 1, 'test2', '', 0, '2021-06-13 15:05:33'),
(11, 1, 'test3', '', 0, '2021-06-13 15:05:36'),
(12, 1, 'test4', '', 0, '2021-06-13 15:05:39'),
(21, 1, 'test ', '', 0, '2021-06-15 07:38:46'),
(22, 1, 'testtttt', '', 0, '2021-06-15 07:39:03'),
(23, 1, 'gggg', '', 0, '2021-06-15 07:39:05'),
(24, 1, 'fffffff', '', 0, '2021-06-15 07:39:06'),
(25, 1, 'https://www.youtube.com/watch?v=EYKyhCkvsTI', '', 0, '2021-06-15 07:51:53'),
(26, 1, 'fff', '', 0, '2021-06-15 09:13:11'),
(27, 1, 'Ma radio préféré https://www.youtube.com/watch?v=YSBO7Zl8mU4 ouaisssss', '', 0, '2021-06-17 14:43:56'),
(28, 1, 'test panda', '', 0, '2021-06-18 11:46:45'),
(29, 1, 'https://jsfiddle.net/Forth/5zn2oc94/38/', '', 0, '2021-06-18 18:47:51'),
(32, 1, 'https://www.youtube.com/watch?v=gnyW6uaUgk4 testt test', '', 0, '2021-06-19 08:42:07'),
(33, 1, 'test https://www.youtube.com/watch?v=gnyW6uaUgk4', '', 0, '2021-06-19 08:42:21'),
(38, 1, 'test', 'salut;jesuisunlonghashtagquandmême', 0, '2021-06-20 08:21:20');

-- --------------------------------------------------------

--
-- Structure de la table `roommessages`
--

DROP TABLE IF EXISTS `roommessages`;
CREATE TABLE IF NOT EXISTS `roommessages` (
  `msgId` int(11) NOT NULL AUTO_INCREMENT,
  `roomId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `cloudinaryPublicId` varchar(255) DEFAULT NULL,
  `text` text NOT NULL,
  `type` varchar(50) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`msgId`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `roommessages`
--

INSERT INTO `roommessages` (`msgId`, `roomId`, `userId`, `cloudinaryPublicId`, `text`, `type`, `date`) VALUES
(1, 1, 1, NULL, 'test', 'text', '2021-06-19 07:46:27'),
(2, 2, 5, NULL, 'yo', 'text', '2021-06-20 08:12:59'),
(3, 2, 5, NULL, 'ça va ?', 'text', '2021-06-20 08:18:07'),
(4, 2, 1, NULL, 'bein-sûr', 'text', '2021-06-20 08:18:12');

-- --------------------------------------------------------

--
-- Structure de la table `userimages`
--

DROP TABLE IF EXISTS `userimages`;
CREATE TABLE IF NOT EXISTS `userimages` (
  `imgId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `cloudinaryPublicId` varchar(255) DEFAULT NULL,
  `url` text NOT NULL,
  `type` varchar(50) NOT NULL,
  PRIMARY KEY (`imgId`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `userimages`
--

INSERT INTO `userimages` (`imgId`, `userId`, `cloudinaryPublicId`, `url`, `type`) VALUES
(1, 1, NULL, 'https://lh3.googleusercontent.com/a-/AOh14GiEeVOVjwVjsfcLqvS6km1Jno-DS0gZNG9ZGR1W=s96-c', 'profile'),
(2, 1, NULL, 'http://localhost:8080/Images/banner_default.jpg', 'banner'),
(3, 2, NULL, 'https://lh3.googleusercontent.com/a-/AOh14GiuDmLQjQsmsSN4wg-KS0XOMPaTc48fE_osfB_nDA=s96-c', 'profile'),
(4, 2, NULL, 'http://localhost:8080/Images/banner_default.jpg', 'banner'),
(5, 3, NULL, 'https://lh3.googleusercontent.com/a/AATXAJwdt1J1npZ74TC-w6pn_tKvOW4sk8glZaEotcE=s96-c', 'profile'),
(6, 3, NULL, 'http://localhost:8080/Images/banner_default.jpg', 'banner'),
(7, 4, NULL, 'http://localhost:8080/Images/profile_default.jpg', 'profile'),
(8, 4, NULL, 'http://localhost:8080/Images/banner_default.jpg', 'banner'),
(9, 5, NULL, 'http://localhost:8080/Images/profile_default.jpg', 'profile'),
(10, 5, NULL, 'http://localhost:8080/Images/banner_default.jpg', 'banner');

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
  `password` text,
  `bio` text,
  PRIMARY KEY (`userId`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`userId`, `lastName`, `firstName`, `email`, `password`, `bio`) VALUES
(1, 'Monsieur', 'Kévin', '15307@site.asty-moulin.be', NULL, 'test'),
(2, '', 'C_R', 'kevin.rubys.2001@gmail.com', NULL, NULL),
(3, 'Test', 'Kévin', 'kevin.developer.test@gmail.com', NULL, NULL),
(4, 'Louis', 'Mathieu', 'mathieu@gmail.com', '$2a$10$7lJdLkrBSSYcYsap1ZIJ7egC/XfTZWbF10LmvVFbowVfY8ugu4Jqm', NULL),
(5, 'Pierre', 'Mathieu', 'test@gmail.com', '$2a$10$MbfkgdxlxgZvzgYDNevC1uw5x0kg61t1r5QxPbjtUPXXv0PM4dcvm', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
