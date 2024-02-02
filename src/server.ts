import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/transactions', async () => {
  const transactions = await knex('transactions').insert({
    id: crypto.randomUUID(),
    title: 'Transaction test',
    amount: 100,
  })

  return transactions
})

app.listen({ port: 3333 }).then(() => {
  console.log('Server listening on port 3000')
})
