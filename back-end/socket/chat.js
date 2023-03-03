module.exports = function (io) {
	//stocker les messages dans un tableau, pour les envoyer à chaque nouveau client
	let messages = [];

	//stocket les utilisateurs dans un tableau, pour les envoyer à chaque nouveau client
	let users = [];

	io.on("connection", (socket) => {
		console.log(`Connecté au client ${socket.id}`);

		socket.on("new-user", (username) => {
			io.emit("notification", { type: "new_user", data: username });
		});

		// Listener sur la déconnexion
		socket.on("disconnect", () => {
			console.log(`user ${socket.id} disconnected`);
			io.emit("notification", { type: "removed_user", data: socket.id });
		});

		socket.on("sendMessage", (data) => {
			console.log(`Message reçu : ${data.text}`);
			io.emit("notification", {
				type: "new_message",
				data: data.text,
        id: socket.id,
        username: data.username,
			});
			fetch("http://localhost:3000/messages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					text: data.text,
					date: new Date(),
          userId: socket.id,
          username: data.username,
				}),
			});
		});

		socket.on("getMessages", () => {
			socket.emit("messages", messages);
		});

		socket.on("getUsers", () => {
			socket.emit("users", users);
		});
	});
};
