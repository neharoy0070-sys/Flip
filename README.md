# FinShield

**FinShield** is an AI-powered Anti-Money Laundering (AML) investigation platform built with Spring Boot, PostgreSQL, pgvector, and local LLMs through Ollama.

It provides a complete workflow for monitoring financial activity, detecting AML risks, managing investigations, generating Suspicious Activity Reports (SARs), and assisting investigators with AI-powered analysis.

---

## Key Features

###  Authentication & RBAC

* JWT-based authentication
* Role-based access control
* `ROLE_USER`
* `ROLE_ADMIN`
* `ROLE_INVESTIGATOR`

### Customer & Transaction Management

* Customer management
* Wallet management
* Transaction tracking
* Transaction history and analysis
* Risk classification

### AML Monitoring

* AML alert generation
* Configurable AML rules
* Alert filtering and pagination
* Supported rule types include:

    * Large Transaction
    * High Frequency
    * High Risk Country
    * PEP
    * Low KYC
    * High Risk Business

### Case Management

* Create and manage AML investigation cases
* Assign cases to investigators
* Track investigation status
* Case remarks and audit history
* Investigation timeline
* Customer relationship graph

### Compliance & SAR

* Suspicious Activity Report (SAR) generation
* AI-assisted SAR generation
* Compliance assessment
* Investigation recommendations
* Next-best-action suggestions

### AI Investigation Assistant

FinShield uses a tool-based AI investigation architecture.

The AI planner determines the investigator's intent and selects the appropriate investigation tool.

Supported AI capabilities include:

* Risk explanation
* Transaction pattern analysis
* Case summaries
* SAR generation
* Next-best-action recommendations
* Dashboard insights
* Investigator chat
* RAG-based document investigation

### RAG (Retrieval-Augmented Generation)

FinShield uses PostgreSQL with **pgvector** to store and retrieve document embeddings.

The RAG pipeline supports:

1. Document upload
2. Text extraction
3. Document chunking
4. Embedding generation
5. Vector storage
6. Similarity search
7. Context construction
8. LLM-based answer generation

Document-grounded answers are used when investigators ask questions about information contained in AML investigation documents.

### Local AI

AI processing runs locally using **Ollama**, avoiding dependency on external LLM APIs during development.

Current models:

* `llama3.2` â€” conversational/investigation reasoning
* `nomic-embed-text` â€” document embeddings

### ” Notifications & Audit Trail

* Investigator notifications
* Unread notification tracking
* Case/alert activity
* Case audit trail
* AI audit logging

### Dashboards

* AML dashboard
* Executive dashboard
* Risk forecast
* Compliance assessment
* Dashboard AI insights

---

## Architecture

```text
                         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                         â”‚      Frontend        â”‚
                         â”‚ HTML / CSS / JS      â”‚
                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                    â”‚ REST API
                                    â–¼
                         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                         â”‚   Spring Boot API    â”‚
                         â”‚      FinShield       â”‚
                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                    â”‚
              â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
              â”‚                     â”‚                     â”‚
              â–¼                     â–¼                     â–¼
       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
       â”‚ PostgreSQL  â”‚       â”‚   Security  â”‚       â”‚    AI       â”‚
       â”‚ + pgvector  â”‚       â”‚ JWT + RBAC  â”‚       â”‚   Layer     â”‚
       â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜       â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜       â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”˜
                                                          â”‚
                                           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                                           â”‚              â”‚              â”‚
                                           â–¼              â–¼              â–¼
                                      AI Planner      AI Tools         RAG
                                           â”‚              â”‚              â”‚
                                           â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                                          â”‚
                                                          â–¼
                                                   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                                                   â”‚   Ollama    â”‚
                                                   â”‚ llama3.2    â”‚
                                                   â”‚ embeddings  â”‚
                                                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## AI Investigation Flow

A typical investigator question follows this flow:

```text
Investigator Question
        â”‚
        â–¼
AI Chat API
        â”‚
        â–¼
AI Investigation Service
        â”‚
        â–¼
AI Agent
        â”‚
        â–¼
AI Planner
        â”‚
        â–¼
Tool Selection
        â”‚
        â”œâ”€â”€ RAG Query
        â”œâ”€â”€ Risk Explanation
        â”œâ”€â”€ Transaction Pattern
        â”œâ”€â”€ Case Summary
        â”œâ”€â”€ SAR Generation
        â”œâ”€â”€ Next Action
        â”œâ”€â”€ Dashboard Insights
        â””â”€â”€ Investigator Chat
                â”‚
                â–¼
          Tool Executor
                â”‚
                â–¼
        Investigation Context
                â”‚
                â–¼
             Ollama
                â”‚
                â–¼
        Final AML Answer
