const {gql} = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        password: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Query {
        users: [User]
        user(_id: String, username: String): User
        me: User
    }

    input SavedBookInput {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Mutation {
        login(email: String!, password: String!) : Auth
        addUser(username: String!, email: String!, password: String!) : Auth
        saveBook(input: SavedBookInput) : User
        removeBook(bookId: String!) : User
    }

    type Auth {
        token: ID!
        user: User
    }
`;

module.exports = typeDefs;