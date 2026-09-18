# FinControl Web

Aplicação web responsiva para registrar receitas e despesas, acompanhar o saldo mensal e visualizar a distribuição dos gastos por categoria.

> Projeto de portfólio desenvolvido para aplicar JavaScript, regras de negócio, persistência local e modelagem de banco de dados.

## Demonstração

**[Abrir aplicação publicada](https://lorenagoltzman.github.io/fincontrol-web/)**

Use dados fictícios: as informações ficam somente no `localStorage` do navegador.

## Funcionalidades

- Cadastro de receitas e despesas
- Cálculo automático de saldo, entradas e saídas
- Filtro por tipo e busca por descrição ou categoria
- Resumo de gastos por categoria
- Meta mensal de economia
- Exclusão de lançamentos
- Persistência no navegador com `localStorage`
- Dados demonstrativos restauráveis
- Layout responsivo e acessível

## Como executar

Não há dependências. Abra `index.html` no navegador ou use um servidor local:

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Testes

As regras de cálculo ficam separadas da interface e podem ser verificadas com Node.js:

```bash
node --test tests/finance.test.js
```

## Banco de dados

O protótipo salva informações no navegador para facilitar a demonstração. A pasta `database` contém um modelo MySQL para uma evolução futura com usuários, contas, categorias, transações, orçamentos e metas financeiras.

## Tecnologias

HTML, CSS, JavaScript, LocalStorage, Node Test Runner e modelagem SQL/MySQL.

## Próximos passos

- Autenticação de usuários
- API REST para substituir o armazenamento local
- Integração com MySQL
- Importação e exportação de lançamentos
- Indicadores por período

## Privacidade

Os dados cadastrados ficam somente no navegador do usuário. Use valores fictícios na demonstração pública.
