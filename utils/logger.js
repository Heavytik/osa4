
const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params)
    }
}

const error = (...params) => {
    consol.log(...params)
}

module.exports = {
    info,
    error
}
