// Get elements
const form = document.getElementById('entry-form');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const typeInput = document.getElementById('type');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const balanceEl = document.getElementById('balance');
const recordList = document.getElementById('recordList');
const resetBtn = document.getElementById('reset-btn');
const filterRadios = document.querySelectorAll('input[name="filter"]');

// Transactions data
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Render all
function render() {
  recordList.innerHTML = '';
  
  let totalIncome = 0;
  let totalExpense = 0;

  const selectedFilter = document.querySelector('input[name="filter"]:checked').value;
  const filtered = transactions.filter(t => selectedFilter === 'all' || t.type === selectedFilter);

  filtered.forEach((t, index) => {
    const li = document.createElement('li');
    li.classList.add('record', t.type);
    li.innerHTML = `
      <div>
        <strong>${t.desc}</strong> <br>
        <small>${t.date}</small>
      </div>
      <div>
        ₹${t.amount}
        <button onclick="deleteTransaction(${index})">✖</button>
      </div>
    `;
    recordList.appendChild(li);
  });

  transactions.forEach(t => {
    if (t.type === 'income') totalIncome += t.amount;
    else totalExpense += t.amount;
  });

  totalIncomeEl.textContent = `₹${totalIncome}`;
  totalExpenseEl.textContent = `₹${totalExpense}`;
  balanceEl.textContent = `₹${totalIncome - totalExpense}`;

  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Add transaction
form.addEventListener('submit', e => {
  e.preventDefault();

  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value;
  const type = typeInput.value;

  if (!desc || !amount || !date) return alert('Please fill all fields');

  transactions.push({ desc, amount, date, type });
  form.reset();
  render();
});

// Delete transaction
function deleteTransaction(index) {
  transactions.splice(index, 1);
  render();
}

// Reset all
resetBtn.addEventListener('click', () => {
  if (confirm('Clear all transactions?')) {
    transactions = [];
    render();
  }
});

// Filter
filterRadios.forEach(r => r.addEventListener('change', render));

// Initial render
render();
