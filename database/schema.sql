CREATE DATABASE IF NOT EXISTS FinControl;
USE FinControl;

CREATE TABLE Usuario (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Conta (
    id_account INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    saldo_inicial DECIMAL(10,2) NOT NULL DEFAULT 0,
    usuario_id INT NOT NULL,
    CONSTRAINT fk_conta_usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(id_user)
);

CREATE TABLE CategoriaTransacao (
    id_category INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(60) NOT NULL,
    tipo ENUM('ENTRADA', 'SAIDA') NOT NULL,
    usuario_id INT NOT NULL,
    CONSTRAINT fk_categoria_usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(id_user)
);

CREATE TABLE Transacao (
    id_transaction INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(120) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_transacao DATE NOT NULL,
    tipo ENUM('ENTRADA', 'SAIDA') NOT NULL,
    conta_id INT NOT NULL,
    categoria_id INT NOT NULL,
    usuario_id INT NOT NULL,
    CONSTRAINT chk_transacao_valor CHECK (valor > 0),
    CONSTRAINT fk_transacao_conta FOREIGN KEY (conta_id) REFERENCES Conta(id_account),
    CONSTRAINT fk_transacao_categoria FOREIGN KEY (categoria_id) REFERENCES CategoriaTransacao(id_category),
    CONSTRAINT fk_transacao_usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(id_user)
);

CREATE TABLE MetaFinanceira (
    id_goal INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    prazo DATE,
    usuario_id INT NOT NULL,
    CONSTRAINT chk_meta_valor CHECK (valor > 0),
    CONSTRAINT fk_meta_usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(id_user)
);

CREATE TABLE Orcamento (
    id_budget INT AUTO_INCREMENT PRIMARY KEY,
    valor_limite DECIMAL(10,2) NOT NULL,
    mes_referencia DATE NOT NULL,
    categoria_id INT NOT NULL,
    usuario_id INT NOT NULL,
    CONSTRAINT chk_orcamento_valor CHECK (valor_limite > 0),
    CONSTRAINT fk_orcamento_categoria FOREIGN KEY (categoria_id) REFERENCES CategoriaTransacao(id_category),
    CONSTRAINT fk_orcamento_usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(id_user)
);
