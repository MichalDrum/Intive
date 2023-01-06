document.getElementById("regForm").onsubmit = function () {
	// Prevent the form from being submitted
	event.preventDefault();

	console.log(validateRegisterForm());

	// Validate the form fields
	if (validateRegisterForm()) {
		// Save the user to local storage
		setUserToLocalStorage();

		// Redirect to a new page
		window.location.href = "/dashboard/dashboard.html";
	}
};

function validateRegisterForm() {
	const user = {
		email: document.getElementById("email").value,
		confirmEmail: document.getElementById("confirmEmail").value,
		name: document.getElementById("login").value,
		password: document.getElementById("password").value,
	};

	if (user.name == "") {
		alert("Nazwa użytkownika nie może być puste!");
		return false;
	}

	if (user.email != user.confirmEmail) {
		alert("Pola E-mail nie są zgodne!");
		return false;
	}

	if (user.password == "") {
		alert("Pole hasło nie może być puste!");
		return false;
	}
	if (user.password.length < 6) {
		alert("Hasło musi zawierać conajmniej 6 znaków!");
		return false;
	}
	return true;
}

function setUserToLocalStorage() {
	const newUser = {
		email: document.getElementById("email").value,
		name: document.getElementById("login").value,
		password: document.getElementById("password").value,
	};

	const userDataString = window.localStorage.getItem("userData");

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
