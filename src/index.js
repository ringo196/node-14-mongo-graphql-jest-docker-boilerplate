import 'dotenv/config';
import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'
import { ApolloServer, AuthenticationError } from 'apollo-server-express'

import schema from './schema'
import resolvers from './resolvers'
import models, { connectDb } from './models'
import { createUsersWithMessages } from './utils'

export let getDbConnection

export const createServer = async () => {
	const app = await express()
	await app.use(cors())

	const getMe = async req => {
		const token = req.headers['x-token']

		if (token) {
			try {
				return await jwt.verify(token, process.env.SECRET)
			} catch {
				throw new AuthenticationError(
					'Session expired. Please sign in again.'
				)
			}
		}
	}

	const server = await new ApolloServer({
		introspection: true,
		typeDefs: schema,
		resolvers,
		context: async ({ req, connection }) => {
			const me = await getMe(req)
			if (connection) {
				return {
					models
				}
			}
			if (req) {
				return {
					models,
					me,
					secret: process.env.SECRET
				}
			}
		}
	});

	await server.applyMiddleware({ app, path: '/graphql' })

	const isTest = !!process.env.TEST_DATABASE_URL;
	const isProduction = process.env.NODE_ENV === 'production';
	const port = process.env.PORT || 8000;

	getDbConnection = await connectDb().then(async mongo => {
		console.log(isTest, 'isTest')
		if (isTest || isProduction) {
			await mongo.connection.db.dropDatabase()
			console.log('db dropped yoyoyo')

			await createUsersWithMessages(new Date());
		}

		app.listen({ port }, () => {
			console.log(`Apollo Server on http://localhost:${port}/graphql`);
		});
	});

	return server
}