```

The system is designed so that document-grounded information can be retrieved through RAG rather than relying only on the language model's general knowledge.

---

## Technology Stack

### Backend

* Java 17
* Spring Boot 3.5.3
* Spring Security
* JWT
* Spring Data JPA
* Maven
* Springdoc OpenAPI / Swagger

### Database

* PostgreSQL
* pgvector

### AI

* Spring AI
* Ollama
* Llama 3.2
* nomic-embed-text
* Retrieval-Augmented Generation (RAG)

### Other

* Docker
* Nginx
* OpenPDF
* Piper TTS
* JUnit

---

## Project Structure

```text
FinShield/
â”‚
â”œâ”€â”€ Flip/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ main/
â”‚   â”‚   â”‚   â”œâ”€â”€ java/
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ com/
â”‚   â”‚   â”‚   â”‚       â””â”€â”€ finshield/
â”‚   â”‚   â”‚   â”‚
â”‚   â”‚   â”‚   â””â”€â”€ resources/
â”‚   â”‚   â”‚       â””â”€â”€ static/
â”‚   â”‚   â”‚
â”‚   â”‚   â””â”€â”€ test/
â”‚   â”‚
â”‚   â””â”€â”€ pom.xml
â”‚
â”œâ”€â”€ .gitignore
â””â”€â”€ README.md
```

---

## âš™ï¸ Local Development

### Prerequisites

Install:

* Java 17
* Maven
* PostgreSQL
* pgvector
* Ollama

Verify Java:

```bash
java -version
```

Verify Maven:

```bash
mvn -version
```

Verify Ollama:

```bash
ollama --version
```

---

## Ollama Setup

Install the required models:

```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

Start Ollama:

```bash
ollama serve
```

The application expects Ollama to be available at:

```text
http://localhost:11434
```

---

## Database Setup

Create a PostgreSQL database for FinShield.

The application uses PostgreSQL with pgvector for both relational data and vector-based document retrieval.

Make sure the pgvector extension is available:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Database credentials should be supplied through environment variables or a local configuration file.

**Do not commit credentials to GitHub.**

---

## ‘ Configuration

The real `application.properties` file is intentionally excluded from the public repository.

Configure your local environment with values for:

* PostgreSQL connection
* JWT secret
* Mail configuration
* Ollama URL
* AI model configuration
* File/storage configuration

Example environment variables:

```text
DB_URL=
DB_USERNAME=
DB_PASSWORD=

JWT_SECRET=

MAIL_USERNAME=
MAIL_PASSWORD=

OLLAMA_BASE_URL=
OLLAMA_CHAT_MODEL=
OLLAMA_EMBEDDING_MODEL=
```

Never commit real passwords, API keys, JWT secrets, or other credentials.

---

## â–¶ï¸ Running the Application

Navigate to the Spring Boot project:

```bash
cd Flip
```

Build the project:

```bash
mvn clean package
```

Run the application:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

---

## API Documentation

When the application is running, Swagger/OpenAPI documentation is available through Springdoc.

Typical endpoints:

```text
/swagger-ui/index.html
/v3/api-docs
```

---

##  Authentication

Login through:

```text
POST /api/auth/login
```

The application returns a JWT token which is used to authenticate protected APIs.

Authorization is controlled through application roles:

```text
ROLE_USER
ROLE_ADMIN
ROLE_INVESTIGATOR
```

---

## Example AI Investigation Workflow

```text
Customer
   â”‚
   â–¼
Transactions
   â”‚
   â–¼
AML Rules
   â”‚
   â–¼
Alerts
   â”‚
   â–¼
Investigation Case
   â”‚
   â”œâ”€â”€ Investigator
   â”œâ”€â”€ Case History
   â”œâ”€â”€ Audit Trail
   â”œâ”€â”€ Investigation Timeline
   â””â”€â”€ Related Entities
          â”‚
          â–¼
      AI Assistant
          â”‚
          â”œâ”€â”€ Risk Analysis
          â”œâ”€â”€ Transaction Analysis
          â”œâ”€â”€ RAG
          â”œâ”€â”€ Case Summary
          â”œâ”€â”€ Next Action
          â””â”€â”€ SAR Generation
```

---

## Project Goals

FinShield was designed as a practical AML investigation platform demonstrating how traditional financial crime monitoring can be combined with modern AI techniques.

The project focuses on:

* Backend engineering
* Secure REST APIs
* Role-based authorization
* Financial transaction monitoring
* AML rule processing
* Investigation workflows
* Auditability
* Retrieval-Augmented Generation
* Local LLM integration
* Tool-based AI agents
* Production-oriented deployment

---

## Deployment

The planned production architecture is:

```text
                 Internet
                    â”‚
                    â–¼
              â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
              â”‚   Nginx   â”‚
              â”‚ HTTPS/SSL â”‚
              â””â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”˜
                    â”‚
                    â–¼
            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
            â”‚ Spring Boot  â”‚
            â”‚  FinShield    â”‚
            â””â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜
                    â”‚
          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
          â–¼         â–¼         â–¼
     PostgreSQL   pgvector   Ollama
                              â”‚
                       â”Œâ”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”
                       â–¼             â–¼
                    Llama 3.2   Embeddings
```

The backend is intended to run on a cloud VM with Docker, PostgreSQL/pgvector, Ollama, and Nginx.

---

## License

This project is intended for educational, portfolio, and demonstration purposes.


