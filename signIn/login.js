function signIn() {
	// Get the entered username and password
	const userName = document.getElementById("name").value;
	const password = document.getElementById("login_password").value;

	// Get the user data from local storage
	const userDataString = window.localStorage.getItem("userData");

	// Parse the string into an array of objects
	const userDataArray = JSON.parse(userDataString);

	// Find the user with the entered username
	loggedInUser = userDataArray.find(u => u.name === userName);

	// If the user doesn't exist, show an error message
	if (!loggedInUser) {
		alert(`Użytkownik nie istnieje!`);
		return false;
	}

	// If the password is incorrect, show an error message
	if (password !== loggedInUser.password) {
		alert("Podane hasło jest nieprawidłowe!");
		return false;
	}

	// Set active user
	window.localStorage.setItem("activeUser", name);

	// Redirect to a new page if login is successful
	window.location.href = "http://127.0.0.1:5500/dashboard/dashboard.html";
	return true;
}
