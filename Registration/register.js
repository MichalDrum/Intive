const form = document.getElementById("regForm");
const submitButton = form.querySelector('input[type="submit"]');

submitButton.addEventListener("click", event => {
	// Prevent the form from being submitted and default check notifications
	event.preventDefault();

	// Validate the form fields
	if (validateRegisterForm()) {
		// Save the user to local storage
		setUserToLocalStorage();

		// Redirect to a new page
		window.location.href = "./../dashboard/dashboard.html";
	}
});

// insecure left for submission because there is no browser api default validation which doesnt trigger submit
form.addEventListener("submit", event => {
	// Prevent the form from being submitted and default check notifications
	event.preventDefault();

	// Validate the form fields
	if (validateRegisterForm()) {
		// Save the user to local storage
		setUserToLocalStorage();

		// Redirect to a new page
		window.location.href = "./../dashboard/dashboard.html";
	}
});

function validateRegisterForm() {
	// cleanup notifications
	cleanNotifications();

	let validationSuccess = true;
	const users = JSON.parse(getUserDataString());

	const user = {
		email: {
			input: document.getElementById("email"),
			value: document.getElementById("email").value,
		},
		confirmEmail: {
			input: document.getElementById("confirmEmail"),
			value: document.getElementById("confirmEmail").value,
		},
		name: {
			input: document.getElementById("login"),
			value: document.getElementById("login").value,
		},
		password: {
			input: document.getElementById("password"),
			value: document.getElementById("password").value,
		},
	};

	console.log(
		"USERS_LOGINS \n\n",
		users.map(u => u.name)
	);

	if (!isUsernameAvaible(users, user)) {
		let warning = "Nazwa użytkownika jest już zajęta.";
		showNotification(user.name.input, warning);
		validationSuccess = false;
	}

	if (!isEmailAvaible(users, user)) {
		let warning = "Email jest już zajęty.";
		showNotification(user.email.input, warning);
		validationSuccess = false;
	}

	if (user.email.value.length < 3) {
		let warning = "Email musi posiadać minimum 3 znaki!";
		showNotification(user.email.input, warning);
		validationSuccess = false;
	}

	if (user.email.value === "" && user.email.value.length === 0) {
		let warning = "Email nie może być pusty!";
		showNotification(user.email.input, warning);
		validationSuccess = false;
	}

	if (user.name.value === "" && user.name.value.length === 0) {
		let warning = "Nazwa użytkownika nie może być pusta!";
		showNotification(user.name.input, warning);
		validationSuccess = false;
	}

	if (user.email.value !== user.confirmEmail.value) {
		let warning = "Pola E-mail nie są zgodne!";
		showNotification(user.email.input, warning);
		validationSuccess = false;
	}

	if (user.password.value === "") {
		let warning = "Pole hasło nie może być puste!";
		showNotification(user.password.input, warning);
		validationSuccess = false;
	}

	if (user.password.value.length < 6) {
		let warning = "Hasło musi zawierać conajmniej 6 znaków!";
		showNotification(user.password.input, warning);
		validationSuccess = false;
	}

	return validationSuccess;
}

function setUserToLocalStorage() {
	const newUser = {
		email: document.getElementById("email").value,
		name: document.getElementById("login").value,
		password: document.getElementById("password").value,
	};

	const userDataString = getUserDataString();

	let userDataArray = [];

	// Parse the string into an array of objects, or create a new array if the key doesn't exist
	if (userDataString) {
		userDataArray = JSON.parse(userDataString);
	}

	// Add new user to the array
	userDataArray.push(newUser);

	// Stringyfy the updated array and save it to local storage
	const updatedUserDataString = JSON.stringify(userDataArray);
	localStorage.setItem("userData", updatedUserDataString);

	// Set active user
	window.localStorage.setItem("activeUser", newUser.name);
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
	return window.localStorage.getItem("userData") !== null ? true : false;
}

// Create user data in local storage
function createUserData() {
	window.localStorage.setItem("userData", JSON.stringify([]));
}

// Find if email already exists
function isEmailAvaible(users, user) {
	return users.includes(u => u.email === user.email.value);
}

// Find if username already exists
function isUsernameAvaible(users, user) {
	return users.includes(u => u.name === user.name.value);
}
