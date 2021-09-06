const socket = io()
const NEW_USER = true

let user = JSON.parse(localStorage.getItem('user'))
const chatForm = document.querySelector('#chat-form')
const chatMessage = document.querySelector('.chat-message')
const sendMessage = document.querySelector('.send-message')

if (chatForm) {
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
        localStorage.getItem('user') ?? fakeUser(NEW_USER)

        const message = chatMessage.value.trim()
        if (message != '') {
            socket.emit('on-chat', { user: user, message: message })
            chatMessage.value = ''
        }
    })

    const chatArea = document.querySelector('.chat-area-main')

    socket.on('user-chat', (data) => {
        console.log(data)
        const isOwner = data.user.id == user.id ? 'owner' : ''
        const image = data.user?.image?.slice(0, 4) == 'http' ? data.user.image : 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png'
        const str = `<div class="chat-msg ${isOwner}">
                        <div class="chat-msg-profile">
                            <img class="chat-msg-img"
                                src="${image}"
                                alt="" />
                            <div class="chat-msg-date">${data.user.name} - Message seen 2.50pm</div>
                        </div>
                        <div class="chat-msg-content">
                            <div class="chat-msg-text">${data.message}</div>
                        </div>
                    </div>`

        const node = document.createElement('message')
        node.innerHTML = str
        chatArea.appendChild(node.firstChild)
        scrollToBottom()
    })
}

const scrollToBottom = () => {
    chatForm.scrollTop = chatForm.scrollHeight
}

const fakeUser = (requireNewUser) => {
    if (user == null || requireNewUser) {
        user = {}
        let userName
        while (!userName || userName == '') userName = prompt('Input your user name')

        user.id = crypto.randomUUID()
        user.name = userName
        user.image = prompt('Input your image link recommend multiple of 64x64')
        localStorage.setItem("user", JSON.stringify(user))
    }
}
fakeUser()