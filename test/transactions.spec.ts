import { it, describe, beforeAll, afterAll, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/server'

describe('Transactions', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })
    
    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    it('should be able to create a new transaction', async () => {
        await request(app.server).post('/transactions').send({
            title: 'New Transaction',
            amount: 1000,
            type: 'credit'
        }).expect(201)
    })

    it('should be able to list all the transactions.', async () => {
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

    it('should be able to retrieve a specific transaction by its unique identifier.', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
            title: 'New Transaction',
            amount: 1000,
            type: 'credit'
        })

        const cookies = createTransactionResponse.get('Set-Cookie')

       const listTransactionsResponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)

        const transactionId = listTransactionsResponse.body.transactions[0].id
        

        const getTransactionResponse = await request(app.server)
        .get(`/transactions/${transactionId}`)
        .set('Cookie', cookies)

    
       expect(getTransactionResponse.body.transaction).toEqual(
        expect.objectContaining({
            title: 'New Transaction',
            amount: 1000
        })
       )

    })

    it('should be able to get the summary.', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
            title: 'New Transaction',
            amount: 1000,
            type: 'credit'
        })

        const cookies = createTransactionResponse.get('Set-Cookie')

        await request(app.server)
            .post('/transactions')
            .set('Cookie', cookies)
            .send({
                title: 'Debit Transaction',
                amount: 400,
                type: 'debit'
            })

       const summaryResponse = await request(app.server)
        .get('/transactions/summary')
        .set('Cookie', cookies)
    
       expect(summaryResponse.body.summary).toEqual([{
        amount: 600
       }])

    })

    it('should not be able to access unauthorized data.', async () => {
        await request(app.server)
        .post('/transactions')
        .send({
            title: 'New Transaction',
            amount: 1000,
            type: 'credit'
        })
        .expect(201)

        await request(app.server)
        .get('/transactions')
        .send()
        .expect(401)
    })
 
})