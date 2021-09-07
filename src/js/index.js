import { getHash } from '.././helper/helper.js';
const socket = io()
const chatForm = document.querySelector('#chat-form')
const chatMessage = document.querySelector('.chat-message')
const sendMessage = document.querySelector('.send-message')

const ACCESS_TOKEN = localStorage.getItem('user') || ''
let User;

const ChatClient = {
    init: () => {
        ChatClient.user()
        ChatClient.socket()
        ChatClient.event()
    },
    user: async () => {
        const response = await axios.get('http://localhost:3000/api/personal', {
            headers: {
                Authorization: 'Bearer ' + ACCESS_TOKEN
            }
        })

        console.log(response)

        if (response.status === 200) {
            return User = response.data
        }

        return window.location.href = 'https://google.com'
    },

    socket: () => {
        const chatArea = document.querySelector('.chat-area-main')

        socket.on('user-chat', (res) => {
            console.log(res)
            const user = res.user
            const isOwner = user.id == User.id ? 'owner' : ''
            const image = user?.image?.slice(0, 4) == 'http' ? user?.image : 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png'
            const str = `<div class="chat-msg ${isOwner}">
                            <div class="chat-msg-profile">
                                <img class="chat-msg-img"
                                    src="${image}"
                                    alt="" />
                                <div class="chat-msg-date">${user.name} - Message seen 2.50pm</div>
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

    event: () => {
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
            if (!User) {
                ClientChat.user()
            }

            const message = chatMessage.value.trim()
            if (message != '') {
                socket.emit('on-chat', { user: User, message: message })
                chatMessage.value = ''
            }
        })
    },

    scrollToBottom: () => {
        chatForm.scrollTop = chatForm.scrollHeight
    }
}

export default ChatClient.init()