import { ForbiddenError } from 'apollo-server'

export default {
  Query: {
    messages: (_, args, { models }) => {
      return models.Message.find()
    },
    message: (_, { id }, { models }) => {
      return models.Message.findById({ id })
    },
  },
  Mutation: {
    createMessage: async (parent, { text, userId }, { me, models }) => {
      if (!me) {
        throw new ForbiddenError('User not authenticated.')
      }

      try {
        return await models.Message.create({
          text,
          userId: userId || me?.id
        })
      } catch (err) {
        throw new Error('gotta have text yo')
      }
    },
    deleteMessage: async (_, { id }, { models }) => {
        return models.Message.deleteOne({ id })
    }
  },
  Message: {
    user: async (message, args, { models })  => {
      return models.User.findById(message.userId)
    },
  },
}
