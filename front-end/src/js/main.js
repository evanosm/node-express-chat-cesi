(function () {
	const server = `http://${window.location.hostname}:3000`;
	const socket = io(server);

	const username = prompt("Enter an username");

	const usernameProfile = document.querySelector("#usernameProfile");
	usernameProfile.textContent = username;

	socket.emit("new-user", username);

	socket.on("notification", (data) => {
		console.log("Message depuis le seveur:", data);
	});

	const getMessages = fetch(`${server}/messages`)
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			data.forEach((message) => {
				const newMessage = document.createElement("li");
				const user = document.createElement("div");
				const userName = document.createElement("span");
				const messageWrapper = document.createElement("div");
				const messageEl = document.createElement("p");
				const date = document.createElement("span");

				user.classList.add("name");
				messageWrapper.classList.add("message");
				date.classList.add("msg-time");

				userName.textContent = message.username;
				messageEl.textContent = message.text;

				//date on hours + minutes w/o secons in AM/PM format
				date.textContent = message.date;

				user.appendChild(userName);
				messageWrapper.appendChild(messageEl);
				messageWrapper.appendChild(date);
				newMessage.appendChild(user);
				newMessage.appendChild(messageWrapper);
				messageList.appendChild(newMessage);
			});
		});

	// -------------------------------- //
	//  MESSAGE SEND/RECEIVE HANDLERS   //
	// -------------------------------- //
	const input = document.querySelector("#inputMessage");
	const button = document.querySelector("#submitMessage");
	const messageList = document.querySelector("#messageList");

	//on enter key press, send message
	input.addEventListener("keyup", (e) => {
		if (e.key === "Enter") {
			button.click();
		}
	});

	//on enter if input is not focused, focus input
	document.addEventListener("keyup", (e) => {
		if (e.key === "Enter" && !input.isFocused) {
			input.focus();
		}
	});

	button.addEventListener("click", () => {
		if (input.value !== "") {
			socket.emit("sendMessage", { text: input.value, username: username });
			const newMessage = document.createElement("li");
			const user = document.createElement("div");
			const userName = document.createElement("span");
			const messageWrapper = document.createElement("div");
			const message = document.createElement("p");
			const date = document.createElement("span");

			newMessage.classList.add("me");

			user.classList.add("name");
			messageWrapper.classList.add("message");
			date.classList.add("msg-time");

			userName.textContent = username;
			message.textContent = input.value;

			//date on hours + minutes w/o secons in AM/PM format
			const dateObj = new Date();
			const hours =
				dateObj.getHours() > 12 ? dateObj.getHours() - 12 : dateObj.getHours();
			const minutes =
				dateObj.getMinutes() < 10
					? `0${dateObj.getMinutes()}`
					: dateObj.getMinutes();
			const ampm = dateObj.getHours() >= 12 ? "PM" : "AM";
			date.textContent = `${hours}:${minutes} ${ampm}`;

			user.appendChild(userName);
			messageWrapper.appendChild(message);
			messageWrapper.appendChild(date);
			newMessage.appendChild(user);
			newMessage.appendChild(messageWrapper);
			messageList.appendChild(newMessage);
			input.value = "";
		} else {
			alert("Veuillez entrer un message");
		}
	});

	const scroller = document.querySelector(".chat-list");
	socket.on("notification", (data) => {
		if (data.type === "new_message" && data.id !== socket.id) {
			const newMessage = document.createElement("li");
			const user = document.createElement("div");
			const userName = document.createElement("span");
			const messageWrapper = document.createElement("div");
			const message = document.createElement("p");
			const date = document.createElement("span");

			user.classList.add("name");
			messageWrapper.classList.add("message");
			date.classList.add("msg-time");

			userName.textContent = data.username;
			message.textContent = data.data;

			//date on hours + minutes w/o secons in AM/PM format
			const dateObj = new Date();
			const hours =
				dateObj.getHours() > 12 ? dateObj.getHours() - 12 : dateObj.getHours();
			const minutes =
				dateObj.getMinutes() < 10
					? `0${dateObj.getMinutes()}`
					: dateObj.getMinutes();
			const ampm = dateObj.getHours() >= 12 ? "PM" : "AM";
			date.textContent = `${hours}:${minutes} ${ampm}`;

			user.appendChild(userName);
			messageWrapper.appendChild(message);
			messageWrapper.appendChild(date);
			newMessage.appendChild(user);
			newMessage.appendChild(messageWrapper);
			messageList.appendChild(newMessage);
		}

		//scroll to bottom of message list
		scroller.scrollTo(0, messageList.scrollHeight);
	});

	// ----------------------------------- //
	//  USER CONNECT/DISCONNECT HANDLERS   //
	// ----------------------------------- //

	const memberList = document.querySelector("ul.member-list");

	socket.on("notification", (data) => {
		if (data.type === "new_user") {
			const newUser = document.createElement("li");
			const userName = document.createElement("span");
			newUser.id = data.data;
			userName.classList.add("online");
			userName.textContent = data.data;
			newUser.appendChild(userName);
			memberList.appendChild(newUser);

			const newNotification = document.createElement("li");
			const notificationName = document.createElement("p");
			const notificationText = document.createElement("span");

			newNotification.classList.add("newUserNotification");

			notificationName.textContent = data.data;
			notificationText.textContent = "joined the chat 🫶";

			newNotification.appendChild(notificationName);
			newNotification.appendChild(notificationText);
			messageList.appendChild(newNotification);
			scroller.scrollTo(0, messageList.scrollHeight);
		} else if (data.type === "removed_user") {
			const user = document.querySelector(`#${data.data}`);
			const userName = user.querySelector("span");
			userName.classList.remove("online");
			userName.classList.add("offline");
			setTimeout(() => {
				user.remove();
			}, 5000);
		}
	});
})();
