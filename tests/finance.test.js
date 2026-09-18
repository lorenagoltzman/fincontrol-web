const test = require("node:test");
const assert = require("node:assert/strict");
const Finance = require("../src/finance.js");

test("calcula entradas, saídas e saldo", () => {
  const summary = Finance.calculateSummary([
    { type: "income", value: 500 },
    { type: "expense", value: 120.50 },
    { type: "expense", value: 79.50 }
  ]);
  assert.deepEqual(summary, { income: 500, expense: 200, balance: 300 });
});

test("agrupa somente despesas por categoria", () => {
  const result = Finance.groupExpensesByCategory([
    { type: "expense", category: "Alimentação", value: 40 },
    { type: "expense", category: "Alimentação", value: 25 },
    { type: "income", category: "Trabalho", value: 300 }
  ]);
  assert.deepEqual(result, { "Alimentação": 65 });
});

test("filtra por texto e tipo", () => {
  const items = [
    { description: "Internet", category: "Moradia", type: "expense" },
    { description: "Venda", category: "Trabalho", type: "income" }
  ];
  assert.equal(Finance.filterTransactions(items, "mora", "expense").length, 1);
  assert.equal(Finance.filterTransactions(items, "", "income")[0].description, "Venda");
});

test("valida e normaliza um lançamento", () => {
  const item = Finance.normalizeTransaction({ description: "  Curso  ", category: "Educação", date: "2026-09-18", type: "expense", value: "49.90" });
  assert.equal(item.description, "Curso");
  assert.equal(item.value, 49.9);
  assert.throws(() => Finance.normalizeTransaction({ description: "", date: "2026-09-18", value: 10 }), /descrição/);
});

test("limita o progresso da meta entre zero e cem", () => {
  assert.equal(Finance.calculateGoalProgress(150, 300), 50);
  assert.equal(Finance.calculateGoalProgress(600, 300), 100);
  assert.equal(Finance.calculateGoalProgress(-10, 300), 0);
});
