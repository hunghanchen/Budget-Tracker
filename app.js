// var budgetController = (function () {
//     var x = 23;
//     var add = function (a) {
//         return x + a;
//     }
//     return{
//         publicTest: function(b){
//             return add(b);
//         }
//     }
// })();

// var controller = (function(budgectCtrl,UICtrl){
//     var z = budgectCtrl.publicTest(5);
//     return {
//         anotherPublic: function(){
//             console.log(z);
//         }
//     }
// })(budgetController,UIController);

//Budget controller
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

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        }

    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            //Create new ID
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
            data.allItems[type].push(newItem);
            return newItem;
        },
        testing: function () {
            console.log(data);
        }
    };
})();



var UIController = (function () {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inptValue: '.add__value',
        inputBtn: '.add__btn'
    }
    return {
        getinput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inptValue).value
            };
        },
        addListItem: function (obj, type) {
            // Create HTML String with placeholder text
            // Replace the placeholder text with some actual data
            //Insert the HTML into the DOM
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();
//Global app controller
var controller = (function (budgectCtrl, UICtrl) {
    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };
    var ctrlAddItem = function () {
        var input, newItem;
        //1. Get the filed input data
        input = UICtrl.getinput();
        //2. Add the item to the budget controller
        newItem = budgectCtrl.addItem(input.type, input.description, input.value);
        //3. Add the item to the UI
        //4. Calculate the budget
        //5. Display the budget on the UI
    };
    return {
        init: function () {
            console.log('Application has started.');
            setupEventListeners();
        }
    }


})(budgetController, UIController);

controller.init();