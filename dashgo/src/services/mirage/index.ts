import {
  createServer,
  Factory,
  Model,
  Response,
  ActiveModelSerializer,
} from 'miragejs'
import { faker } from '@faker-js/faker'

type User = {
  name: string
  email: string
  createdAt: string
}

export function makeServer() {
  const server = createServer({
    serializers: {
      application: ActiveModelSerializer,
    },
    models: {
      user: Model.extend<Partial<User>>({}),
    },

    factories: {
      user: Factory.extend({
        name(i) {
          return `User ${i + 1}`
          // return faker.internet.userName()
        },
        email() {
          return faker.internet.email().toLowerCase()
        },
        createdAt() {
          return faker.date.recent(10)
        },
      }),
    },

    seeds(server) {
      server.createList('user', 200)
    },

    routes() {
      this.namespace = 'api'
      this.timing = 750 // delay

      this.get('/users', function (schema, req) {
        // eslint-disable-next-line camelcase
        const { page = 1, per_page = 10 } = req.queryParams

        const total = schema.all('user').length

        const pageStart = (Number(page) - 1) * Number(per_page)
        const pageEnd = pageStart + Number(per_page)

        const users = this.serialize(schema.all('user')).users.slice(
          pageStart,
          pageEnd,
        )

        return new Response(200, { 'x-total-count': String(total) }, { users })
      })
      this.get('/users/:id')
      this.post('/users')

      this.namespace = '' // retornando namespace vazio para não atrapalhar rotas da api já existentes
      this.passthrough()
    },
  })

  return server
}
