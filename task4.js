const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        location.href = '/';
        return;
    }

    const username = JSON.parse(atob(token.split('.')[1])).username;
    socket.emit('login', username);

    document.querySelectorAll('.room-list a').forEach(roomLink => {
        roomLink.addEventListener('click', (e) => {
            e.preventDefault();
            const room = e.target.dataset.room;
            socket.emit('joinRoom', room);
            document.querySelector('#messages').innerHTML = '';
        });
    });

    document.getElementById('messageForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = document.getElementById('messageInput').value;
        socket.emit('chatMessage', msg);
        document.getElementById('messageInput').value = '';
    });

    socket.on('messageHistory', (messages) => {
        const messageList = document.getElementById('messages');
        messages.forEach(message => {
            const div = document.createElement('div');
            div.className = 'message';
            div.textContent = `${message.user}: ${message.text}`;
            messageList.appendChild(div);
        });
        messageList.scrollTop = messageList.scrollHeight;
    });

    socket.on('chatMessage', (message) => {
        const div = document.createElement('div');
        div.className = 'message';
        div.textContent = `${message.user}: ${message.text}`;
        document.getElementById('messages').appendChild(div);
        document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
    });
});
