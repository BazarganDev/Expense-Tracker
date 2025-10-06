// DOM
const envelopesElement = document.getElementById("envelopes");
const salaryInput = document.getElementById("monthly-salary-input");
const targetInput = document.getElementById("target-input");
const setEnvelopesBtn = document.getElementById("set-envelopes-btn");
const resetBtn = document.getElementById("reset-envelopes-btn");
const displayIncome = document.getElementById("displayIncome");
const expenseEnvelope = document.getElementById("expenseEnvelope");
const expenseAmount = document.getElementById("expenseAmount");
const submitExpenseBtn = document.getElementById("submitExpenseBtn");
const targetFill = document.getElementById("target-fill");
const targetText = document.getElementById("target-text");
const savingsTotal = document.getElementById("savings-total");
const exportCSVReportBtn = document.getElementById("export-csv-report-btn");

// Expense State
let state = load();

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
