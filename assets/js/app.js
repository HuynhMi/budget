const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

class STORE {
    constructor (name) {
        this.name = name;
    }

    getConfig() {
        return JSON.parse(localStorage.getItem(this.name)) || [];
    }

    setConfig(data) {
        localStorage.setItem(this.name, JSON.stringify(data));
    }
}

class INCOME {
    static config = new STORE('INCOME_KEY');

    static incomes;

    static loadConfig() {
        this.incomes = this.config.getConfig();
    }

    static filterValue = $('input[name="filter-income-type"]:checked').value;

    static getTotal() {
       return this.incomes.reduce(function(total, income) {
            return total + income.amount*1;
        }, 0);
    }

    static displayTotal() {
        $('.income__amount').innerHTML = '$' + this.getTotal();
    }

    static addToList() {
        const list = document.querySelector('.income-list');
        list.innerHTML = '';
        this.incomes.forEach((income, index) => {
            if (this.filterValue === 'all' || this.filterValue === income.type) {
                const li = document.createElement('li');
                li.classList.add('income-item');
                li.setAttribute('data-id', index);
                li.innerHTML = `
                    <span class="income-item__name">${income.name}</span>
                    <span class="income-item__number">$${income.amount}</span>
                    <span class="income-item__btn income-item__btn--edit" title="edit">
                        <img src="./assets/images/edit.png" alt="" class="income-item__btn-img">
                    </span>
                    <span class="income-item__btn income-item__btn--delete" title="delete">
                        <img src="./assets/images/delete.png" alt="" class="income-item__btn-img">
                    </span>
                `;
                list.appendChild(li);
            }
            
        })
    }

    static handleFilter(value) {
        this.filterValue = value;
        this.addToList();
    }

    static handleDelete(index) {
        this.incomes.splice(index,1);
        console.log(this.config.name);
        this.config.setConfig(this.incomes);
        this.display();
    }

    static handleUpdate(id) {
        const form = $('.income-form');

        const updateObj = this.incomes[id];
        form.elements['id'].value = id;
        form.elements['name'].value = updateObj.name;
        form.elements['amount'].value = updateObj.amount;
        form.elements['type'].value = updateObj.type;

        form.classList.add('open');
    }

    static add(data) {
        this.incomes.push(data);
        this.config.setConfig(this.incomes);
        this.display();
    }

    static update(data) {
        const {id,...obj} = data;
        this.incomes[id] = obj;
        this.config.setConfig(this.incomes);
        this.display();
    }

    static display() {
        this.loadConfig();
        this.addToList();
        this.displayTotal();
    }

}

class EXPENSE {
    constructor(name, amount) {
        this.id = EXPENSE.expenses.length + 1;
        this.name = name;
        this.amount = amount;
        this.time = new Date().getTime();
    };

    static config = new STORE('EXPENSE_KEY');

    static expenses;

    static loadConfig() {
        this.expenses = this.config.getConfig();
    }

    static filterValue = $('#transaction-filter').value;

