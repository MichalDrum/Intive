// Get the active user from local storage
const activeUser = localStorage.getItem("activeUser");

// Check if the user is logged in
if (activeUser) {
	// If the user is logged in, display the username
	document.getElementById("username").innerHTML = activeUser;
}
