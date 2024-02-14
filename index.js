import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
	getDatabase,
	ref,
	push,
	onValue,
	remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
	databaseURL: "https://realtime-database-5f6b9-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const clearBtn = document.getElementById("clear-button");
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function () {
	let inputValue = inputFieldEl.value;
	if (inputValue) {
		push(shoppingListInDB, inputValue);

		clearInputFieldEl();

		// appendItemToShoppingListEl(inputValue);
	}
});

// clearBtn.addEventListener("click", function () {
// 	if (confirm("Delete All?"));
// 	clearDB();
// });

function deleteItem(itemId) {
	const itemRef = ref(database, "shoppingList/" + itemId); // Use getRef to obtain a reference
	remove(itemRef)
		.then(() => {
			console.log("Item deleted successfully from the database.");
		})
		.catch((error) => {
			console.error("Error deleting item from the database:", error);
		});
}

onValue(shoppingListInDB, function (snapshot) {
	shoppingListEl.textContent = "";
	let fragment = document.createDocumentFragment();
	let listArray = Object.entries(snapshot.val());
	for (const [key, value] of listArray) {
		let shoppingItem = document.createElement("li");
		shoppingItem.textContent = value;
		shoppingItem.className = "listItem";
		const deleteButton = document.createElement("button");
		deleteButton.textContent = "X";
		deleteButton.className = "modifyBtn";
		shoppingItem.appendChild(deleteButton);
		deleteButton.addEventListener("click", function () {
			deleteItem(key);
			shoppingItem.remove(); // Remove the item from the HTML
		});

		fragment.appendChild(shoppingItem);
	}
	shoppingListEl.appendChild(fragment);
});

function clearInputFieldEl() {
	inputFieldEl.value = "";
}

function clearDB() {
	shoppingListEl.textContent = "";
}
