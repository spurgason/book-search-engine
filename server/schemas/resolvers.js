const { User } = require('../models/');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate(books)

                return userData;
            }

            throw new AuthenticationError('Not logged in');
        }
    },

    Mutation: {
        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email, password});
            const token = signToken(user);

            return { token, user };
        },

        login: async (parent, args, { email, password }) => {
            const user = await User.findOne({ email })

            if (!user) {
                throw new AuthenticationError('Incorrect Login');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect Login');
            }

            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, args, context) => {
            if (context.user) {

                const savedBook = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBook: input } },
                    { new: true }
                );

                return savedBook;
            }
            throw new AuthenticationError('Login to use this feature!');
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const removedBook = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBook: { bookId } } },
                    { new: true }
                );

                return removedBook
            }
            throw new AuthenticationError('Login to use this feature!');

        }

    }
};

module.exports = resolvers;