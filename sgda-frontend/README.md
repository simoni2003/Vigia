# Vigia — Frontend

Aplicação Angular 17 (standalone components, sem NgModules) para o Portal do
Denunciante e o Painel de Gestão do sistema **Vigia**, ligada à API Spring Boot
já desenvolvida (`sgda-backend`).

## Direção de design

- **Paleta**: branco/vermelho tratado como um "selo institucional" — não é
  vermelho de alarme, é vermelho de autoridade e seriedade.
- **Tipografia**: `Fraunces` (serifada, títulos) + `IBM Plex Sans` (interface)
  + `IBM Plex Mono` (só para códigos de protocolo e datas — liga-se ao
  conceito de rastreio, não é decoração).
- **Ícones**: desenhados à mão em SVG dentro de `IconComponent`
  (`src/app/shared/icons/icon.component.ts`) — sem biblioteca genérica.
- **Hero da landing**: em vez de uma foto de pessoa sorridente (que seria
  estranha num produto sobre denúncia anónima), usa um "cartão de protocolo"
  estilizado com linhas redigidas, reforçando o tema de confidencialidade.
- **Dashboard**: a barra segmentada de distribuição de estados é o elemento
  visual "ousado" — mostra informação real (proporção de casos por estado),
  não um anel decorativo genérico de progresso.

Todos os tokens de cor/tipografia/espaçamento estão centralizados em
`src/styles.scss`.

## Pré-requisitos

- Node.js 18+ e npm
- O backend (`sgda-backend`) a correr em `http://localhost:8080`

## Instalar e correr

```bash
cd sgda-frontend
npm install
npm start
```

Abre em `http://localhost:4200`.

## Estrutura

```
src/app/
  core/               # serviços, modelos, guarda de rotas, interceptor JWT
  shared/              # ícones e componentes reutilizáveis (ex: selo de status)
  features/
    landing/           # Portal do Denunciante — hero, "como funciona", formulário
    rastreio/          # Consulta de estado pelo Protocolo Único
    auth/               # Login do Painel de Gestão
    admin/
      shell/           # Layout (sidebar + topo) do Painel de Gestão
      dashboard/       # Página inicial do Painel — métricas e casos recentes
```

## Rotas

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | Público | Landing page + formulário de denúncia |
| `/rastreio` ou `/rastreio/:protocolo` | Público | Consulta de estado e histórico |
| `/chat` ou `/chat/:protocolo` | Público (só com protocolo) | Chat seguro com o Comité |
| `/entrar` | Público | Login do Comité |
| `/painel/dashboard` | Autenticado | Métricas e casos recentes |
| `/painel/denuncias` | Autenticado | Lista com filtros (estado, protocolo) |
| `/painel/denuncias/:id` | Autenticado | Detalhe: mudar estado, atribuir investigador (Admin/Gestor), histórico e chat |
| `/painel/mensagens` | Autenticado | Todas as conversas do Comité |
| `/painel/utilizadores` | Só Admin | Criar, editar e desativar Gestores/Investigadores |

O token JWT é guardado em `localStorage` e injetado automaticamente em todos
os pedidos via `auth.interceptor.ts`. `/painel/**` é protegido por
`auth.guard.ts`, e `/painel/utilizadores` por `role.guard.ts`.

## Notas

- O chat atualiza por polling a cada 10 segundos (sem WebSockets).
- O backend não tem endpoint para reativar utilizadores desativados.
- O reCAPTCHA do formulário público (pedido no enunciado) não está incluído:
  depende de uma chave Google a configurar por ti.
- Anexos: o campo existe no backend (`anexoUrl`) mas o formulário ainda não
  faz upload de ficheiros.
