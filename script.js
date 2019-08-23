const CHANNEL_ID = 'R7jmh08fnQiEP9b9';
const drone = new ScaleDrone(CHANNEL_ID, {
	data: {
		name: getName(),
		color: getRandomColor(),
	} 
})

let members = [];

drone.on('open', error => {
	if (error) {
		return console.error(error);
	}

	console.log('Succesfully connected to Scaledrone');

	const room = drone.subscribe('observable-room');
	room.on('open', error => {
		if (error) {
			return console.error(error);
		}

		console.log('Successfully joined room');
	});

	room.on('members', m => {
 		members = m;
 		updateMembersDOM();
	});
 
	// User joined the room
	room.on('member_join', member => {
 		members.push(member);
 		updateMembersDOM();
	});
 
	// User left the room
	room.on('member_leave', ({id}) => {
 		const index = members.findIndex(member => member.id === id);
 		members.splice(index, 1);
 		updateMembersDOM();
	});

	room.on('data', (text, member) => {
 		if (member) {
   			addMessageToListDOM(text, member);
 		
 		} else {
   			// Message is from server
 		
 		}
	});
});

function getName() {
	const name = prompt("Please choose a username");
 	return name;
}
 
function getRandomColor() {
 	//return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);

 	const colors = ["red", "orange", "yellow", "green", "blue", "purple", "grey"];
 	return colors[Math.floor(Math.random()*colors.length)];
}

const DOM = {
 	membersCount: document.querySelector('.members-count'),
 	membersList: document.querySelector('.members-list'),
 	messages: document.querySelector('.messages'),
 	input: document.querySelector('.message-form__input'),
 	form: document.querySelector('.message-form'),
};

DOM.form.addEventListener('submit', sendMessage);
 
function sendMessage() {
 	const value = DOM.input.value;
 	
 	if (value === '') {
   		return;
 	}
 	
 	DOM.input.value = '';
 	drone.publish({
   	room: 'observable-room',
   	message: value,
 	});
}
 
function createMemberElement(member) {
 	const {name, color} = member.clientData;
 	const el = document.createElement('div');
 	
 	el.appendChild(document.createTextNode(name));
 	el.className = 'member';
 	el.style.color = color;
 	return el;
}
 
function updateMembersDOM() {
 	DOM.membersCount.innerText = `${members.length} users in room:`;
 	DOM.membersList.innerHTML = '';
 	members.forEach(member =>
   	DOM.membersList.appendChild(createMemberElement(member)));
}
 
function createMessageElement(text, member) {
 	const el = document.createElement('div');
 	el.appendChild(createMemberElement(member));
 	el.appendChild(document.createTextNode(text));
 	el.className = 'message';
 	return el;
}
 
function addMessageToListDOM(text, member) {
 	const el = DOM.messages;
 	const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
 	el.appendChild(createMessageElement(text, member));
 	
 	if (wasTop) {
   		el.scrollTop = el.scrollHeight - el.clientHeight;
 	}
}