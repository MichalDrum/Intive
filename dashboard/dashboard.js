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
	const transactions = await response.json();
	console.log(transactions, transactions.transactionTypes);
	console.log(Object.values(transactions.transacationTypes));

	// Generate table from data
	const table = generateTable(
		transactions.transactions,
		transactions.transactionTypes
	);

	transactionChart(transactions, transactions.transactionTypes);

	// Append table to wrapper
	transactionsTableWrapper.appendChild(table);
}

function transactionChart(data, transactionTypes) {
	// check if data and transactionTypes are defined
	if (!data || !transactionTypes) {
		console.error("Data or transaction types are not defined");
		return;
	}

	var ctx = document.getElementById("chart").getContext("2d");
	var myPieChart = new Chart(ctx, {
		type: "pie",
		data: {
			labels: Object.values(transactionTypes), // labels for each slice of the pie
			datasets: [
				{
					data: data.transactions
						.map(t => t.type)
						.reduce((acc, type) => {
							acc[type] = (acc[type] || 0) + 1;
							return acc;
						}, {}), // count of each transaction type
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

function generateTable(data, transactionTypes) {
	const table = document.createElement("table");
	const thead = document.createElement("thead");
	const tbody = document.createElement("tbody");

	// Create the header row
	thead.innerHTML = `
	  <tr>
		<th>Data</th>
		<th>Ikona</th>
		<th>Opis</th>
		<th>Zmiana</th>
		<th>Saldo</th>
	  </tr>
	`;

	// Add rows to the body
	data.forEach(row => {
		tbody.innerHTML += `
		<tr>
		  <td>${row.date}</td>
		  <td>
			<i class="fas fa-${getIcon(row.type)}"></i>
		  </td>
		  <td>${row.description}</td>
		  <td>${row.amount}</td>
		  <td>${row.balance}</td>
		</tr>
	  `;
	});

	// Add the header and body to the table
	table.appendChild(thead);
	table.appendChild(tbody);

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
