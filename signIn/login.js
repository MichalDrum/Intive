const loginButton = document.getElementById("login-button");

loginButton.addEventListener("click", event => {
	// prevent default behavior
	event.preventDefault();

	// run signIn process
	if (signIn()) {
		// Redirect to a new page if login is successful
		window.location.href = "./../dashboard/dashboard.html";
	}
});

function signIn() {
	cleanNotifications();
	// Flag for successfull login
	let loginSuccess = true;

	// Get the entered username and password
	const user = {
		name: {
			input: document.getElementById("login"),
			value: document.getElementById("login").value,
		},
		password: {
			input: document.getElementById("password"),
			value: document.getElementById("password").value,
		},
	};

	// Get the user data from local storage
	const userDataString = getUserDataString();
	console.log("LOGIN", userDataString);

	// Parse the string into an array of objects
	const userDataArray = JSON.parse(userDataString);

	// If user field is empty
	if (user.name.value.length === 0) {
		if (user.name.value.length === 0)
			showNotification(user.name.input, "Podaj nazwę użytkownika!");
		loginSuccess = false;
	}

	// Find the user with the entered username
	loggedInUser = userDataArray.find(u => u.name === user.name.value);

	//  Find the user by email
	if (!loggedInUser) {
		loggedInUser = userDataArray.find(u => u.email === user.name.value);
	}

	// If the user doesn't exist, show an error message
	if (!loggedInUser && user.name.value.length > 0) {
		showNotification(user.name.input, "Użytkownik nie istnieje!");
		loginSuccess = false;
	}

	// If the password is incorrect, show an error message
	if (
		user.password.value.length < 6 ||
		(loggedInUser?.password && user.password.value !== loggedInUser.password)
	) {
		showNotification(user.password.input, "Podane hasło jest nieprawidłowe!");
		loginSuccess = false;
	}

	if (!loginSuccess) return loginSuccess;

	// Set active user
	window.localStorage.setItem("activeUser", loggedInUser.name);

	return loginSuccess;
}

function showNotification(inputNode, message) {
	// Basic error handling for input
	if (typeof inputNode === "undefined" || inputNode instanceof Array) {
		console.error(
			`You passed ${inputNode} and it is ${
				inputNode instanceof Array ? "Array" : "undefined"
			}`
		);
		return;
	}

	// Basic error handling for message
	if (message === undefined || message.length === 0) {
		console.error(
			`You passed ${message} and it is ${
				message.length === 0 ? "empty string" : "undefined"
			}`
		);
		return;
	}

	// Check if there is already an existing notification
	let existingNotification =
		inputNode.parentNode.querySelector(".notification");
	if (existingNotification) {
		existingNotification.textContent = message;
		return;
		existingNotification.remove();
	}

	// Create a new div element for the notification
	const notification = document.createElement("div");
	notification.classList.add("notification");
	notification.textContent = message;

	// Insert the notification after the input
	inputNode.parentNode.insertBefore(notification, inputNode.nextSibling);
}

function cleanNotifications() {
	const notifications = document.querySelectorAll(".notifications");

	if (!notifications) return;

	[...notifications].map(notification => {
		notification.textContent = "";
	});
}

function getUserDataString() {
	// check if exist in local data and if not make it appear
	if (isUserData()) {
		return window.localStorage.getItem("userData");
	} else {
		createUserData();
		return window.localStorage.getItem("userData");
	}
}

// Find if userData already exists in localstorage
function isUserData() {
	return window.localStorage.getItem("userData") ? true : false;
}

// Create user data in local storage
function createUserData() {
	window.localStorage.setItem("userData", JSON.stringify([]));
}
