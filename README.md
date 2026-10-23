# Sistema Bancário Refatorado

Refatoração do Sistema Bancário de console (Java) para uma aplicação cliente-servidor:

- **backend/** — Go, arquitetura hexagonal + MVC, SQLite atrás de adapter DAO
- **frontend/** — React + Vite
- **docker-compose.yml** — 2 containers (frontend nginx + backend Go) numa rede Docker

Desenvolvimento guiado por **TDD, BDD e DDD**. A evidência do TDD está no histórico de commits
(`test(Rxx): RED`, `feat(Rxx): GREEN`, `refactor(Rxx)`).

> Em construção. A documentação de requisitos, arquitetura e plano fica no projeto ORCA
> que contém esta pasta (`../docs/`, `../.orca/`).
