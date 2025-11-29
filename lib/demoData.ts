import dayjs from "dayjs";
import { Transaction } from "./types";


export function demoData(count = 42): Transaction[] {
const cats = ["Food","Groceries","Transport","Subscriptions","Entertainment","Rent","Salary"];
const now = dayjs();
const arr: Transaction[] = [];
for (let i=0;i<count;i++){
const d = now.subtract(i, "day").format("YYYY-MM-DD");
const cat = cats[Math.floor(Math.random()*cats.length)];
const isIncome = cat === "Salary" && Math.random() > 0.4;
const amt = isIncome ? 2000 + Math.round(Math.random()*900) : -1 * Math.round(Math.random()*140 + 10);
arr.push({ id: Math.random().toString(36).slice(2,9), date: d, amount: amt, category: cat, note: isIncome?"Salary":"Expense"});
}
return arr;
}