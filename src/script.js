// DOM
const envelopesElement = document.getElementById("envelopes");
const salaryInput = document.getElementById("monthly-salary-input");
const targetInput = document.getElementById("target-input");
const displayIncome = document.getElementById("displayIncome");
const depositEnvelope = document.getElementById("depositEnvelope");
const depositAmount = document.getElementById("depositAmount");
const expenseEnvelope = document.getElementById("expenseEnvelope");
const expenseAmount = document.getElementById("expenseAmount");
const targetFill = document.getElementById("target-fill");
const targetText = document.getElementById("target-text");
const savingsTotal = document.getElementById("savings-total");

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
        savings: "Savings",
        needs: "Needs",
        wants: "Wants",
    };
    return labels[key];
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
    state.balances[expense] = Math.max(0, state.balances[expense] - amount);
    expenseAmount.value = "";
    save();
    renderEnvelopes();
});

renderEnvelopes();
