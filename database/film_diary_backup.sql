-- MariaDB dump 10.19-11.3.2-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: film_diary_db
-- ------------------------------------------------------
-- Server version	11.3.2-MariaDB-1:11.3.2+maria~ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `pelicula`
--

DROP TABLE IF EXISTS `pelicula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pelicula` (
  `id_pelicula` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_tmdb` bigint(20) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `release_date` date DEFAULT NULL,
  `poster_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id_pelicula`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pelicula`
--

LOCK TABLES `pelicula` WRITE;
/*!40000 ALTER TABLE `pelicula` DISABLE KEYS */;
INSERT INTO `pelicula` VALUES
(1,550,'El Club de la Lucha','1999-10-15','https://image.tmdb.org/t/p/w500/sgTAWJFaB2kBvdQxRGabYFiQqEK.jpg'),
(2,25,'Jarhead, el infierno espera','2005-11-04','https://image.tmdb.org/t/p/w500/5V5DMgwjJ5x40xbL4zbP3t9ex1H.jpg'),
(3,605,'Matrix Revolutions','2003-11-05','https://image.tmdb.org/t/p/w500/zi1UMF9jIM2JnQz0u2AyUw8QFZi.jpg'),
(4,7555,'John Rambo','2008-01-24','https://image.tmdb.org/t/p/w500/qp9Q0JeHQ6JShQPm6KA8euYhWLF.jpg'),
(5,1369,'Rambo: Acorralado Parte II','1985-05-21','https://image.tmdb.org/t/p/w500/TuW7rwhdVPrm3qBsBGnn747Uar.jpg'),
(6,1370,'Rambo III','1988-05-24','https://image.tmdb.org/t/p/w500/69iGRVnOi62ZK2ExoJl12tnvH0T.jpg'),
(7,1368,'Acorralado','1982-10-22','https://image.tmdb.org/t/p/w500/sYHRcd9p3rV3t3w8MHGaA7wdIBl.jpg'),
(8,522938,'Rambo: Last Blood','2019-09-19','https://image.tmdb.org/t/p/w500/7T9entQhNCs8UerNjoNWE3LQjHU.jpg'),
(9,3170,'Bambi','1942-08-14','https://image.tmdb.org/t/p/w500/q9LI5Uloz1WRqaJjr8Tq2aOeSeH.jpg'),
(10,22,'Piratas del Caribe: La maldición de la Perla Negra','2003-07-09','https://image.tmdb.org/t/p/w500/8zHnkTGyAImBcI49a1xFJHUjbaK.jpg'),
(11,15,'Ciudadano Kane','1941-04-17','https://image.tmdb.org/t/p/w500/w7V0bv38Z0q0DgHmMfcGM4WRNTv.jpg'),
(12,348,'Alien, el octavo pasajero','1979-05-25','https://image.tmdb.org/t/p/w500/pZ9cAe5FxexJjpCaeiETbXzz3Fs.jpg'),
(13,27,'Nueve canciones','2004-07-16','https://image.tmdb.org/t/p/w500/7Bkt2Z989GasK0YKykIMyLPYOGz.jpg'),
(14,243,'Alta fidelidad','2000-03-17','https://image.tmdb.org/t/p/w500/f552Ndo0SLbNdJvs5x2bS1mmyvm.jpg'),
(15,680,'Pulp Fiction','1994-09-10','/hNcQAuquJxTxl2fJFs1R42DrWcf.jpg'),
(16,268,'Batman','1989-06-21','/fpY5cNPIbKYpdBtukCMtBMMt1s3.jpg'),
(17,155,'El caballero oscuro','2008-07-16','/8QDQExnfNFOtabLDKqfDQuHDsIg.jpg'),
(18,58,'Piratas del Caribe: El cofre del hombre muerto','2006-07-06','/7L7H6sHAt48EfwsqFaa0dw2NJhz.jpg'),
(19,13,'Forrest Gump','1994-06-23','/oiqKEhEfxl9knzWXvWecJKN3aj6.jpg'),
(20,10020,'La bella y la bestia','1991-10-22','/1FxMtEUc6DP1MXsTBftOFaoCVVO.jpg'),
(21,23483,'Kick-Ass: Listo para machacar','2010-03-26','/dyYP52hnVzioCxLSheogZBX0vXv.jpg'),
(22,10344,'La mosca 2','1989-02-10','/mGrE2MNOjEQvHVqZSXUzdUboKcc.jpg'),
(23,10734,'Fuga de Alcatraz','1979-06-22','/3UWuFh0zYNnFGSoQY8DGplSjiW8.jpg'),
(24,274,'El silencio de los corderos','1991-02-14','/8FdQQ3cUCs9goEOr1qUFaHackoJ.jpg'),
(25,117,'Los intocables de Eliot Ness','1987-06-03','/pVcWaUbFDL76ObIsReIBQ5ILMHv.jpg'),
(26,679,'Aliens: El regreso','1986-07-18','/3QU9EP8BFLnTh6w9ycDSCvhqbRU.jpg'),
(27,9740,'Hannibal','2001-02-08','/v5wAZwRqpGWmyAaaJ8BBHYuNXnj.jpg'),
(28,274870,'Passengers','2016-12-21','/iLMtX4MGl8WjKCPfMgCdDuceOth.jpg'),
(29,567,'La ventana indiscreta','1954-08-01','/fH1MipE8PXGg0rlI5cUdzxKnyA2.jpg'),
(30,1813,'Pactar con el diablo','1997-10-17','/rOXciqRgEXqRvvYS6Dk2im3NF7H.jpg'),
(31,602,'Independence Day','1996-06-25','/6WJVfMFeLQJ8LuoduATLiM57v1d.jpg'),
(32,8077,'Alien³','1992-05-22','/mj4lGdK8dyivFDKoRXEUmkaUKKf.jpg'),
(33,8078,'Alien: Resurrección','1997-11-12','/6MLQ5ehGD3b8E0JZ9K2G4cZeFaI.jpg'),
(34,87516,'Oldboy','2013-11-14','/iX93YdBrZA1EpGbphmjf4ARj1Za.jpg'),
(35,218,'Terminator','1984-10-26','/9KI49SBnwAOzGcMw1onIki7vd2.jpg'),
(36,924,'Amanecer de los muertos','2004-03-19','/6aue0EtBfftVryNP11acJqOZu2h.jpg'),
(37,764,'Posesión infernal','1981-09-10','/vgQDogdqPrSk2zRdy2JESq2LGvy.jpg'),
(38,372197,'Swallowed Souls: The Making of Evil Dead 2','2011-11-15','/eoSrt9yaQ5ha1yBJqhtpc4rY58o.jpg'),
(39,766,'El ejército de las tinieblas','1992-10-31','/aWko0iXOEbqvWZa8NVKrUbBMJYy.jpg'),
(40,807,'Seven','1995-09-22','/uVPcVz4b2hnSGrXYLdIGRXwcivs.jpg'),
(41,11423,'Memories of Murder (Crónica de un asesino en serie)','2003-04-25','/eq4oNv2fcDw8murQ9RYyCVbhPHC.jpg'),
(42,170,'28 días después','2002-10-31','/sIGsLU7hMDVKhGKsRFcFxUAtFyT.jpg'),
(43,1562,'28 semanas después','2007-04-26','/8PJEQ63WebiLJ4vtuyXx68Jehmh.jpg'),
(44,379149,'El extranjero','2017-09-28','/tvJcP62XCRSWD7SxFoeLM89ttuj.jpg'),
(45,9360,'Anaconda','1997-04-11','/uj0ZYr2ZvAFT0uPuBdaLb9yYZQv.jpg'),
(46,9533,'El dragón rojo','2002-10-02','/y6wmFX2hY3GS1rWpCwh5MnsMzLa.jpg'),
(47,882569,'El pacto','2023-04-19','/nq7NbZtNfIHyL1NXPV1EiG4XQ7u.jpg'),
(48,139408,'Oro negro','1995-09-15','/dQYD0WNRNZ5OBQ8iWRySIH8TEVd.jpg'),
(49,811592,'Misión de rescate','2021-11-05','/wNSZ00CbDyQNj1Lp8FjZFLLJFv5.jpg'),
(50,881,'Algunos hombres buenos','1992-12-11','/9qTA0V1dncdr2ZQIHxnsP4ysikD.jpg'),
(51,837,'Videodrome','1983-02-04','/qqqkiZSU9EBGZ1KiDmfn07S7qvv.jpg'),
(52,1946,'eXistenZ','1999-04-14','/4vm0BdEXHNPIsTU17VIaoaN4WCz.jpg'),
(53,803700,'Las ocho montañas','2022-12-21','/k005afxR9TZSFRcFN5XiPEjNQ8C.jpg'),
(54,915935,'Anatomía de una caída','2023-08-23','/vGzjaQyv4NPjhgI0hHmKXz3Orjs.jpg'),
(55,666277,'Vidas pasadas','2023-06-02','/jWrJrLMD7SZoxc65KSYej6QOw12.jpg'),
(56,933260,'La sustancia','2024-09-07','/w1PiIqM89r4AM7CiMEP4VLCEFUn.jpg'),
(57,801,'Good Morning, Vietnam','1987-12-23','/gsh0fhNQZ6O1ZYsDIt3THtBxoeP.jpg'),
(58,597,'Titanic','1997-11-18','/VMOt5scbGmBKDvkfHjZN6Ki54i.jpg'),
(59,2756,'Abyss','1989-08-09','/3IF8MSSy6lo2pg7dfa1n9n8SeUX.jpg'),
(60,19995,'Avatar','2009-12-15','/nn7prZXNz3dgCV5jeShqqfHcU9F.jpg'),
(61,76600,'Avatar: El sentido del agua','2022-12-14','/bqOqQ2Tawum3eHKNrc94P4EeaZB.jpg'),
(62,36955,'Mentiras arriesgadas','1994-07-15','/fRNe1fadJ6waoEcjGHgJGyVpEri.jpg'),
(63,31646,'Piraña II: Los vampiros del mar','1982-08-14','/gzapbn7GHmj98LQmxWvGuagPggA.jpg'),
(64,329,'Jurassic Park (Parque Jurásico)','1993-06-11','/tyHYHa5Ltmv7MCjJcd0OixWbhJT.jpg'),
(65,6075,'Atrapado por su pasado','1993-11-10','/yX9vWug1cGtJ6hKhLZDz4fR71Zy.jpg'),
(66,284,'El apartamento','1960-06-21','/2kJMgHi8vNY8a0UJiBU3HEyiqOa.jpg'),
(67,239,'Con faldas y a lo loco','1959-03-19','/y2DPBWFMiwVJeBq0vBX9Um8AqOE.jpg'),
(68,770,'Lo que el viento se llevó','1939-12-15','/vEMSjJbenWci9TrxxtAPPtk3Mzj.jpg'),
(69,990,'El buscavidas','1961-09-25','/6jicxcrfFZpXIBgQidj3uouwsiP.jpg'),
(70,9277,'El golpe','1973-12-25','/1CuTYAQrU3PVZFH4aPp6tQARmUt.jpg'),
(71,289,'Casablanca','1943-01-15','/a7EjycGNSYw6QqJqDooD9eQGZ4r.jpg'),
(72,2252,'Promesas del este','2007-09-14','/7VXya7414oHrpeZKkslNQ7BMcg9.jpg'),
(73,2034,'Training Day (Día de entrenamiento)','2001-10-05','/nagh5PjkfBnDf5SKXyHupWu4yod.jpg'),
(74,641,'Réquiem por un sueño','2000-10-06','/2B5brHMhaHN1d9KmdeZI6RlU3aE.jpg'),
(75,861,'Desafío total','1990-06-01','/v7DoneFNYIrCGeNFiPrqGiQlimN.jpg'),
(76,1103,'1997: Rescate en Nueva York','1981-05-23','/xuaGAc03ajytR8SKaWHNBdh84cC.jpg'),
(77,1013601,'The Alto Knights','2025-03-14','/fZrMqok5ZQH82R1YqBu3LcG26ON.jpg'),
(78,670,'Old Boy','2003-11-21','/45kRW1xgTq3QrZltL9mY9e9iYkH.jpg'),
(79,335984,'Blade Runner 2049','2017-10-04','/cOt8SQwrxpoTv9Bc3kyce3etkZX.jpg'),
(80,11371,'The Score (Un golpe maestro)','2001-07-13','/89DOVIUSu0Jyqulk7xkQRiGMIvG.jpg'),
(81,423,'El pianista','2002-09-17','/mxfLOWnHnSlbdraKfzRn5mqoqk7.jpg'),
(82,75,'Mars Attacks!','1996-12-13','/uNtD2Ci0sJSahFNtvxbVldqEpXx.jpg'),
(83,1992,'Planet Terror','2007-04-06','/a9r5YxDiZDiVg6WpJ4zC0kTw88Z.jpg'),
(84,310131,'La bruja','2016-02-19','/yN7zUze3fkbGNNHI1JYVpRixzAx.jpg'),
(85,1138194,'Heretic (Hereje)','2024-10-31','/1Rir9YoVZgTDXIGA9kn5lFgb2WV.jpg'),
(86,286217,'Marte (The Martian)','2015-09-30','/hBRK1izFxIH3Nh6vax4ssOHSHVd.jpg'),
(87,238,'El padrino','1972-03-14','/5HlLUsmsv60cZVTzVns9ICZD6zU.jpg'),
(88,346698,'Barbie','2023-07-19','/fNtqD4BTFj0Bgo9lyoAtmNFzxHN.jpg');
/*!40000 ALTER TABLE `pelicula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `id_usuario` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `username` varchar(25) NOT NULL,
  `password` text NOT NULL,
  `fecha_nac` date DEFAULT NULL,
  `fecha_alta` datetime NOT NULL,
  `ROLE` varchar(20) NOT NULL DEFAULT 'USER',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES
(8,'Juan','Blanco Moyano','juanblancomoyano@gmail.com','Lemansachs29','$2a$10$cv.Q354kPvFwehAr3CbjZu/eHWo/LE2SspeUBGS9zDvNpvLyeQoqW','2025-04-05','2025-06-06 11:47:48','USER'),
(12,'test1','Test Test','UsuarioSinWachlist@example.com','UsuarioSinWatchlist','$2a$10$7P2yXd09r8WEI0UeAWvvD.Qk8EDnMVBEEkvkbY21f6agB0fhldMTK','2000-05-20','2025-06-06 13:18:23','USER'),
(13,'test1','Test Test','UsuarioSinWachlist45@example.com','Test45','$2a$10$RSiR1g5NKfqBUAZ.VLpPbuU9WJ3y.uNqS7ekE4B7bBuPlliwQqEhS','2000-05-20','2025-06-09 18:59:47','USER'),
(14,'test1','Test Test','UsuarioSinWachlist46@example.com','Test46','$2a$10$4IfaMEBISwg9bqQPLLo4ae5pwetYBAQo4hw0CM1sSoJl8WKvTktbm','2000-05-20','2025-06-09 19:15:27','USER'),
(15,'Test1','Test1','UsuarioTest1@test.com','UsuarioTest1','$2a$10$4y.KJf2q9Jkv5L4bPSX8GONA2Xgshf7syE7lmT.J5GX5GbBg.8g7C','2000-04-05','2025-06-10 18:52:00','USER');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_diario`
--

DROP TABLE IF EXISTS `usuario_diario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario_diario` (
  `id_entrada_diario` bigint(20) NOT NULL AUTO_INCREMENT,
  `fecha_visionado` date NOT NULL,
  `puntuacion` decimal(2,1) DEFAULT NULL,
  `id_usuario` bigint(20) NOT NULL,
  `id_pelicula` bigint(20) NOT NULL,
  PRIMARY KEY (`id_entrada_diario`),
  KEY `fk_usuario_diario_id_usuario` (`id_usuario`),
  KEY `fk_usuario_diario_id_pelicula` (`id_pelicula`),
  CONSTRAINT `fk_usuario_diario_id_pelicula` FOREIGN KEY (`id_pelicula`) REFERENCES `pelicula` (`id_pelicula`) ON UPDATE CASCADE,
  CONSTRAINT `fk_usuario_diario_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_diario`
--

LOCK TABLES `usuario_diario` WRITE;
/*!40000 ALTER TABLE `usuario_diario` DISABLE KEYS */;
INSERT INTO `usuario_diario` VALUES
(27,'2025-03-04',4.0,15,22),
(28,'2025-03-08',3.0,15,23),
(29,'2025-03-09',4.0,15,24),
(30,'2025-03-11',5.0,15,12),
(31,'2025-03-11',0.0,15,25),
(32,'2025-03-13',5.0,15,26),
(33,'2025-03-15',5.0,15,27),
(34,'2025-03-15',3.0,15,28),
(35,'2025-03-18',3.0,15,29),
(36,'2025-03-20',3.0,15,30),
(37,'2025-03-22',3.0,15,31),
(38,'2025-03-25',3.0,15,32),
(39,'2025-03-28',3.0,15,33),
(40,'2025-03-29',3.0,15,34),
(41,'2025-03-31',5.0,15,35),
(42,'2025-04-05',4.0,15,36),
(43,'2025-04-06',3.0,15,37),
(44,'2025-04-06',3.0,15,38),
(45,'2025-04-09',0.0,15,39),
(46,'2025-04-11',3.0,15,40),
(47,'2025-04-12',3.0,15,41),
(48,'2025-04-12',4.0,15,42),
(49,'2025-04-12',4.0,15,43),
(50,'2025-04-13',3.0,15,44),
(51,'2025-04-13',5.0,15,45),
(52,'2024-04-14',0.0,15,46),
(53,'2024-04-14',4.0,15,47),
(54,'2025-04-15',4.0,15,48),
(55,'2025-04-15',3.0,15,49),
(58,'2025-06-08',5.0,15,18),
(59,'2025-06-07',0.0,15,10),
(60,'2025-06-11',5.0,15,87),
(61,'2025-01-11',5.0,15,10),
(63,'2025-06-01',5.0,15,70);
/*!40000 ALTER TABLE `usuario_diario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_watchlist`
--

DROP TABLE IF EXISTS `usuario_watchlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario_watchlist` (
  `id_usuario` bigint(20) NOT NULL,
  `id_pelicula` bigint(20) NOT NULL,
  `fecha_agregado` date NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_pelicula`),
  KEY `fk_usuario_watchlist_id_pelicula` (`id_pelicula`),
  CONSTRAINT `fk_usuario_watchlist_id_pelicula` FOREIGN KEY (`id_pelicula`) REFERENCES `pelicula` (`id_pelicula`) ON UPDATE CASCADE,
  CONSTRAINT `fk_usuario_watchlist_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_watchlist`
--

LOCK TABLES `usuario_watchlist` WRITE;
/*!40000 ALTER TABLE `usuario_watchlist` DISABLE KEYS */;
INSERT INTO `usuario_watchlist` VALUES
(15,51,'2025-06-11'),
(15,52,'2025-06-11'),
(15,53,'2025-06-11'),
(15,54,'2025-06-11'),
(15,55,'2025-06-11'),
(15,56,'2025-06-11'),
(15,57,'2025-06-11'),
(15,58,'2025-06-11'),
(15,59,'2025-06-11'),
(15,60,'2025-06-11'),
(15,61,'2025-06-11'),
(15,62,'2025-06-11'),
(15,63,'2025-06-11'),
(15,64,'2025-06-11'),
(15,65,'2025-06-11'),
(15,66,'2025-06-11'),
(15,67,'2025-06-11'),
(15,68,'2025-06-11'),
(15,69,'2025-06-11'),
(15,71,'2025-06-11'),
(15,72,'2025-06-11'),
(15,73,'2025-06-11'),
(15,74,'2025-06-11'),
(15,75,'2025-06-11'),
(15,76,'2025-06-11'),
(15,77,'2025-06-11'),
(15,78,'2025-06-11'),
(15,79,'2025-06-11'),
(15,80,'2025-06-11'),
(15,81,'2025-06-11'),
(15,82,'2025-06-11'),
(15,83,'2025-06-11'),
(15,84,'2025-06-11'),
(15,85,'2025-06-11'),
(15,86,'2025-06-11');
/*!40000 ALTER TABLE `usuario_watchlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'film_diary_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-11 17:45:52
