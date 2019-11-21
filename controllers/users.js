const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
    try {
        const body = request.body

        if (body.password.length < 3 || body.username.length < 3) {
            response.status(400).send({
                "error": "Password or username too short"
            })
            console.log('bad thing happend')
            return
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
            blogs: body.blogs || []
        })

        const savedUser = await user.save()

        response.json(savedUser)
    } catch (exception) {
        if (exception.name === 'ValidationError') {
            response
                .status(400)
                .send({
                    "error": "Excepts `username` to be unique"
                })
        }
        next(exception)
    }
})

module.exports = usersRouter