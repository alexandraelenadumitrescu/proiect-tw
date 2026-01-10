const express = require('express')
const cors = require('cors')
//importam utilitarele pt documentatia API
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const { PrismaClient } = require('./generated/prisma/client.ts')
const { PrismaPg } = require('@prisma/adapter-pg')

//incarcam fisierul de configurare Swagger din format YAML
const swaggerDocument = YAML.load('./swagger.yaml')

require('dotenv').config() //incarca variabilele din .env

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

const app = express()
// app.use(cors()) //permite frontedului sa acceseze serverul
app.use(express.json()) //permite serverului sa citeasca date JSON
//setam ruta unde va fi afisata documentatia interactiva
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
const PORT = process.env.PORT || 6666
app.get('/', (req, res) => {
  res.send('Serverul backend functioneaza corect!')
})

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.listen(PORT, () => {
  console.log(`Serverul ruleaza pe portul http://localhost:${PORT}`)
  console.log(`Documentatie disponibila la: http://localhost:${PORT}/api-docs`)
})
//documentatia e vizibila la http://localhost:5000/api-docs
