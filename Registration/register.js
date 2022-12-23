function checkEmail() {
	var email = document.getElementById("email").value;
	var confirmEmail = document.getElementById("confirmEmail").value;
	if (email != confirmEmail) {
		alert("Pola E-mail nie są zgodne!");
		return false;
	}
	return true;
}

function checkUsername() {
	var userName = document.getElementById("login").value;
	if (userName == "") {
		alert("Nazwa użytkownika nie może być puste!");
		return false;
	}
	return true;
}

function checkPassword() {
	var password = document.getElementById("password").value;
	if (password == "") {
		alert("Pole hasło nie może być puste!");
		return false;
	}
	if (password.length < 6) {
		alert("Hasło musi zawierać conajmniej 6 znaków!");
		return false;
	}
	return true;
}
