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
      return total;
    },
    updateItem: function (name, calories) {
      calories = parseInt(calories);
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id)
          item.name = name;
        item.calories = calories;
        found = item;
      });
      return found;
    },
    deleteItem: function(id){
      // Get ids
      const ids = data.items.map(function(item){
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function(){
      data.items = [];
    },
    getItemByID: function (ID) {
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === ID)
          found = item;
      });
      return found;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
  }
})();


//UI Controller
const UICtrl = (function () {

  let html = '';
  // UI Ellemts selectors 
  const UISelectors = {
    UIList: "#item-list",
    UIListItem: "#item-list li",
    addItem: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    clearBtn: ".clear-btn",
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
    showUpdatedItem: function (item) {

      let listItems = document.querySelectorAll(UISelectors.UIListItem);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });
    },
    hideList: function(){
      document.querySelector(UISelectors.UIList).style.display = 'none';
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
    showEditItem: function () {
      let item = ItemCtrl.getCurrentItem();
      document.querySelector(UISelectors.inputItemName).value = item.name;
      document.querySelector(UISelectors.inputItemCalories).value = item.calories;
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

    // update btn event listner
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdatedSubmit);
    //back btn event handler
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    // disaply enter key 
    document.addEventListener('keypress', e => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
      }
    });
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
      UICtrl.showEditItem();

    }
    e.preventDefault();
  }
  // update btn event handler 
  function itemUpdatedSubmit(e) {
    // get input value
    const itemInput = UICtrl.getInput();
    // update the item in data structure 
    const itemUpdated = ItemCtrl.updateItem(itemInput.name, itemInput.calories);
    //show updated item in UI
    UICtrl.showUpdatedItem(itemUpdated);
    // update total calories
    const totalCalories = ItemCtrl.calculateCalories();
    //show calories in UI
    UICtrl.showCalories(totalCalories);
    UICtrl.clearEditState();
    e.preventDefault();
  }

  // Delete button event
  const itemDeleteSubmit = function (e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.calculateCalories();
    // Add total calories to UI
    UICtrl.showCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  }


  // Clear items event
  const clearAllItemsClick = function () {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.calculateCalories();
    // Add total calories to UI
    UICtrl.showCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Hide UL
    UICtrl.hideList();

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