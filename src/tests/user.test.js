import 'regenerator-runtime/runtime'
// import { describe, expect, test, beforeAll, afterAll, it} from '@jest/globals'
import * as api from './utils/api'
import models, { connectDb } from '../models'

let db
let expectedUsers
let expectedUser
let expectedAdminUser

beforeAll(async () => {
  db = await connectDb('mongodb://127.0.0.1:27017/covid-tracker')

  expectedUsers = await models.User.find()

  expectedUser = expectedUsers.filter(
    user => user.role !== 'ADMIN',
  )[0]

  expectedAdminUser = expectedUsers.filter(
    user => user.role === 'ADMIN',
  )[0]
})

afterAll(async () => {
  await db.connection.close();
})

describe('User', () => {
  it('returns all users', async () => {
    const result = await api.users()

    expect(result.data.data.users).toHaveLength(2)
    expect(result.data.data.users.find(user => user.username === 'rwieruch')).toBeTruthy()
    expect(result.data.data.users.find(user => user.username === 'ddavids')).toBeTruthy()
  })



})
