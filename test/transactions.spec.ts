import { it, describe, beforeAll, afterAll, expect } from 'vitest'
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

    it('should be abled to list all transactions', async () => {
        const createTransactionResponse =  await request(app.server).post('/transactions').send({
            title: 'New Transaction',
            amount: 1000,
            type: 'credit'
        })

        const cookies = createTransactionResponse.get('Set-Cookie')

       const listTransactionResponse =  await request(app.server)
        .get('/transactions')
        .send()
        .set('Cookie', cookies)

    
       expect(listTransactionResponse.body.transactions).toEqual([
        expect.objectContaining({
            title: 'New Transaction',
            amount: 1000,
        })
       ])

    })
})