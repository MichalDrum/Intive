function validateRegisterForm(){
	var email = document.getElementById("email").value;
	var confirmEmail = document.getElementById("confirmEmail").value;
	var userName = document.getElementById("login").value;
	var password = document.getElementById("password").value;

	if (userName == "") {
		alert("Nazwa użytkownika nie może być puste!");
		return false;
	}

	if (email != confirmEmail) {
		alert("Pola E-mail nie są zgodne!");
		return false;
	}

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

function setUserToLocalStorage(){
	var email = document.getElementById("email").value;
	var userName = document.getElementById("login").value;
	var password = document.getElementById("password").value;

	//check if username already exist
	if (localStorage.getItem(userName) !== null) {
		alert(`Nazwa użytwkonika już istnieje, proszę wybrać inną nazwę.`);
		return false
	}
	if (localStorage.getItem(email) !== null) {
		alert(`Adres e-mail jest już zajęty.`);
		return false
	}

	window.localStorage.setItem(email, password);
	window.localStorage.setItem(userName, password);
	window.localStorage.setItem(email, userName);
}

