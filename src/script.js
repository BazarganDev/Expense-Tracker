// DOM
const envelopesElement = document.getElementById("envelopes");
const salaryInput = document.getElementById("monthly-salary-input");
const targetInput = document.getElementById("target-input");
const displayIncome = document.getElementById("displayIncome");
const expenseEnvelope = document.getElementById("expenseEnvelope");
const expenseAmount = document.getElementById("expenseAmount");
const targetFill = document.getElementById("target-fill");
const targetText = document.getElementById("target-text");
const savingsTotal = document.getElementById("savings-total");

// Buttons
const setEnvelopesBtn = document.getElementById("set-envelopes-btn");
const resetBtn = document.getElementById("reset-envelopes-btn");
const submitExpenseBtn = document.getElementById("submitExpenseBtn");
const exportCSVReportBtn = document.getElementById("export-csv-report-btn");

// Data model with default split
const DEFAULT = {
    salary: 7000000,
    target: 200000000,
    split: {
        needs: 3500000,     // 50% of salary
        wants: 2100000,     // 30% of salary
        savings: 1400000,   // 20% of salary
    },
    balances: {
        needs: 3500000,     // 50% of salary
        wants: 2100000,     // 30% of salary
        savings: 1400000,   // 20% of salary
    },
    totalSavings: 0,
};

// Expense State
let state = load() || structuredClone(DEFAULT);

// Readable Numbers
function formatNumber(n) {
    return n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
}

// Save Data
function save() {
    localStorage.setItem("expense_state", JSON.stringify(state));
}

// Load Expenses
function load() {
    try {
        return JSON.parse(localStorage.getItem("expense_state"));
    } catch (error) {
        return null;
    }
}

// Helper Functions
function labelOf(key) {
    const labels = {
        savings: "savings",
        needs: "needs",
        wants: "wants",
    };
    return labels[key];
}

function colorOf(key) {
    const colors = {
        savings: "bg-gradient-to-r from-red-500 to-green-500",
        needs: "bg-gradient-to-r from-red-500 to-green-500",
        wants: "bg-gradient-to-r from-red-500 to-green-500",
    };
    return colors[key];
}

// Render Envelopes
function renderEnvelopes() {
    envelopesElement.innerHTML = "";
    for (let e of ["savings", "needs", "wants"]) {
        const balance = state.balances[e];
        const total = state.split[e];
        const percentage = Math.min(100, Math.round((balance / total) * 100));
        const envelopeCard = document.createElement("div");
        envelopeCard.className =
            "env bg-white/5 backdrop-blur-sm border-white/10 rounded-xl p-3";
        envelopeCard.innerHTML = `
        <h3 class="text-sm font-semibold mb-1">${labelOf(e)}</h3>
        <div class="text-xs text-slate-400 mb-2">${formatNumber(
            balance
        )} / ${formatNumber(total)} T</div>
        <div class="w-full h-2 bg-white/10 rounded-lg overflow-hidden mb-2">
            <div class="h-full rounded-lg transition-all ${colorOf(
                e
            )}" style="width: ${percentage}"></div>
        </div>
        <div class="flex gap-2">
            <button
                class="incrementation bg-green-500 text-[#042342] font-semibold rounded-lg px-2 py-1 text-xs hover:bg-green-700"
                data-key="${e}">+ Increase
            </button>
            <button
                class="decrementation bg-rose-500 text-[#042342] font-semibold rounded-lg px-2 py-1 text-xs hover:bg-rose-700"
                data-key="${e}--dec">- Decrease
            </button>
        </div>`;
        envelopesElement.appendChild(envelopeCard);
    }
    displayIncome.textContent = formatNumber(state.salary);
    targetText.textContent = `${formatNumber(state.totalSavings)} / ${formatNumber(state.target)}`;
    const progress = Math.min(100, Math.round((state.totalSavings / state.target) * 100));
    targetFill.style.width = `${progress}%`;
    savingsTotal.textContent = `${formatNumber(state.totalSavings)}`;
    document.querySelectorAll(".env button").forEach((b) => {
        b.addEventListener("click", (e) => {
            // TODO: Incrementation / Decrementation
            alert("This button will be functional soon...");
        });
    });
}

function changeBalance(envKey, delta) {
    state.balances[envKey] = Math.max(0, state.balances[envKey] + delta);
    if (envKey === "savings" && delta > 0) {
        state.totalSavings += delta;
    }
    save();
    renderEnvelopes();
}

function applySplit() {
    const salary = Math.max(0, parseInt(salaryInput.value) || DEFAULT.salary);
    state.salary = salary;
    const target = Math.max(0, parseInt(targetInput.value) || DEFAULT.target);
    state.target = target;
    const needs = Math.max(Math.round(salary * 0.5), 3500000);
    const wants = Math.max(Math.round(salary * 0.3), 2100000);
    const savings = Math.max(Math.round(salary * 0.2), 1400000);
    state.split = { needs, wants, savings };
    state.balances = { ...state.split };
    save();
    renderEnvelopes();
}

setEnvelopesBtn.addEventListener("click", applySplit);
resetBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset the data?")) {
        localStorage.removeItem("expense_state");
        state = structuredClone(DEFAULT);
        save();
        renderEnvelopes();
    }
});

submitExpenseBtn.addEventListener("click", () => {
    const expense = expenseEnvelope.value;
    const amount = parseInt(expenseAmount.value);
    if (!amount || amount <= 0) {
        alert("Enter expense amount!");
        return;
    }
    if (expense === "savings") {
        state.totalSavings += amount;
        state.balances.savings += amount;
    } else {
        state.balances[expense] = Math.max(0, state.balances[expense] - amount);
    }
    expenseAmount.value = "";
    save();
    renderEnvelopes();
});

exportCSVReportBtn.addEventListener("click", () => {
    // TODO: Export data as a CSV file
    alert("This button will be functional soon...");
});

renderEnvelopes();
