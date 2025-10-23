# Financial System Next.js - Ticto

Este projeto é um sistema financeiro desenvolvido com Next.js, hospedado em: [https://financial-ticto.netlify.app/](https://financial-ticto.netlify.app/)

## Tecnologias Utilizadas

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Docker**
- **Bun**

## Como rodar o projeto localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão recomendada: 18+)
- [Bun](https://bun.sh/)  
   Para instalar o Bun, execute um dos comandos abaixo:

  ````bash # Usando curl
  curl -fsSL https://bun.sh/install | bash

      # Ou usando npm
      npm install -g bun
      ```

  ````

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

### Rodando localmente (sem Docker)

1. Clone o repositório:

   ```bash
   git clone https://github.com/jonathanFranco/ticto-financial.git
   cd ticto-financial/financial-system-nextjs
   ```

2. Instale as dependências e rode o projeto com o gerenciador de pacotes de sua preferência:

#### Usando Bun

```bash
bun install
bun run dev
```

#### Usando pnpm

```bash
pnpm install
pnpm dev
```

#### Usando yarn

```bash
yarn install
yarn dev
```

#### Usando npm

```bash
npm install
npm run dev
```

4. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Rodando com Docker

1. Certifique-se de que o Docker e o Docker Compose estão instalados.
2. Execute o comando:
   ```bash
   docker-compose up --build
   ```
3. O projeto estará disponível em [http://localhost:3000](http://localhost:3000).

---

Acesse a aplicação em produção: [https://financial-ticto.netlify.app/](https://financial-ticto.netlify.app/)