    static getTimer(stamp) {
        const date = new Date(stamp);
        let [dd,mm, yyyy, h, m] = [date.getDate(), date.getMonth(), date.getFullYear(), date.getHours(), date.getMinutes()];
        const arrMonthStr = ['Jan', 'Feb', 'Match', 'April', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', "Sept"];
        mm = arrMonthStr[mm];
        dd = dd < 10 ? '0'+dd : dd;
        m = m < 10 ? '0'+m : m;
        return `${dd} ${mm}, ${yyyy}  ${h}:${m}`;
    }

    static getTotal() {
       return this.expenses.reduce(function(total, expense) {
            return Number(total + expense.amount*1).toFixed(2)*1;
        }, 0);
    }

    static displayTotal() {
        $('.expenses__amount').innerHTML = '$' + this.getTotal();
    }

    static addToList() {
        const list = document.querySelector('.transaction-list');
        list.innerHTML = '';

        if (this.filterValue === 'newest') {
            this.expenses = this.expenses.sort((a,b) => a.time - b.time);
        } else if(this.filterValue === 'oldest') {
            this.expenses = this.expenses.sort((a,b) => b.time - a.time);
        }

        this.expenses.forEach(expense => {
            const li = document.createElement('li');
            li.classList.add('transaction-item');
            li.setAttribute('data-id', expense.id);
            li.innerHTML = `
                <div class="transaction-item__header">
                    <span class="transaction-item__name">${expense.name}</span>
                    <span class="transaction-item__number">$${expense.amount}</span>
                </div>
                <div class="transaction-item__footer">
                    <span class="transaction-item__timer">${EXPENSE.getTimer(expense.time)}</span>
                    <div class="transaction-item-control">
                        <img src="./assets/images/edit.png" alt="" class="transaction-item-control__btn-img transaction-item__btn-edit">
                        <img src="./assets/images/delete.png" alt="" class="transaction-item-control__btn-img transaction-item__btn-delete">
                    </div>
                </div>
            `;
            list.appendChild(li);
        });
    }

    static handleFilter(value) {
        this.filterValue = value;
        this.addToList();
    }

    static handleDelete(id) {
        const indexDelete = this.expenses.findIndex(expense => expense.id == id);
        this.expenses.splice(indexDelete, 1);
        this.config.setConfig(this.expenses);
        this.display();
    }

    static handleUpdate(id) {
        const form = $('.transaction-form');

        const indexUpdate = this.expenses.findIndex(expense => expense.id == id);
        const updateObj = this.expenses[indexUpdate];
        form.elements['id'].value = id;
        form.elements['name'].value = updateObj.name;
        form.elements['amount'].value = updateObj.amount;

        form.classList.add('open');
    }

    static add(data) {
        this.expenses.push(data);
        this.config.setConfig(this.expenses);
        this.display();
    }

    static update(data) {
        const indexUpdate = this.expenses.findIndex(expense =>  expense.id == data.id);
        this.expenses[indexUpdate] = data;
        this.config.setConfig(this.expenses);
        this.display();
    }

    static display() {
        this.loadConfig();
        this.addToList();
        this.displayTotal();
    }
}

class FORM {
    static getValue(form) {
        const inputs = form.querySelectorAll('.form__input');
        const value = [...inputs].reduce(function(total, input) {
            total[input.name] = input.value;
            return total;
        }, {});
        return value;
    }
}

class APP {
    static display() {
        INCOME.display();
        EXPENSE.display();
        this.displayRemain();
    }

    static displayRemain() {
        $('.remaining').innerHTML = '$' + this.getRemain();
    }

    static getRemain() {
        return Number(INCOME.getTotal() - EXPENSE.getTotal()).toFixed(2)*1;
    }

    static handleIncomeEvent() {
        $$('input[name="filter-income-type"]').forEach(input => {
            input.onclick = function() {
                const value = this.value;
                INCOME.handleFilter(value);
            }
        })

        $('#btn-open-income-form').onclick = function() {
            this.classList.add('hide');
            const form = $('.income-form');
            form.querySelector('.form__btn--submit').innerHTML = 'Add New';
            form.reset();
            form.classList.add('open');
        };

        $('#btn-close-income-form').onclick = function(e) {
            e.preventDefault()
            $('#btn-open-income-form').classList.remove('hide');
            $('.income-form').classList.remove('open');
        }


        $('.income-list').addEventListener('click', function(e) {
            const li = e.target.closest('.income-item');
            const id = li.dataset.id;
            if (e.target.closest('.income-item__btn--delete')) {
                INCOME.handleDelete(id);
                APP.displayRemain();
                APP.handleDrawChart();
            } else if (e.target.closest('.income-item__btn--edit')) {
                INCOME.handleUpdate(id);
                $('#btn-submit-income-form').innerHTML = 'Update';
                $('#btn-open-income-form').classList.remove('hide');
            }
        })

        $('.income-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const obj = FORM.getValue(this);
            if (obj.id === 'New') {
                delete obj.id;
                INCOME.add(obj);
                $('.income-form').classList.remove('open');
                $('#btn-open-income-form').classList.remove('hide');
            } else {
                INCOME.update(obj);
                $('.income-form').classList.remove('open');
            }
            APP.displayRemain();
            APP.handleDrawChart();
        })

    }

