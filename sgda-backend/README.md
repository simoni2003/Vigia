# SGDA Backend — Sistema de Gestao de Denuncias de Assedio

Backend em **Spring Boot 3 / Java 17**, conforme o enunciado do projeto (secoes 3.x),
para ser testado localmente com **PostgreSQL**. Docker foi propositadamente excluido
deste entregavel.

## 1. Pre-requisitos

- Java 17+
- Maven 3.9+ (ou usar `./mvnw`, se preferires adicionar o wrapper)
- PostgreSQL 14+ instalado e a correr localmente

## 2. Preparar a base de dados local

```sql
CREATE DATABASE sgda_db;
```

As tabelas sao criadas automaticamente no arranque (`spring.jpa.hibernate.ddl-auto=update`).

## 3. Configuracao

Edita `src/main/resources/application.properties`:

- `spring.datasource.username` / `spring.datasource.password` — credenciais do teu Postgres local
- `jwt.secret` — pode manter o valor de desenvolvimento fornecido
- `app.mail.enabled=false` por defeito: os emails sao apenas escritos no log em vez de
  enviados de facto. Muda para `true` e preenche `spring.mail.*` com um SMTP real
  (ex: Mailtrap para testes) quando quiseres testar o envio.

## 4. Correr a aplicacao

```bash
cd sgda-backend
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`.

No primeiro arranque e criado automaticamente um utilizador **Admin**:

- email: `admin@sgda.local`
- senha: `admin123`

(configuravel em `app.admin.*`)

## 5. Documentacao interativa (Swagger)

`http://localhost:8080/swagger-ui.html`

Util para testar todos os endpoints sem esperar pelo frontend Angular.

## 6. Visao geral dos endpoints

### Publico (Portal do Denunciante)
| Metodo | Endpoint | Descricao |
|---|---|---|
| POST | `/api/denuncias/publico` | Submete uma nova denuncia (anonima ou identificada) |
| GET | `/api/denuncias/rastreio/{protocolo}` | Consulta status + timeline pelo Protocolo Unico |
| POST | `/api/chat/publico/{protocolo}` | Denunciante envia mensagem no Chat Seguro |
| GET | `/api/chat/publico/{protocolo}` | Denunciante le as mensagens do Chat Seguro |

### Autenticacao
| Metodo | Endpoint | Descricao |
|---|---|---|
| POST | `/api/auth/login` | Login (email + senha) -> devolve JWT |

### Painel de Gestao (Restrito — requer `Authorization: Bearer <token>`)
| Metodo | Endpoint | Roles |
|---|---|---|
| GET | `/api/gestao/denuncias` | ADMIN, GESTOR, INVESTIGADOR |
| GET | `/api/gestao/denuncias/{id}` | ADMIN, GESTOR, INVESTIGADOR |
| GET | `/api/gestao/denuncias/{id}/historico` | ADMIN, GESTOR, INVESTIGADOR |
| PUT | `/api/gestao/denuncias/{id}/status` | ADMIN, GESTOR, INVESTIGADOR |
| PUT | `/api/gestao/denuncias/{id}/investigador` | ADMIN, GESTOR |
| GET | `/api/gestao/dashboard` | ADMIN, GESTOR |
| POST/GET/PUT/DELETE | `/api/gestao/usuarios/**` | ADMIN |
| GET | `/api/gestao/usuarios/investigadores` | ADMIN, GESTOR |
| POST/GET | `/api/chat/gestao/{denunciaId}` | ADMIN, GESTOR, INVESTIGADOR |

## 7. Modelo de dados

- **Usuario**: nome, email, senha (BCrypt), role (ADMIN / GESTOR / INVESTIGADOR)
- **Denuncia**: protocolo (UUID unico), descricao, status, anonima, email opcional, anexo, investigador responsavel
- **HistoricoAcao**: timeline de cada denuncia (quem, quando, que acao)
- **ChatMensagem**: mensagens do Chat Seguro entre Denunciante e Comite

## 8. Seguranca

- JWT stateless (Spring Security), sem sessao no servidor
- Endpoints publicos limitados ao estritamente necessario (submissao, rastreio, chat via protocolo)
- Autorizacao por Role com `@PreAuthorize`
- Senhas guardadas com BCrypt
- **Nota**: o enunciado pede reCAPTCHA no endpoint publico de submissao — isso deve ser
  validado no frontend/gateway ou adicionado como filtro extra (nao incluido aqui pois
  depende de uma chave de servico Google reCAPTCHA a configurar por ti).

## 9. Proximos passos sugeridos (fora deste escopo)

- Upload real de anexos (hoje `anexoUrl` e apenas um campo texto — liga a um storage, ex: GCS)
- Paginacao nos endpoints de listagem de denuncias
- Testes automatizados (unit/integration)
- Dockerfile + docker-compose (excluidos a pedido)
