// DOM
const envelopesElement = document.getElementById("envelopes");
const salaryInput = document.getElementById("monthly-salary-input");
const targetInput = document.getElementById("target-input");
const displayIncome = document.getElementById("displayIncome");
const depositEnvelope = document.getElementById("depositEnvelope");
const depositAmount = document.getElementById("depositAmount");
const expenseEnvelope = document.getElementById("expenseEnvelope");
const expenseAmount = document.getElementById("expenseAmount");
const expenseDescription = document.getElementById("expenseDescription");
const targetFill = document.getElementById("target-fill");
const targetText = document.getElementById("target-text");
const savingsTotal = document.getElementById("savings-total");
const expenseLogs = document.getElementById("expenseLogs");
const clearLogsBtn = document.getElementById("clearLogsBtn");

// Buttons
const setEnvelopesBtn = document.getElementById("set-envelopes-btn");
const resetBtn = document.getElementById("reset-envelopes-btn");
const submitDepositBtn = document.getElementById("submitDepositBtn");
const submitExpenseBtn = document.getElementById("submitExpenseBtn");

// Data model with default split
const DEFAULT = {
    salary: 0,
    target: 200000000,
    split: {
        needs: 0, // 50% of salary
        wants: 0, // 30% of salary
        savings: 0, // 20% of salary
    },
    balances: {
        needs: 0, // 50% of salary
        wants: 0, // 30% of salary
        savings: 0, // 20% of salary
    },
    totalSavings: 0,
    expenseLogs: [], // Array to store expense logs
};

// Expense State
let state = load() || structuredClone(DEFAULT);

// Ensure expenseLogs exists for backward compatibility
if (!state.expenseLogs) {
    state.expenseLogs = [];
}

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
        savings: "Savings",
        needs: "Needs",
        wants: "Wants",
    };
    return labels[key];
}

// Log expense function
function logExpense(envelope, amount, description) {
    const logEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        envelope: envelope,
        amount: amount,
        description: description || "No description",
        envelopeLabel: labelOf(envelope),
    };
    state.expenseLogs.unshift(logEntry); // Add to beginning of array (most recent first)
    save();
    renderExpenseLogs();
}

// Render expense logs
function renderExpenseLogs() {
    if (state.expenseLogs.length === 0) {
        expenseLogs.innerHTML =
            '<div class="text-sm text-slate-400 text-center py-4">No expenses logged yet</div>';
        return;
    }

    expenseLogs.innerHTML = state.expenseLogs
        .map(
            (log) => `
        <div class="bg-white/5 rounded-lg p-3 mb-2 border border-white/10">
            <div class="flex justify-between items-start mb-1">
                <span class="text-sm font-semibold text-${
                    log.envelope === "needs" ? "blue" : "purple"
                }-400">
                    ${log.envelopeLabel}
                </span>
                <span class="text-sm font-bold text-red-400">-${formatNumber(
                    log.amount
                )} T</span>
            </div>
            <div class="text-xs text-slate-400 mb-1">${log.timestamp}</div>
            <div class="text-sm text-slate-300">${log.description}</div>
        </div>
    `
        )
        .join("");
}

// Percentage-based Coloring
function getProgressColor(p) {
    if (p < 30) {
        return "bg-red-500";
    }
    if (p < 70) {
        return "bg-yellow-400";
    }
    return "bg-green-500";
}

