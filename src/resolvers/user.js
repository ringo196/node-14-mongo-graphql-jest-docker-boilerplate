import jwt from 'jsonwebtoken'
import { AuthenticationError, UserInputError } from 'apollo-server-errors'

const createToken = async ({ id, email, username }, secret, expiresIn) => {
  return jwt.sign({ id, email, username }, secret, { expiresIn })
}

export default {
  Query: {
    me: async (_, __, { models, me }) => {
      if (!me) {
        return null
      }

      return models.User.findById(me.id)
    },
    user: (parent___, { id }, { models }) => {
      return models.User.findById(id)
    },
    users: (_, args, { models }) => {
      try {
        return models.User.find()
      } catch (err) {
        console.log(err)
        throw new Error(err)
    }
    },
  },
  User: {
    messages: (user, args, { models }) => {
      return models.Message.find({ userId: user.id })
    }
  },
  Mutation: {
    signUp: async (_, { username, email, password }, { models, secret }) => {
      try {
        const user = await models.User.create({
          username,
          email,
          password
        })

        return { token: createToken(user, secret, '30m') }
      } catch (err) {
        throw new Error(err)
      }
    },
    signIn: async (_, { login, password }, { models, secret }) => {
      const user = await models.User.findByLogin(login)

      if (!user) {
        throw new UserInputError('Login or password does not match')
      }

      const isValid = user.validatePassword(password)

      if (!isValid) {
        throw new AuthenticationError('Login or password does not match')
      }

      return { token: createToken(user, secret, '30m') }
    }
  }
}

