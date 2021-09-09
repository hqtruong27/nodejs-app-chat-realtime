'use-strict'

const wrapper = document.querySelector('.wrapper')
const ACCESS_TOKEN = localStorage.getItem('user')

const Login = {
    init: () => {
        Login.checkToken()
        const form = document.querySelector('#form-login')
        const form__password = document.querySelector('.form__password')
        const username = document.querySelector('#login__username')
        const password = document.querySelector('#login__password')

        if (wrapper) {
            form.addEventListener('submit', (e) => {
                e.preventDefault()
                const requestBody = { name: username.value, password: password.value }
                axios.post('/api/auth/login', requestBody).then(result => {
                    localStorage.setItem('user', result.data.token)
                    location.replace('/')
                }).catch(err => {
                    document.querySelectorAll('.form__error').forEach((x) => x.remove())
                    const node = document.createElement('div')
                    node.className = 'form__error'
                    node.innerHTML = `<span style="color:#c22e32">${err.response.data.message}</span>`
                    form__password.parentNode.insertBefore(node, form__password.nextSibling)
                })
            })
        }
    },
    checkToken: () => {
        axios.get('/api/auth/checkToken', {
            headers: { Authorization: 'Bearer ' + ACCESS_TOKEN }
        }).then((response) => {
            if (response.status === 200)
                location.replace('/')
        })
    }
}

export default Login.init()