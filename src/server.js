const express = require('express');
const bodyParser = require('body-parser');
const comentariosRoutes = require('./routes/comentarios');
const estudiantesRoutes = require('./routes/estudiantes');

require('dotenv').config();

const app = express();
const port = process.env.DB_PORT || 3000;

app.use(bodyParser.json());

app.use('/estudiantes', estudiantesRoutes);
app.use('/comentarios', comentariosRoutes);


app.listen(port, () => {
    console.log(`Servidor Express en ejecución en http://localhost:${port}`);
});
