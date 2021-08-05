// ItemCtrl Controller 
const ItemCtrl = (function () {

  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  const data = {
    items: [
      /*      {
             id: 0,
             name: "steak",
             calories: 1200
           },
           {
             id: 1,
             name: "Eggs",
             calories: 200
           },
           {
             id: 2,
             name: "Ice Cream",
             calories: 400
           } */
    ],
    totalCalories: 0,
    currentItem: null
  };

  // public method
  return {
    getItems: function () {
      return data.items;
    },
    logData: function () {
      return data;
    },
    addItem: function (name, calories) {
      let ID;
      // generate ID automatic
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // convert calories to integer number
      calories = parseInt(calories);

      const newItem = new Item(ID, name, calories);

      data.items.push(newItem);

      return newItem;
    },
    calculateCalories: function () {
      let total = 0;
      data.items.forEach(element => {
        total += element.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },
    getItemByID:function(ID){
      let found =null;
      data.items.forEach(function(item){
        if(item.id===ID)
          found=item;
      });
      return found;
    },
    setCurrentItem:function(item){
      data.currentItem=item;
    }
  }
})();


//UI Controller
const UICtrl = (function () {

  let html = '';
  // UI Ellemts selectors 
  const UISelectors = {
    UIList: "#item-list",
    addItem: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    inputItemName: "#item-name",
    inputItemCalories: "#item-calories",
    calories: ".total-calories",
  }
  //public method
  return {
    paint: function (items) {
      items.forEach(item => {
        html += ` <li class="collection-item" id="item-${item.id}">
       <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
       <a href="#" class="secondary-content">
         <i class="edit-item fa fa-pencil"></i>
       </a>
     </li>`;
      });
      document.querySelector(UISelectors.UIList).innerHTML = html;
    },
    getUISelectors: function () {
      return UISelectors;
    },
    getInput: function () {
      return {
        name: document.querySelector(UISelectors.inputItemName).value,
        calories: document.querySelector(UISelectors.inputItemCalories).value
      }
    },
    paintNewItem: function (newItem) {

      html += ` <li class="collection-item" id="item-${newItem.id}">
       <strong>${newItem.name}: </strong> <em>${newItem.calories} Calories</em>
       <a href="#" class="secondary-content">
         <i class="edit-item fa fa-pencil"></i>
       </a>
     </li>`;

      document.querySelector(UISelectors.UIList).innerHTML = html;
    },
    clearInput: function () {
      document.querySelector(UISelectors.inputItemName).value = '';
      document.querySelector(UISelectors.inputItemCalories).value = '';
    },
    showCalories: function (totalCalories) {
      document.querySelector(UISelectors.calories).textContent = totalCalories;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addItem).style.display = 'inline';
    },
    showEditItem:function(name,calories){
      document.querySelector(UISelectors.inputItemName).value = name;
      document.querySelector(UISelectors.inputItemCalories).value = calories;
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addItem).style.display = 'none';
    }
  }
})();

// App Controller

const app = (function (ItemCtrl, UICtrl) {

  // add event lisnter 
  function loadEventLisnter() {
    // get UI selector from UI Controller
    const UISelectors = UICtrl.getUISelectors();

    // add item event listner
    document.querySelector(UISelectors.addItem).addEventListener('click', addItemSubmit);

    // edit item event lister
    document.querySelector(UISelectors.UIList).addEventListener('click', editItemSubmit);

  }


  // addItemSubmit function which add item to data structure 
  function addItemSubmit(e) {
    // get input value from UI Controller
    const inputItem = UICtrl.getInput();
    // check input value is not empty
    if (inputItem.name !== '' && inputItem.calories !== '') {

      const newItem = ItemCtrl.addItem(inputItem.name, inputItem.calories);

      UICtrl.paintNewItem(newItem);

      // clear input field
      UICtrl.clearInput();
      // update total calories
      const totalCalories = ItemCtrl.calculateCalories();
      //show calories in UI
      UICtrl.showCalories(totalCalories);
    } else {

    }

    e.preventDefault();
  }
  //edit item event handler
  function editItemSubmit(e) {
    if (e.target.classList.contains("edit-item")) {
      //get item ID
      const itemID = e.target.parentNode.parentNode.id;
      // split id
      const IDarr = itemID.split('-');
      const ID = parseInt(IDarr[1]);
      const editedItem = ItemCtrl.getItemByID(ID);

      //set current item 
      ItemCtrl.setCurrentItem(editedItem);
      //show edit item in input field
      UICtrl.showEditItem(editedItem.name,editedItem.calories);
     
    }
    e.preventDefault();
  }
  // public method
  return {
    init: function () {
      //clear edit satate
      UICtrl.clearEditState();
      //get items from data
      const items = ItemCtrl.getItems();

      // print items to UI 
      UICtrl.paint(items);
      //fire loadEvemtLisnter function
      loadEventLisnter();
      const totalCalories = ItemCtrl.calculateCalories();
      //show calories in UI
      UICtrl.showCalories(totalCalories);


    }
  }
})(ItemCtrl, UICtrl);

app.init();