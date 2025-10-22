-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 22/10/2025 às 20:07
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `borcelle`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `data_nascimento` date NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `telefone` varchar(15) NOT NULL,
  `celular` varchar(15) DEFAULT NULL,
  `endereco` text NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo` int(11) DEFAULT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `data_nascimento`, `cpf`, `telefone`, `celular`, `endereco`, `senha`, `tipo`, `data_criacao`) VALUES
(1, 'João da Silva Teste', 'joao.teste@exemplo.com', '1985-05-15', '12345678901', '4532219999', '45988887777', 'Rua das Flores, 123, Centro, Cidade Teste - PR', '$2y$10$96xQY.vRj.6J8N6oA.U6r.LgD4L4y2o1hNlF3zM9E8C7D6E5F4G3', NULL, '2025-10-22 12:38:53'),
(2, 'APARECIDA DA SILVA FERREIRA', 'aparecida.ferreira@gmail.com', '0000-00-00', '444.444.444-44', '(45) 5555-5555', '(45) 5555-5555', 'r Araucaria', '$2y$10$9ojY6ABQuXEBAVwo2yae4.VCWt6DxoJcwWeAwU55NVV029c140Orq', NULL, '2025-10-22 13:06:49'),
(3, 'clara', 'clara@gmail.com', '2222-02-22', '3333333333333', '(45) 5555-5555', '(45) 5555-5555', 'r Araucaria', '$2y$10$4kYXl.XidJ8p2wYKoku0i.pbsfrycuGQu5ahlZEv.NpkvuCxY8E2S', NULL, '2025-10-22 17:56:45');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `cpf` (`cpf`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
