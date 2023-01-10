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
	const chartPie = transactionChart(
		apiResponse.transactions,
		apiResponse.transacationTypes
	);

	// Append table to wrapper
	transactionsTableWrapper.appendChild(table);
}

function transactionChart(dataArray, labelsArray) {
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

	var ctx = document.getElementById("chart").getContext("2d");
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
