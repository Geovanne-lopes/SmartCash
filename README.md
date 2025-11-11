# 💸 SmartCash

**SmartCash** é uma plataforma financeira inteligente desenvolvida em grupo para facilitar o controle de receitas, despesas e informações pessoais do usuário, como trabalho de conclusão de fase da FIAP.  
O projeto integra **Java (Spring Boot)** no backend, **ReactJS** no frontend e o banco de dados **Oracle Cloud da FIAP**.

---

## 📘 Sobre o Projeto

O **SmartCash** tem como objetivo oferecer uma solução prática e eficiente para o gerenciamento financeiro pessoal.  
A aplicação permite que o usuário acompanhe suas finanças de forma intuitiva e segura.

### 🧩 Funcionalidades Principais
- Cadastro e login de usuários.  
- Controle de receitas e despesas.  
- Edição de perfil pessoal.  
- Exibição de saldo e histórico de transações.

---

## ⚙️ Tecnologias Utilizadas

**Frontend:** ReactJS  
**Backend:** Spring Boot (Java 17)  
**Banco de Dados:** Oracle SQL (FIAP)  
**Ferramentas:** Node.js, Maven, SQL Developer

---

## ✅ Pré-requisitos

Antes de iniciar o projeto, verifique se possui os seguintes itens instalados:

- [Java JDK 17+](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)  
- [Node.js e npm](https://nodejs.org/)  
- [Oracle SQL Developer](https://www.oracle.com/database/sqldeveloper/)  

---

## 🧩 Instalação do Node.js

### 💻 Windows (via Chocolatey)
```bash
choco install nodejs
```

### 🐧 Linux (Ubuntu/Debian)
```bash
sudo apt update && sudo apt install nodejs npm
```

### Verificar instalação:
```bash
node -v
npm -v
```

---

## 🗄️ Configuração do Banco de Dados Oracle

Conecte-se à instância Oracle da FIAP utilizando suas credenciais (ex.:  
**usuário:** rmXXXXXX | **senha:** suaSenha).

Em seguida, execute os scripts abaixo no SQL Developer:

### Criação das Tabelas e Sequências
```sql
-- Sequência para usuários
CREATE SEQUENCE SEQ_USUARIO START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

-- Tabela de usuários
CREATE TABLE T_SMC_USUARIO (
    id_usuario NUMBER(18) NOT NULL,
    ds_email VARCHAR2(255) NOT NULL,
    ds_hash_senha VARCHAR2(255) NOT NULL,
    nm_usuario VARCHAR2(100) NOT NULL,
    CONSTRAINT T_SMC_USUARIO_PK PRIMARY KEY (id_usuario),
    CONSTRAINT CK_SENHA_MIN_8 CHECK (LENGTH(ds_hash_senha) >= 8)
);
ALTER TABLE T_SMC_USUARIO ADD CONSTRAINT UK_SMC_USUARIO_EMAIL UNIQUE (ds_email);

-- Tabela de receitas
CREATE TABLE T_SMC_RECEITA (
    id_receita NUMBER(18,0) PRIMARY KEY,
    nm_receita VARCHAR2(100) NOT NULL,
    ds_receita VARCHAR2(255) NOT NULL,
    vl_receita NUMBER(15,0) NOT NULL,
    dt_receita DATE NOT NULL,
    cat_receita VARCHAR2(50) NOT NULL,
    id_usuario NUMBER(18,0),
    CONSTRAINT fk_receita_usuario FOREIGN KEY (id_usuario)
        REFERENCES T_SMC_USUARIO(id_usuario)
);

-- Tabela de despesas
CREATE TABLE T_SMC_DESPESA (
    id_despesa NUMBER(18,0) PRIMARY KEY,
    nm_despesa VARCHAR2(100) NOT NULL,
    ds_despesa VARCHAR2(255) NOT NULL,
    vl_despesa NUMBER(15,0) NOT NULL,
    dt_despesa DATE NOT NULL,
    cat_despesa VARCHAR2(50) NOT NULL,
    id_usuario NUMBER(18,0),
    CONSTRAINT fk_despesa_usuario FOREIGN KEY (id_usuario)
        REFERENCES T_SMC_USUARIO(id_usuario)
);
```

### Resetar Tabelas e Sequências
```sql
TRUNCATE TABLE T_SMC_USUARIO;
DROP SEQUENCE SEQ_USUARIO;
CREATE SEQUENCE SEQ_USUARIO START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

TRUNCATE TABLE T_SMC_DESPESA;
DROP SEQUENCE SEQ_DESPESA;
CREATE SEQUENCE SEQ_DESPESA START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

TRUNCATE TABLE T_SMC_RECEITA;
DROP SEQUENCE SEQ_RECEITA;
CREATE SEQUENCE SEQ_RECEITA START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
```

---

## ▶️ Execução do Backend (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

A API estará disponível em:  
👉 [http://localhost:8080](http://localhost:8080)

---

## 💻 Execução do Frontend (ReactJS)

```bash
cd frontend
npm install
npm start
```

A aplicação será executada em:  
👉 [http://localhost:5173](http://localhost:5173)

---

## 🔐 Credenciais de Teste

Para testes locais:
```
Email: userteste@gmail.com
Senha: 12345678
```

---

## 🖥️ Funcionalidades do Sistema

| Tela | Descrição |
|------|------------|
| **Cadastro** | Criação de conta com nome, e-mail e senha. |
| **Login** | Autenticação do usuário no sistema. |
| **Home (Visão Financeira)** | Exibe saldo, gráfico e histórico de transações. |
| **Nova Receita/Despesa** | Formulário para adicionar transações. |
| **Editar Perfil** | Atualização de dados do usuário (nome, e-mail e senha). |

---

## 🧪 Testes

Para executar os testes automatizados do backend:
```bash
mvn test
```

---

## ⚠️ Observações Importantes

- A senha deve conter **no mínimo 8 caracteres**.  
- A sessão expira automaticamente após **3 minutos de inatividade**.  
- Caso o banco esteja vazio, crie um novo usuário pela tela de cadastro.  
- Certifique-se de que as portas **8080 (backend)** e **5173 (frontend)** estão livres antes de iniciar.
