-- MySQL dump 10.13  Distrib 8.0.24, for Win64 (x86_64)
--
-- Host: localhost    Database: ask
-- ------------------------------------------------------
-- Server version	8.0.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `author_id` int NOT NULL,
  `question_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `answers_author_id_users_id_foreign` (`author_id`),
  KEY `answers_question_id_questions_id_foreign` (`question_id`),
  CONSTRAINT `answers_author_id_users_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `answers_question_id_questions_id_foreign` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
INSERT INTO `answers` VALUES (7,'Prvi komentar',15,63,'2021-04-30 01:49:33','2021-04-30 02:25:10'),(8,'Drugi komentar',15,63,'2021-04-30 02:01:56','2021-04-30 02:28:06'),(9,'dsadasd',16,65,'2021-04-30 12:16:26','2021-04-30 12:16:26'),(10,'Testni kom',17,66,'2021-04-30 15:21:13','2021-04-30 15:21:13'),(11,'Tesstttt editovan',17,67,'2021-04-30 15:21:27','2021-04-30 15:21:34'),(12,'Odgovor',18,63,'2021-04-30 15:37:55','2021-04-30 15:37:55'),(13,'dfsfaf',18,81,'2021-04-30 15:52:12','2021-04-30 15:52:12'),(14,'rwerwrewr',18,81,'2021-04-30 15:52:24','2021-04-30 15:52:24');
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `question_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (10,16,64,'2021-04-30 13:11:40','2021-04-30 13:11:40'),(11,16,66,'2021-04-30 13:13:03','2021-04-30 13:13:03'),(12,16,63,'2021-04-30 13:22:27','2021-04-30 13:22:27'),(13,16,65,'2021-04-30 13:31:08','2021-04-30 13:31:08'),(14,15,64,'2021-04-30 13:44:10','2021-04-30 13:44:10'),(15,17,66,'2021-04-30 15:21:07','2021-04-30 15:21:07'),(16,18,68,'2021-04-30 15:37:42','2021-04-30 15:37:42'),(17,18,82,'2021-04-30 15:52:06','2021-04-30 15:52:06'),(18,18,78,'2021-04-30 15:52:08','2021-04-30 15:52:08');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `author_id` int NOT NULL,
  `no_of_like` int NOT NULL DEFAULT '0',
  `no_of_dislike` int NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `questions_author_id_users_id_foreign` (`author_id`),
  CONSTRAINT `questions_author_id_users_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (62,'Test1',15,0,0,'2021-04-29 22:56:29'),(63,'Test2',15,0,0,'2021-04-29 22:57:12'),(64,'Test3',15,0,0,'2021-04-30 02:14:55'),(65,'Test123',16,0,0,'2021-04-30 12:16:21'),(66,'Test321',16,0,0,'2021-04-30 12:45:02'),(67,'Moje pitanje',17,0,0,'2021-04-30 15:21:19'),(68,'dkaspokdas',18,0,0,'2021-04-30 15:37:27'),(69,'1',18,0,0,'2021-04-30 15:51:22'),(70,'2',18,0,0,'2021-04-30 15:51:24'),(71,'3',18,0,0,'2021-04-30 15:51:27'),(72,'4',18,0,0,'2021-04-30 15:51:29'),(73,'5',18,0,0,'2021-04-30 15:51:32'),(74,'6',18,0,0,'2021-04-30 15:51:34'),(75,'7',18,0,0,'2021-04-30 15:51:36'),(76,'8',18,0,0,'2021-04-30 15:51:39'),(77,'9',18,0,0,'2021-04-30 15:51:43'),(78,'10',18,0,0,'2021-04-30 15:51:46'),(79,'11',18,0,0,'2021-04-30 15:51:49'),(80,'12',18,0,0,'2021-04-30 15:51:52'),(81,'13',18,0,0,'2021-04-30 15:51:54'),(82,'14',18,0,0,'2021-04-30 15:51:57');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `sur_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (15,'Test','Test','test@test.com','$2a$10$sMf4MOEktMG5F1hpAmnPz.22j4J2V6nMb/tGCrnZcsPhfD3J7WvTm','2021-04-29 22:56:16','2021-04-29 22:56:16'),(16,'Test2','Tesst2','test2@test2','$2a$10$b8bNCQky3IxGipOrMtHNn.rU5Gc.dBG1wL2D4inFetaY9lZ7b0iwW','2021-04-30 12:14:59','2021-04-30 12:14:59'),(17,'Alija','Sijamija','alija@gmail.com','$2a$10$Rq3nut6QYjaaxzvLOF55OezmaZMlh2DZAXEssI3zfo2CpYl//9JRW','2021-04-30 15:20:59','2021-04-30 15:20:59'),(18,'Novi','novije','novi@novi','$2a$10$2wdep/YMOCANh65dZ83DCujn0wBKZ2z3L8c5YMJyVaBZwc1vAaWv2','2021-04-30 15:23:26','2021-04-30 15:23:26');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'ask'
--

--
-- Dumping routines for database 'ask'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-30 17:19:01
