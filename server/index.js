const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')
require('dotenv').config() //incarca variabilele din .env

const app = express()
app.use(cors()) //permite frontedului sa acceseze serverul
app.use(express.json()) //permite serverului sa citeasca date JSON
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
const PORT = process.env.PORT || 5000
app.get('/', (req, res) => {
    res.send('Serverul backend functioneaza corect!')
})

app.listen(PORT, ()=>{
    console.log(`Serverul ruleaza pe portul ${PORT}`)
})
