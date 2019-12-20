//Budget Controller
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.total[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            //create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //Push it into our data structure
            data.allItems[type].push(newItem);

            //Return new element
            return newItem;
        },

        calculateBudget: function () {
            //calculate total income and expense
            calculateTotal('exp');
            calculateTotal('inc');
            //Calculate the budget: income - expense
            data.budget = data.total.inc - data.total.exp;

            // Calculate the percentage of income that we spend
            if(data.total.inc > 0 ){
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            }else{
                data.percentage = -1;
            }
        },

        getBudget:function(){
            return{
                budget:data.budget,
                totalIncome:data.total.inc,
                totalExpense:data.total.exp,
                percentage:data.percentage
            };
        },

        testing: function () {
            console.log(data);
        }
    }
})();

//UI Controller
var UIController = (function () {

    var DOMStrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //will be either inc or exp
                description: document.querySelector(DOMStrings.inputDesc).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;
            //Create HTML String with placeholder text

            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //Insert the HRML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function () {
            var fields, feildsArr;

            fields = document.querySelectorAll(DOMStrings.inputDesc + ', ' + DOMStrings.inputValue);

            feildsArr = Array.prototype.slice.call(fields);

            feildsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            feildsArr[0].focus();
        },

        getDomStrings: function () {
            return DOMStrings;
        }
    };

})();

//Global app controller
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListner = function () {

        var DOM = UICtrl.getDomStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function () {
        //1.Calculate the budget
        budgetCtrl.calculateBudget();
        //2.Return the budget
        var budget = budgetCtrl.getBudget();

        //3.Display the budget on the UI
        console.log(budget);

    };

    var ctrlAddItem = function () {
        var input, newItem;
        //1.Get the filed input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2.Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3.Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4. Clear the field;
            UICtrl.clearFields();

            //5. Calculate and update budget
            updateBudget();
        }
    };

    return {
        init: function () {
            console.log('APP has started');
            setupEventListner();
        }
    };




})(budgetController, UIController);

controller.init();