    static handleExpenseEvent() {
        $('#transaction-filter').onchange = function() {
            const valueFilter = this.value;
            EXPENSE.handleFilter(valueFilter);
        }

        $('#btn-open-transaction-form').onclick = function() {
            this.classList.add('hide');
            const form = $('.transaction-form');
            form.reset();
            form.classList.add('open');
            form.querySelector('.form__btn--submit').innerHTML = 'Add New';
        }

        $('#btn-close-transaction-form').onclick = function(e) {
            e.preventDefault();
            $('#btn-open-transaction-form').classList.remove('hide');
            $('.transaction-form').classList.remove('open');
        }

        $('.transaction-list').addEventListener('click', function(e) {
            const li = e.target.closest('.transaction-item');
            const id = li.dataset.id;
            if (e.target.closest('.transaction-item__btn-delete')) {
                EXPENSE.handleDelete(id);
                APP.displayRemain();
                APP.handleDrawChart();
            } else if (e.target.closest('.transaction-item__btn-edit')) {
                EXPENSE.handleUpdate(id);
                $('#btn-submit-transaction-form').innerHTML = 'Update';
                $('#btn-open-transaction-form').classList.remove('hide');
            }
        })

        $('.transaction-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const obj = FORM.getValue(this);
            const newTransaction = new EXPENSE(obj.name, obj.amount);
            
            if (obj.id === 'New') {
                EXPENSE.add(newTransaction);
                $('.transaction-form').classList.remove('open');
                $('#btn-open-transaction-form').classList.remove('hide');
            } else {
                newTransaction.id = obj.id;
                EXPENSE.update(newTransaction);
                $('.transaction-form').classList.remove('open');
            }
            APP.displayRemain();
            APP.handleDrawChart();
        })
    }

    static handleEvent() {
        const _this = this;
        $('.welcome-btn').onclick = function() {
            $('.app').classList.remove('app--welcome');
            $('.app').classList.add('app--dashboard');
        }

        $('.dashboard-control__btn--clear-all').onclick = function() {
            localStorage.removeItem(INCOME.config.name);
            localStorage.removeItem(EXPENSE.config.name);
            _this.display();
            _this.handleDrawChart();
        }
    }

    static drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color, info) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.font = '16px Helvetica, Calibri';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        const midPoint = (startAngle + endAngle)/2;
        const x = Math.cos(midPoint)*radius*0.5 + centerX;
        const y = Math.sin(midPoint)*radius*0.5 + centerY;
        ctx.fillText( `${info.name} ${info.percent}%`,x, y);
        ctx.closePath();
    }

    static handleDrawChart() {
        const total = INCOME.getTotal();
        if(total == 0) {
            $('.dashboard-chart-body').innerHTML = 'No chart';
            return;
        } else {
            $('.dashboard-chart-body').innerHTML = '';
        }

        const canvas = document.createElement('canvas');
        canvas.height = 300;
        canvas.width = 300;
        const ctx = canvas.getContext('2d');
        
        let expensePercent = EXPENSE.getTotal() / total;
        const expense_angle_start = 0;
        const expense_angle_end = expensePercent * 2 * Math.PI;
        const expenseInfo = {'name': 'Expense', 'percent': Number(expensePercent/0.01).toFixed(0)};
        this.drawPieSlice(ctx, canvas.width/2, canvas.height/2, canvas.height/2, expense_angle_start, expense_angle_end, '#f89263', expenseInfo);
        
        const remainPercent = this.getRemain() / total;
        const remain_angle_start = expense_angle_end;
        const remain_angle_end = remainPercent * 2 * Math.PI + remain_angle_start;
        const remainInfo = {'name': 'Remain', 'percent': Number(remainPercent/0.01).toFixed(0)}
        this.drawPieSlice(ctx, canvas.width/2, canvas.height/2, canvas.height/2, remain_angle_start, remain_angle_end, '#000', remainInfo);

        $('.dashboard-chart-body').appendChild(canvas);
    }

    static start() {
        this.display();
        this.handleIncomeEvent();
        this.handleExpenseEvent();
        this.handleEvent();
        this.handleDrawChart();
    }

}

APP.start();