// Render Envelopes
function renderEnvelopes() {
    envelopesElement.innerHTML = "";
    for (let e of ["savings", "needs", "wants"]) {
        const balance = state.balances[e];
        const total = state.split[e];
        const percentage =
            Math.min(100, Math.round((balance / total) * 100)) || 0;
        const envelopeCard = document.createElement("div");
        envelopeCard.className =
            "env bg-white/5 backdrop-blur-sm border-white/10 rounded-xl p-3";
        envelopeCard.innerHTML = `
        <h3 class="text-sm font-semibold mb-1">${labelOf(e)}</h3>
        <div class="text-xs text-slate-400 mb-2">${formatNumber(
            balance
        )} / ${formatNumber(total)} T</div>
        <div class="w-full h-2 bg-white/10 rounded-lg overflow-hidden mb-2">
            <div class="h-full rounded-lg transition-all ${getProgressColor(
                percentage
            )}" style="width: ${percentage}%"></div>
        </div>`;
        envelopesElement.appendChild(envelopeCard);
    }
    displayIncome.textContent = formatNumber(state.salary);
    targetText.textContent = `${formatNumber(
        state.totalSavings
    )} / ${formatNumber(state.target)}`;
    const progress = Math.min(
        100,
        Math.round((state.totalSavings / state.target) * 100)
    );
    targetFill.style.width = `${progress}%`;
    savingsTotal.textContent = `${formatNumber(state.totalSavings)}`;
    document.querySelectorAll(".env button").forEach((b) => {
        b.addEventListener("click", (e) => {
            // TODO: Incrementation / Decrementation
            Swal.fire({
                title: "Coming Soon",
                text: "This button will be functional soon...",
                icon: "info",
                confirmButtonText: "OK",
                background: "#0f172a",
                color: "#e2e8f0",
                confirmButtonColor: "#3b82f6",
                customClass: {
                    popup: "swal2-popup-custom",
                    title: "swal2-title-custom",
                    content: "swal2-content-custom",
                },
            });
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
    const target = Math.max(0, parseInt(targetInput.value) || DEFAULT.target);
    const needs = Math.max(Math.round(salary * 0.5), 0);
    const wants = Math.max(Math.round(salary * 0.3), 0);
    const savings = Math.max(Math.round(salary * 0.2), 0);
    state.salary = salary;
    state.target = target;
    state.split = { needs, wants, savings };
    state.balances = { needs, wants, savings: 0 };
    save();
    renderEnvelopes();
}

setEnvelopesBtn.addEventListener("click", applySplit);
resetBtn.addEventListener("click", () => {
    Swal.fire({
        title: "Reset Data",
        text: "Are you sure you want to reset all data? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, reset it!",
        cancelButtonText: "Cancel",
        background: "#0f172a",
        color: "#e2e8f0",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        customClass: {
            popup: "swal2-popup-custom",
            title: "swal2-title-custom",
            content: "swal2-content-custom",
        },
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("expense_state");
            state = structuredClone(DEFAULT);
            salaryInput.value = "0";
            targetInput.value = "0";
            save();
            renderEnvelopes();
        }
    });
});

submitDepositBtn.addEventListener("click", () => {
    const deposit = depositEnvelope.value;
    const amount = parseInt(depositAmount.value);
    if (!amount || amount <= 0) {
        Swal.fire({
            title: "Invalid Amount",
            text: "Please enter a valid deposit amount!",
            icon: "warning",
            confirmButtonText: "OK",
            background: "#0f172a",
            color: "#e2e8f0",
            confirmButtonColor: "#3b82f6",
            customClass: {
                popup: "swal2-popup-custom",
                title: "swal2-title-custom",
                content: "swal2-content-custom",
            },
        });
        return;
    }
    state.totalSavings += amount;
    state.balances.savings += amount;
    depositAmount.value = "";
    save();
    renderEnvelopes();
});

submitExpenseBtn.addEventListener("click", () => {
    const expense = expenseEnvelope.value;
    const amount = parseInt(expenseAmount.value);
    const description = expenseDescription.value.trim();

    if (!amount || amount <= 0) {
        Swal.fire({
            title: "Invalid Amount",
            text: "Please enter a valid expense amount!",
            icon: "warning",
            confirmButtonText: "OK",
            background: "#0f172a",
            color: "#e2e8f0",
            confirmButtonColor: "#3b82f6",
            customClass: {
                popup: "swal2-popup-custom",
                title: "swal2-title-custom",
                content: "swal2-content-custom",
            },
        });
        return;
    }

    // Check if there's enough balance
    if (state.balances[expense] < amount) {
        Swal.fire({
            title: "Insufficient Balance",
            text: `You don't have enough balance in ${labelOf(
                expense
            )} envelope!`,
            icon: "warning",
            confirmButtonText: "OK",
            background: "#0f172a",
            color: "#e2e8f0",
            confirmButtonColor: "#3b82f6",
            customClass: {
                popup: "swal2-popup-custom",
                title: "swal2-title-custom",
                content: "swal2-content-custom",
            },
        });
        return;
    }

    // Update balance
    state.balances[expense] = Math.max(0, state.balances[expense] - amount);

    // Log the expense
    logExpense(expense, amount, description);

    // Clear form
    expenseAmount.value = "";
    expenseDescription.value = "";

    save();
    renderEnvelopes();

    // Show success message
    Swal.fire({
        title: "Expense Added",
        text: `Expense of ${formatNumber(amount)} T logged successfully!`,
        icon: "success",
        confirmButtonText: "OK",
        background: "#0f172a",
        color: "#e2e8f0",
        confirmButtonColor: "#10b981",
        customClass: {
            popup: "swal2-popup-custom",
            title: "swal2-title-custom",
            content: "swal2-content-custom",
        },
    });
});

// Clear logs functionality
clearLogsBtn.addEventListener("click", () => {
    Swal.fire({
        title: "Clear Expense Logs",
        text: "Are you sure you want to clear all expense logs? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, clear them!",
        cancelButtonText: "Cancel",
        background: "#0f172a",
        color: "#e2e8f0",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        customClass: {
            popup: "swal2-popup-custom",
            title: "swal2-title-custom",
            content: "swal2-content-custom",
        },
    }).then((result) => {
        if (result.isConfirmed) {
            state.expenseLogs = [];
            save();
            renderExpenseLogs();
        }
    });
});

renderEnvelopes();
renderExpenseLogs();
