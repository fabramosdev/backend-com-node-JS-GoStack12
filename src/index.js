const express = require('express')
const cors = require('cors')
const { uuid, isUuid } = require('uuidv4')

const app = express()
app.use(cors())
app.use(express.json())

const projects = []

function logRequests(request, response, next) {
    const { method, url } = request
    const logLabel = `MÉTODO [${method.toUpperCase()}] - ROTA [${url}] - RENDERING IN`
    console.time(logLabel)
    next()
    console.timeEnd(logLabel)
}

function validateProjectId(request, response, next) {
    const { id } = request.params

    if(!isUuid(id)){
        return response.status(400).json({ error: 'Invalid project ID' })
    }
    return next()
}

app.use(logRequests)
app.use('/projects/:id', validateProjectId)

app.get('/projects', (request, response) => {
    const { title } = request.query

    const results = title 
        ? projects.filter(project => project.title.includes(title)) 
        : projects

    return response.json(results)
})

app.post('/projects', (request, response) => {
    const { title, owner }  = request.body

    const project = { id: uuid(), title, owner }

    projects.push(project)

    return response.json(project)
})

app.put('/projects/:id', (request, response) => {
    // pegando o id pelo parâmetro da rota
    const { id } = request.params

    // pegando os dados pelo corpo da requisição
    const { title, owner } = request.body 

    //findIndex => procura pelo índice [index/posição] no array
    const projectIndex = projects.findIndex(project => project.id === id)

    //se não encontrar o id dentro de algum index no array, erro 400
    if(projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.' })
    }

    //montando o novo dado com id passado pela rota + request Body - (dado editado)
    const project = { id, title, owner }

    /**
     * Indo no array de projetos e procurando pelo índice[projectIndex] e 
     * trocando pela const project [linha 40 - project montado e editado]
     */
    projects[projectIndex] = project

    //retornando JSON com o projeto já editado
    return response.json(project) 
})

app.delete('/projects/:id', (request, response) => {
    //pegando id pelo parâmetro da rota
    const { id } = request.params
    //findIndex => procura pelo índice [index/posição] no array
    const projectIndex = projects.findIndex(project => project.id === id)
    //se não encontrar o id dentro de algum index no array, erro 400
    if(projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.' })
    }
    // retirar esse indice dentro do array
    projects.splice(projectIndex, 1)
    return response.status(204).send()
})

app.listen(3333, () => {
    console.log('🤘 Backend started!')
})