import { it, describe, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/server'

describe('Transactions', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be abled to create a new transaction', async () => {
        await request(app.server).post('/transactions').send({
            title: 'New Transaction',
            amount: 1000,
            type: 'credit'
        }).expect(201)
    })
})