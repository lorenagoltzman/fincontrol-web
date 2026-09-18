(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Finance = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function normalizeTransaction(input) {
    const type = input.type === "income" ? "income" : "expense";
    const value = Number(input.value);
    if (!input.description || !String(input.description).trim()) {
      throw new Error("Informe uma descrição.");
    }
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error("Informe um valor maior que zero.");
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(input.date))) {
      throw new Error("Informe uma data válida.");
    }
    return {
      id: input.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      description: String(input.description).trim(),
      category: String(input.category || "Outros"),
      date: String(input.date),
      type,
      value: Math.round(value * 100) / 100
    };
  }

  function calculateSummary(transactions) {
    const income = transactions.filter(item => item.type === "income").reduce((sum, item) => sum + item.value, 0);
    const expense = transactions.filter(item => item.type === "expense").reduce((sum, item) => sum + item.value, 0);
    return { income, expense, balance: income - expense };
  }

  function groupExpensesByCategory(transactions) {
    return transactions
      .filter(item => item.type === "expense")
      .reduce((groups, item) => {
        groups[item.category] = (groups[item.category] || 0) + item.value;
        return groups;
      }, {});
  }

  function filterTransactions(transactions, query = "", type = "all") {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return transactions.filter(item => {
      const matchesType = type === "all" || item.type === type;
      const searchable = `${item.description} ${item.category}`.toLocaleLowerCase("pt-BR");
      return matchesType && searchable.includes(normalizedQuery);
    });
  }

  function calculateGoalProgress(balance, goal) {
    if (!Number.isFinite(goal) || goal <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round(balance / goal * 100)));
  }

  return { normalizeTransaction, calculateSummary, groupExpensesByCategory, filterTransactions, calculateGoalProgress };
});
