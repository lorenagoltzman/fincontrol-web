const STORAGE_KEY = "fincontrol.transactions.v1";
const MONTHLY_GOAL = 300;

const demoTransactions = [
  { id: "demo-1", description: "Pagamento de serviço", category: "Trabalho", date: "2026-09-18", type: "income", value: 850 },
  { id: "demo-2", description: "Faculdade", category: "Educação", date: "2026-09-17", type: "expense", value: 461.30 },
  { id: "demo-3", description: "Internet", category: "Moradia", date: "2026-09-15", type: "expense", value: 120 },
  { id: "demo-4", description: "Combustível", category: "Transporte", date: "2026-09-12", type: "expense", value: 64.50 },
  { id: "demo-5", description: "Venda adicional", category: "Trabalho", date: "2026-09-10", type: "income", value: 280 },
  { id: "demo-6", description: "Supermercado", category: "Alimentação", date: "2026-09-08", type: "expense", value: 96.40 }
];

const elements = {
  balance: document.querySelector("#balance-value"),
  income: document.querySelector("#income-value"),
  expense: document.querySelector("#expense-value"),
  saved: document.querySelector("#saved-value"),
  goal: document.querySelector("#goal-value"),
  goalPercent: document.querySelector("#goal-percent"),
  goalRing: document.querySelector("#goal-ring"),
  categories: document.querySelector("#category-bars"),
  list: document.querySelector("#transaction-list"),
  empty: document.querySelector("#empty-state"),
  search: document.querySelector("#search"),
  typeFilter: document.querySelector("#type-filter"),
  dialog: document.querySelector("#transaction-dialog"),
  form: document.querySelector("#transaction-form"),
  error: document.querySelector("#form-error")
};

let transactions = loadTransactions();

function loadTransactions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [...demoTransactions];
  } catch {
    return [...demoTransactions];
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function money(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function shortDate(value) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function render() {
  const summary = Finance.calculateSummary(transactions);
  elements.balance.textContent = money(summary.balance);
  elements.income.textContent = money(summary.income);
  elements.expense.textContent = money(summary.expense);
  elements.saved.textContent = money(Math.max(0, summary.balance));
  elements.goal.textContent = money(MONTHLY_GOAL);

  const progress = Finance.calculateGoalProgress(summary.balance, MONTHLY_GOAL);
  elements.goalPercent.textContent = `${progress}%`;
  elements.goalRing.style.setProperty("--progress", `${progress * 3.6}deg`);
  renderCategories();
  renderTransactions();
}

function renderCategories() {
  const groups = Finance.groupExpensesByCategory(transactions);
  const entries = Object.entries(groups).sort((a, b) => b[1] - a[1]);
  const max = entries[0]?.[1] || 1;
  elements.categories.innerHTML = entries.length ? entries.map(([category, value]) => `
    <div class="category-row">
      <div><span>${escapeHtml(category)}</span><strong>${money(value)}</strong></div>
      <div class="bar-track"><span style="width:${Math.max(5, value / max * 100)}%"></span></div>
    </div>`).join("") : '<p class="muted-copy">Cadastre uma despesa para visualizar as categorias.</p>';
}

function renderTransactions() {
  const items = Finance.filterTransactions(transactions, elements.search.value, elements.typeFilter.value)
    .sort((a, b) => b.date.localeCompare(a.date));
  elements.empty.hidden = items.length > 0;
  elements.list.innerHTML = items.map(item => `
    <tr>
      <td><strong>${escapeHtml(item.description)}</strong></td>
      <td><span class="category-tag">${escapeHtml(item.category)}</span></td>
      <td>${shortDate(item.date)}</td>
      <td><span class="type-label ${item.type}">${item.type === "income" ? "Entrada" : "Saída"}</span></td>
      <td class="amount ${item.type}">${item.type === "income" ? "+" : "-"} ${money(item.value)}</td>
      <td><button class="delete-button" type="button" data-delete="${escapeHtml(item.id)}" aria-label="Excluir ${escapeHtml(item.description)}">Excluir</button></td>
    </tr>`).join("");
}

function openDialog() {
  elements.error.textContent = "";
  elements.form.reset();
  document.querySelector("#date").value = new Date().toISOString().slice(0, 10);
  elements.dialog.showModal();
  document.querySelector("#description").focus();
}

document.querySelector("#open-transaction").addEventListener("click", openDialog);
document.querySelector("#close-dialog").addEventListener("click", () => elements.dialog.close());
document.querySelector("#cancel-dialog").addEventListener("click", () => elements.dialog.close());
elements.search.addEventListener("input", renderTransactions);
elements.typeFilter.addEventListener("change", renderTransactions);

elements.form.addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(elements.form));
  try {
    transactions.push(Finance.normalizeTransaction(data));
    persist();
    render();
    elements.dialog.close();
  } catch (error) {
    elements.error.textContent = error.message;
  }
});

elements.list.addEventListener("click", event => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;
  transactions = transactions.filter(item => item.id !== button.dataset.delete);
  persist();
  render();
});

document.querySelector("#restore-demo").addEventListener("click", () => {
  transactions = [...demoTransactions];
  persist();
  elements.search.value = "";
  elements.typeFilter.value = "all";
  render();
});

render();
