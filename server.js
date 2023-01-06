const liveServer = require("live-server");

const params = {
	port: 3000,
	root: "",
	open: false,
	ignore: "scss,my/templates",
	file: "index.html",
	wait: 1000,
	logLevel: 2,
};

liveServer.start(params);
