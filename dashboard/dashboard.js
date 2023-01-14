window.addEventListener("load", e => {
	assignActiveUser();
	fetchTransactionAPI();
});

function assignActiveUser() {
	// Get the active user from local storage
	const activeUser = localStorage.getItem("activeUser");

	// Check if the user is logged in
	if (activeUser) {
		// If the user is logged in, display the username
		document.getElementById("username").innerHTML = activeUser;
	}
}

async function fetchTransactionAPI() {
	const transactionsTableWrapper = document.getElementById(
		"transaction-table-wrapper"
	);
	const response = await fetch("https://api.npoint.io/38edf0c5f3eb9ac768bd");
	const apiResponse = await response.json();
	console.log(apiResponse);
	// console.log(Object.values(transactions.transacationTypes));

	// Generate table from data
	const table = generateTable(
		apiResponse.transactions,
		apiResponse.transacationTypes
	);

	// Generate chart from data
	const chartPie = transactionsChart(
		apiResponse.transactions,
		apiResponse.transacationTypes,
		"chart-transactions-types"
	);

	const barChart = spendingsChart(apiResponse.transactions, "chart-spendings");
	// Append table to wrapper
	transactionsTableWrapper.appendChild(table);
}

function transactionsChart(dataArray, labelsArray, idString) {
	// check if data and transactionTypes are defined
	if (!dataArray || !labelsArray) {
		console.error("Data or transaction types are not defined");
		return;
	}

	const typeCount = dataArray
		.map(item => item.type)
		.reduce((acc, curr) => {
			acc[curr] = acc[curr] ? acc[curr] + 1 : 1;
			return acc;
		}, {});

	const chartLabels = Object.keys(typeCount).map(key => labelsArray[key]);
	const chartData = Object.values(typeCount);

	var ctx = document.getElementById(`${idString}`).getContext("2d");
	var myPieChart = new Chart(ctx, {
		type: "pie",
		data: {
			labels: chartLabels, // labels for each slice of the pie
			datasets: [
				{
					data: chartData, // count of each transaction type
					backgroundColor: ["#007bff", "#28a745", "#333333", "#c3e6cb"], // colors for each slice of the pie
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
		},
	});
}

function spendingsChart(data, idString) {
	// check if data and transactionTypes are defined
	if (!data || !idString) {
		console.error("Data or ID is not defined");
		return;
	}

	const dateAndBalance = data.map(({ date, balance }) => ({
		date,
		balance,
	}));

	const dates = dateAndBalance.map(({ date }) => date);
	const balance = dateAndBalance.map(({ balance }) => balance);

	var ctx = document.getElementById(`${idString}`).getContext("2d");
	var myPieChart = new Chart(ctx, {
		type: "bar",
		data: {
			labels: dates, // labels for each slice of the pie
			datasets: [
				{
					data: balance, // count of each transaction type
					backgroundColor: ["#007bff", "#28a745", "#333333", "#c3e6cb"], // colors for each slice of the pie
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
		},
	});
}

function generateTable(transactions, transactionTypes) {
	const table = document.createElement("table");
	const thead = document.createElement("thead");
	const tbody = document.createElement("tbody");

	// Create the header row
	thead.innerHTML = `
	  <tr>
		<th>Data</th>
		<th>Typ Transakcji</th>
		<th>Opis</th>
		<th>Kwota</th>
		<th>Saldo</th>
	  </tr>
	`;

	// Add rows to the body, rows represents object transactions with transaction attributes
	const rows = transactions.map(transaction => {
		const row = document.createElement("tr");
		row.dataset.date = transaction.date;
		row.dataset.balance = transaction.balance;
		row.innerHTML = `
		  <td>${transaction.date}</td>
		  <td>
			<i class="fas fa-${getIcon(transaction.type)}"></i>
		  </td>
		  <td>
		  	<span class="transactions-dsc-type_wrapper">
		  	<h5>${transaction.description}</h5>
			<p>${transactionTypes[transaction.type]}</p>
			</span>
		  </td>
		  <td>${transaction.amount}</td>
		  <td>${transaction.balance}</td>
	  `;
		return row;
	});

	// Add the header and body to the table
	table.appendChild(thead);
	table.appendChild(tbody);

	console.log(rows);

	// Add tr to table body
	rows.forEach(row => {
		tbody.appendChild(row);
	});

	// Return the table
	return table;
}

// Returns an icon name based on the type
function getIcon(type) {
	switch (type) {
		case 1:
			return "gift";
		case 2:
			return "shopping-cart";
		case 3:
			return "money-bill-alt";
		case 4:
			return "credit-card";
		default:
			return "question";
	}
}

// Sorting dates array of strings ascending
function sortDates(dates) {
	return dates.sort((a, b) => {
		const year1 = a.substring(0, 4);
		const month1 = a.substring(5, 7);
		const day1 = a.substring(8);

		const year2 = b.substring(0, 4);
		const month2 = b.substring(5, 7);
		const day2 = b.substring(8);

		if (year1 !== year2) {
			return year1 - year2;
		} else if (month1 !== month2) {
			return month1 - month2;
		} else {
			return day1 - day2;
		}
	});
}

// Mobile transaction table expand functionality
const rows = document.querySelectorAll("tbody tr");

rows.forEach(row => {
	row.addEventListener("click", function () {
		// Remove the open class from any previously open row
		const openRow = document.querySelector(".open");
		if (openRow) {
			openRow.classList.remove("open");
		}

		// Add the open class to the clicked row
		this.classList.toggle("open");
	});
});
