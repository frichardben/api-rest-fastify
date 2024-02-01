import fastify from 'fastify'

const server = fastify()

server.all('/', async (request, reply) => {
  return { hello: 'world' }
})
