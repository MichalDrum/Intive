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

	//  Find user in list of users from local storage
	if (!isUsernameAvaible(users, user)) {
		let warning = "Nazwa użytkownika jest już zajęta.";
		showNotification(user.name.input, warning);
		validationSuccess = false;
	}

	//  Find email in list of users from local storage
	if (!isEmailAvaible(users, user)) {
		let warning = "Email jest już zajęty.";
		showNotification(user.email.input, warning);
		validationSuccess = false;
	}

	// Email - is valid  format
	if (!isValidEmail(user.email.value)) {
		let warning = "Email ma niepoprawny format.";
		showNotification(user.email.input, warning);
		validationSuccess = false;
	}

	//  Email - check if email field is empty and if number of characters is 0
	if (user.email.value === "" || user.email.value.length === 0) {
		let warning = "Email nie może być pusty!";
		showNotification(user.email.input, warning);
		validationSuccess = false;
	}

	if (!isOnlyDigitsOrLetters(user.name.value)) {
		let warning = "Pole użytkownika zawiera niedozwolone znaki!";
		showNotification(user.name.input, warning);
		validationSuccess - false;
	}

	if (!validateUsername(user.name.value)) {
		let warning =
			"Nazwa użytkownika musi mieć od 6 do 16 znaków. Min. 5 liter i 1 cyfrę oraz dozwolone as tylko - _ [ ]  / ";
		showNotification(user.name.input, warning);
		validationSuccess = false;
	}

	// Name - check if user name length is 6 =< user name >= 16
	if (6 > user.name.value.length || user.name.value.length > 16) {
		let warning = "Nazwa użytkownika musi mieć od 6 do 16 znaków.";
		showNotification(user.name.input, warning);
		validationSuccess = false;
	}

	// Email - Is user email not a user confirm email
	if (user.email.value !== user.confirmEmail.value) {
		let warning = "Pola E-mail nie są zgodne!";
		showNotification(user.email.input, warning);
		validationSuccess = false;
	}

	// Password - Is password  empty string
	if (user.password.value === "") {
		let warning = "Pole hasło nie może być puste!";
		showNotification(user.password.input, warning);
		validationSuccess = false;
	}

	// Is password characters count less than 6
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

	// Hash password
	newUser.password = stringToHash(newUser.password);

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
function isEmailAvaible(users, userName) {
	return users.filter(user => user.email === userName.email.value).length === 0;
}

// Find if username already exists
function isUsernameAvaible(users, userName) {
	return users.filter(user => user.name === userName.name.value).length === 0;
}

// Find if string is made only with letters or digits - pattern of RegExp
function isOnlyDigitsOrLetters(str) {
	return str.match(/^[a-zA-Z0-9]+$/) !== null;
}

// Check for basic email format
function isValidEmail(email) {
	const emailParts = email.split("@");
	if (emailParts.length !== 2) {
		return false;
	}
	const [username, domain] = emailParts;
	if (username.length === 0 || domain.length === 0) {
		return false;
	}
	if (!domain.includes(".")) {
		return false;
	}
	return true;
}

// Hash passowrd for 32 bit int
function stringToHash(string) {
	var hash = 0;

	if (string.length == 0) return hash;

	for (i = 0; i < string.length; i++) {
		char = string.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}

	return hash;
}

function validateUsername(username) {
	const pattern =
		/^(?=.{6,16})(?=.*[a-zA-Z]{5,})(?=.*\d)[a-zA-Z\d_\-\[\]\\\/]*$/;
	return pattern.test(username);
}
