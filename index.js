const { request, response } = require('express')
const cors = require('cors')
const express = require('express')
const uuid = require('uuid')


const port = 3001
const app = express()
app.use(express.json())
app.use(cors())

/*
    QUERY PARAMS => https://localhost:3001/users?name=Max&age=35 // FILTROS
    ROUTE PARAMS => /users/2    // BUSCAR - DELETAR - ATUALIZAR ALGO ESPECIFICO
    REQUEST BODY => {"name": "Max", "age": 35}

    - GET        => BUSCAR INFORMAÇÕES NO BACK-END
    - POST       => CRIAR INFORMAÇÕES NO BACK-END
    - DELETE     => DELETAR INFORMAÇÕES NO BACK-END
    - PUT/PATCH  => ALTERAR/ATUALIZAR INFORMAÇÕES NO BACK-END

    - MIDDLEWARE => TEM O PODER DE PARAR E ALTERAR OS DADOS DA REQUISIÇÃO
*/

const users = []

const checkUserId = (request, response, next) => {// MIDDLEWARE tem como padrão três parâmetros, (request, response, next)
    const { id } = request.params

    const position = users.findIndex(user => user.id === id)// FUNÇAO USADA PARA PROCURAR UM ID, DENTRO DE UM ARRAY

    if (position < 0) {
        return response.status(404).json({ menssage: "Usuário não encontrado" })
    }


    request.userPosition = position // MIDDLEWARE tem o poder de criar parâmetros que podem ser chamados nas requisições
    request.userId = id // MIDDLEWARE tem o poder de criar parâmetros que podem ser chamados nas requisições

    next() // NEXT é necessário para informar ao MIDDLEWARE que prossiga para as proximas operações. Caso esqueça o NEXT, o MIDDLEWARE fica em loop
}

// - GET        => BUSCAR INFORMAÇÕES NO BACK-END
app.get('/users', (request, response) => {
    return response.json(users)
})

//- POST       => CRIAR INFORMAÇÕES NO BACK-END
app.post('/users', (request, response) => {
    const { name, age } = request.body
    const user = { id: uuid.v4(), name, age }// UUID.V4() CRIAR UM ID ALEATÓRIO PARA O ARRAY
    users.push(user)// PUSH ENVIA UM OBJETO PARA UM ARRAY
    return response.status(201).json(user)
})

//- PUT/PATCH  => ALTERAR/ATUALIZAR INFORMAÇÕES NO BACK-END
app.put('/users/:id', checkUserId, (request, response) => {
    const { name, age } = request.body
    const position = request.userPosition // MIDDLEWARE criou este parâmetro (userId), para otimizar o código. e o MIDDLEWARE ele fica responsavel por fazer o função
    const id = request.userId // MIDDLEWARE criou este parâmetro (userId), para otimizar o código. e o MIDDLEWARE ele fica responsavel por fazer o função


    const updateUser = { id, name, age }

    users[position] = updateUser

    return response.json(updateUser)
})

//- DELETE     => DELETAR INFORMAÇÕES NO BACK-END
app.delete('/users/:id', checkUserId, (request, response) => {
    const position = request.userPosition // MIDDLEWARE criou este parâmetro (userId), para otimizar o código. e o MIDDLEWARE ele fica responsavel por fazer o função

    users.splice(position, 1)// USADO PARA EXCLUIR OBJETOS DENTRO DE UM ARRAY

    return response.status(204).json()
})




app.listen(port, () => {
    console.log(`Server started in port ${port}👍`)
}) 