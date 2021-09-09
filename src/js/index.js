//import { getHash } from '.././helper/helper.js';
const chatForm = document.querySelector('#chat-form')
const chatMessage = document.querySelector('.chat-message')
const sendMessage = document.querySelector('.send-message')
const typing = document.querySelector('#chat-sending')
const ACCESS_TOKEN = localStorage.getItem('user')

const ChatClient = {
    init: () => {
        ChatClient.connect()
        ChatClient.user()
    },
    connect: () => {
        let socket = io({ auth: { token: ACCESS_TOKEN } })
        socket.on('user-info', (res) => {
            socket.user = res.user
            socket.emit("join-room", { user: res.user, roomName: "room1" })
        })

        socket.on("connect_error", (err) => {
            console.log(err instanceof Error); // true
            console.log(err.data);
            console.log(err.message);
            socket.disconnect()
            location.href = '/login.html'
        });

        ChatClient.socket(socket)
        ChatClient.event(socket)
    },
    user: async () => {
        try {
            const response = await fetch('/api/personal', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + ACCESS_TOKEN
                }
            })

            if (!response.ok) {
                window.location.href = '/login.html'
            }

            const user = await response.json()
            console.log(user)
            ChatClient.getGroups(user)
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

        let timeout;
        const onInput = (user) => {
            clearTimeout(timeout);
            socket.emit('typing', `${user.name} is typing...`);
            timeout = setTimeout(typingTimeout, 3000);
        }
        const typingTimeout = () => {
            socket.emit('typing');
        };

    },

    getGroups: async (user) => {
        const result = await axios.get(`/api/group?userId=${user._id}`)
        let html = ``
        for (const group of await result.data) {
            html += `<div class="msg active" id="${group._id}">
                        <div class="msg-profile group">
                            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"
                                stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                                <path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2zM12 22v-6.5" />
                                <path d="M22 8.5l-10 7-10-7" />
                                <path d="M2 15.5l10-7 10 7M12 2v6.5" />
                            </svg>
                        </div>
                        <div class="msg-detail">
                            <div class="msg-username">${group.name}</div>
                            <div class="msg-content">
                                <span class="msg-message">Truonghq: Nodejs is fun!!</span>
                                <span class="msg-date">28m</span>
                            </div>
                        </div>
                    </div>`
        }

        console.log(result.data);

        const wrapper = document.querySelector('.conversation-area')
        const node = document.createElement('div')
        node.innerHTML = html
        wrapper.appendChild(node, wrapper.firstChild)
    },

    scrollToBottom: () => {
        chatForm.scrollTop = chatForm.scrollHeight
        //window.scrollTo(0, document.body.scrollHeight); this worked
    }
}

export default ChatClient.init()