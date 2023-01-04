function signIn() {
	var userName = document.getElementById("name").value;
	var password = document.getElementById("login_password").value;
	var localStoragePassword = window.localStorage.getItem(userName);

	if (localStorage.getItem(userName) === null) {
		alert(`Użytkownik nie istnieje!`);
		return false;
	}

	if (password != localStoragePassword) {
		alert("Podane hasło jest nieprawidłowe!");
		return false;
	}

	return true;
}
