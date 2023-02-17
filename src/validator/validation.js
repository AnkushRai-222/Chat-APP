const validName = function (name) {
    const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
    return nameRegex.test(name)
}

const validPhone = function (mobile) {
    const mobileRegex = /^[6789]\d{9}$/
    return mobileRegex.test(mobile)
}

const validEmail = function (email) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-][a-z]{1,4}$/
    return emailRegex.test(email)
}
const validPassword = function (password) {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/
    return passwordRegex.test(password)
}

module.exports = {validEmail,validName,validPassword,validPhone}