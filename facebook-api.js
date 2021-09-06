const axios = require('axios')

init = () => {

}

isLogin = async () => {
    axios.get('https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed').then((response) => {
        console.log(response)
    })
}

module.exports = {
    init,
    isLogin
}