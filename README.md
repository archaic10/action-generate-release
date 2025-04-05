# action-generate-release

Este projeto automatiza o processo de geração e atualização de **release notes** no GitHub com base em mensagens de commits semânticos (`feat`, `fix`, `refactor`, etc).

## Arquitetura

O projeto segue os princípios da **Arquitetura Hexagonal (Ports & Adapters)** com uso de **TypeScript** e GitHub Actions.


## Funcionalidades

- Detecta tipo de release (`major`, `minor`, `patch`) com base nos commits.
- Atualiza release existente ou cria uma nova com changelog.
- Usa milestone (se definido) para agrupar alterações.
- Compatível com [Conventional Commits](https://www.conventionalcommits.org/).

## Estrutura 

```bash
src
├── adapters
│   └── output
│       ├── GitHubAPI.ts
│       └── GitHubReleaseAdapterRepository.ts
├── application
│   └──  ReleaseUseCase.ts
├── core
│   └── VersionManager.ts
├── main.ts
└── ports
    ├── Commits.ts
    ├── input
    │   └── GitHubActionEntry.ts
    ├── output
    └── Repository.ts

```
