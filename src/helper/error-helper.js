export function validator(message) {
    const errorMessage = document.querySelector('.error-message')
    if (message == null || message == '') {
        if (errorMessage) {
            return;
        }

        const node = document.querySelector('.error')
        const error = document.createElement('span')
        error.className = 'error-message'
        error.style.color = 'red'
        error.textContent = 'Please enter a message'
        node.parentNode.insertBefore(error, node.nextSibling)
        return;
    }

    if (errorMessage) errorMessage.remove()
}