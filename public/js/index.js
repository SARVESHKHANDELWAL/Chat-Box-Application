// Make connection
//to local an dmake it process.env.PORT to deploy
    var socket = io.connect('http://localhost:4000');
    
    
// Query DOM
const chatForm = document.getElementById('chat-form');
const chatMessages= document.querySelector('.chat-messages');
const date= document.getElementById('date');
const day= document.getElementById('day');
const roomName = document.getElementById('room-name');
const userList= document.getElementById('users');


//Getting username and room from URL
const {username,room}=Qs.parse(location.search,{
    //FROM URL
    ignoreQueryPrefix:true
});
console.log(username,room);
//Join Room
socket.emit('joinRoom',{username,room});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//Message From server
socket.on('message',message =>{
    console.log(message);
    outputMessage(message);

    //ScrollDown
    chatMessages.scrollTop=chatMessages.scrollHeight;
});
//message submit or emit events
chatForm.addEventListener('submit', e =>{
    e.preventDefault();
    //Get text 
    const msg=e.target.elements.msg.value;
    //Emit the msg to server
    socket.emit('chatMessage',msg);
    
    //clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
});

//Output message to dom
function outputMessage(message) {
    //Create a Div
    const div=document.createElement('div');
    //Add class to it
     var d = new Date();
     var time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
     var date= d.toLocaleDateString('en-GB');
      date.innerText=date;
       var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

     var day = weekday[d.getDay()];
     day.innerText=day;
       
    div.classList.add('message');
    div.innerHTML=`<h6>${day}</h6><p class="meta">${message.username} <span>${message.time}</span></p>
                <p class="text">
                  ${message.text}
                </p>`;
                //we append the div to the existsing div
                document.querySelector('.chat-messages').appendChild(div);

}
// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}