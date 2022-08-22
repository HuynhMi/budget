// Income Class
class Income {
    constructor(name, amount, type) {
        this.name = name;
        this.amount = amount;
        this.type = type;
    }
}

//Expenses Class
class Expenses {
    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
        this.date = this.getDate();
        this.time = this.getTime();
    }
    
    getDate() {
        const date = new Date();
        let [dd,mm,yyyy] = [date.getDate(), date.getMonth(), date.getFullYear()]
        const arrMonths = ['January', 'February', 'Match', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];
        mm = arrMonths[mm];
        dd = dd < 10 ? `0${dd}` : dd;
        return `${dd} ${mm}, ${yyyy}`;
    }

    getTime() {
        const date = new Date();
        let [hh, mm] = [date.getHours(), date.getMinutes()];
        mm = mm < 10 ? `0${mm}` : mm;
        return `${hh}:${mm}`;
    }
   
}

// UI class
class UI {
    static incomesTotal = 0;
    static expensesTotal = 0;
    static remaining = 0;
    static display() {
        // display income
        const incomes = [
            {
                name: "Income 1",
                amount: 12,
                type: 'fixed'
            },
            {
                name: "Income 2",
                amount: 12.33,
                type: 'fixed'
            }
        ];

        incomes.forEach(income => {
            UI.addIncomeToList(income);
            UI.calculateIncomeAmount(income.amount);
        });
        
        // display expenses
        const expenses = [
            {
                name: "Expenses 1",
                amount: 2.33,
                date: '22-08-2022',
                time: '9:24'
            },
            {
                name: "Expenses 2",
                amount: 12.33,
                date: '22-08-2022',
                time: '9:24'
            }
        ];

        expenses.forEach(expense => {
            UI.addExpensesToList(expense);
            UI.calculateExpenseAmount(expense.amount);
        });

        UI.calculateRemaining();
    }

    static addIncomeToList(income) {
        const list = document.querySelector('.income-list');
        const item = document.createElement('li');
        item.classList.add('income-item');
        item.innerHTML = `
            <span class="income-item__name">${income.name}</span>
            <span class="income-item__number">$${income.amount}</span>
            <span class="income-item__btn income-item__btn--edit" title="edit">
                <img src="./assets/images/edit.png" alt="" class="income-item__btn-img">
            </span>
            <span class="income-item__btn income-item__btn--delete" title="delete">
                <img src="./assets/images/delete.png" alt="" class="income-item__btn-img">
            </span>
        `;
        list.appendChild(item);
    }

    static addExpensesToList(expense) {
        const list = document.querySelector('.transaction-list');
        const item = document.createElement('li');
        item.classList.add('transaction-item');
        item.innerHTML = `
            <div class="transaction-item__header">
                <span class="transaction-item__name">${expense.name}</span>
                <span class="transaction-item__number">$${expense.amount}</span>
            </div>
            <div class="transaction-item__footer">
                <span class="transaction-item__dater">${expense.date}</span>
                <span class="transaction-item__timer">${expense.time}</span>
                <div class="transaction-item-control">
                <img src="./assets/images/edit.png" alt="" class="transaction-item-control__btn-img transaction-item__btn-edit">
                <img src="./assets/images/delete.png" alt="" class="transaction-item-control__btn-img transaction-item__btn-delete">
                </div>
            </div>
        `;
        list.appendChild(item);
    }

    static calculateIncomeAmount(amount) {
        console.log(amount);
        UI.incomesTotal = Number(UI.incomesTotal + amount).toFixed(2) * 1;
        document.querySelector('.income__amount').innerHTML = '$' + UI.incomesTotal;
    }

    static calculateExpenseAmount(amount) {
        UI.expensesTotal = Number(UI.expensesTotal + amount).toFixed(2) * 1;
        document.querySelector('.expenses__amount').innerHTML = '$' + UI.expensesTotal;
    }

    static calculateRemaining() {
        UI.remaining = Number(UI.incomesTotal - UI.expensesTotal).toFixed(2)*1;
        document.querySelector('.remaining').innerHTML = '$' + UI.remaining;
    }

    static clearForm(classForm) {
        const form = document.querySelector('.'+classForm);
        form.querySelector('input[name="amount"]').value = '';
        form.querySelector('input[name="name"]').value = '';
        if (form.querySelector('select[name="type"]')) {
            form.querySelector('select[name="type"]').value = 'fixed';
        }
    }

    static deleteItem(el) {
        el.remove();
    }

    static deleteTransaction(target) {
        if(target.closest('.transaction-item__btn-delete')) {
            target.closest('.transaction-item').remove();
        }
    }

}


//Display event
document.addEventListener('DOMContentLoaded', function() {
    UI.display();
})

//Add
document.querySelector('.income-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const amount = this.querySelector('input[name="amount"]').value;
    const name = this.querySelector('input[name="name"]').value;
    const type = this.querySelector('select[name="type"]').value;
    const newIncome = new Income(name, amount, type);

    UI.addIncomeToList(newIncome);
    UI.clearForm('income-form');
    UI.calculateIncomeAmount(newIncome.amount*1);
    UI.calculateRemaining();
})

document.querySelector('.transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const amount = this.querySelector('input[name="amount"]').value;
    const name = this.querySelector('input[name="name"]').value;

    const newExpense = new Expenses(name, amount);
    
    UI.addExpensesToList(newExpense);
    UI.clearForm('transaction-form');
    UI.calculateExpenseAmount(newExpense.amount * 1);
    UI.calculateRemaining();
})

//Delete event
document.querySelector('.income-list').addEventListener('click', function(e) {
    if(e.target.closest('.income-item__btn--delete')) {
        const item = e.target.closest('.income-item');
        UI.deleteItem(item);

        const amountStr = item.querySelector('.income-item__number').innerHTML;
        const amountNum = amountStr.slice(1)*(-1);
        UI.calculateIncomeAmount(amountNum);
        UI.calculateRemaining();
        
    }
})

document.querySelector('.transaction-list').addEventListener('click', function(e) {
    if(e.target.closest('.transaction-item__btn-delete')) {
        const item = e.target.closest('.transaction-item');
        UI.deleteItem(item);

        const amountStr = item.querySelector('.transaction-item__number').innerHTML;
        const amountNum = amountStr.slice(1) * (-1);
        UI.calculateExpenseAmount(amountNum);
        UI.calculateRemaining();
    }
})

document.querySelector('.transaction-list').addEventListener('click', function(e) {
    UI.deleteTransaction(e.target);
})

//Update event
// Store Class
//Chart Draw
//Filter 