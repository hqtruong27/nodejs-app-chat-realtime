//import { getHash } from '.././helper/helper.js';
const chatForm = document.querySelector('#chat-form')
const chatMessage = document.querySelector('.chat-message')
const sendMessage = document.querySelector('.send-message')
const typing = document.querySelector('#chat-sending')
const baseUri = location.origin
const ACCESS_TOKEN = localStorage.getItem('user')

const ChatClient = {
    init: () => {
        ChatClient.connect()
    },
    connect: () => {
        let socket = io({ auth: { token: ACCESS_TOKEN } })
        socket.on('user-info', (res) => {
            console.log(res)
            socket.user = res.user
            socket.emit("join-room", { user: res.user, roomName: "room1" })
        })

        socket.on("connect_error", (err) => {
            console.log(err instanceof Error); // true
            console.log(err.data);
            console.log(err.message);
            socket.disconnect()
            location.href = baseUri + '/login.html'
        });

        ChatClient.socket(socket)
        ChatClient.event(socket)
    },
    user: async () => {
        try {
            const response = await fetch('http://localhost:3000/api/personal', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + ACCESS_TOKEN
                }
            })

            if (response.ok) {
                return User = await response.json()
            }

            window.location.href = 'https://google.com'
        } catch (error) {
            console.log(error)
        }
    },

    socket: (socket) => {
        const chatArea = document.querySelector('.chat-area-main')
        socket.on('user-chat', (res) => {
            if (socket.id !== res.message_sender) {
                typing.textContent = ''
            }

            const isOwner = socket.id === res.message_sender ? 'owner' : ''
            const image = res.user?.image?.slice(0, 4) == 'http' ? res.user?.image : 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png'
            const str = `<div class="chat-msg ${isOwner}">
                            <div class="chat-msg-profile">
                                <img class="chat-msg-img"
                                    src="${image}"
                                    alt="" />
                                <div class="chat-msg-date">${res.user.name} - Message seen 2.50pm</div>
                            </div>
                            <div class="chat-msg-content">
                                <div class="chat-msg-text">${res.message}</div>
                            </div>
                        </div>`

            const node = document.createElement('message')
            node.innerHTML = str
            chatArea.appendChild(node.firstChild)
            ChatClient.scrollToBottom()
        })
    },

    event: (socket) => {
        chatMessage.addEventListener('keyup', (e) => {
            const IS_ENTER = 13
            const message = e.target.value.trim() ?? ''
            if (e.keyCode === IS_ENTER) {
                if (message == '') {
                    chatMessage.value = ''
                    return;
                }

                sendMessage.click()
            }
        })

        sendMessage.addEventListener('click', (e) => {
            e.preventDefault()
            const message = chatMessage.value.trim()
            if (message != '') {
                socket.emit('on-chat', { user: socket.user, message: message })
                chatMessage.value = ''
            }
        })

        chatMessage.addEventListener('input', () => onInput(socket.user))

        socket.on('typing', (data) => {
            typing.textContent = data
        })

        let isTyping = false;
        let timeout = undefined;
        const onInput = (user) => {
            clearTimeout(timeout);
            socket.emit('typing', `${user.name} is typing...`);
            timeout = setTimeout(typingTimeout, 3000);
        }
        const typingTimeout = () => {
            isTyping = false;
            socket.emit('typing');
        };

    },

    scrollToBottom: () => {
        chatForm.scrollTop = chatForm.scrollHeight
        //window.scrollTo(0, document.body.scrollHeight); this worked
    }
}

export default ChatClient.init()