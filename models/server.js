const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
const { socketController } = require('../sockets/socket.controller');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.server = require('http').createServer( this.app);
        this.io     = require('socket.io')(this.server);

        this.paths = {
            auth:       '/api/auth',
            categories: '/api/categories',
            product:    '/api/products',
            users:      '/api/users',
            search:     '/api/search',
            uploads:     '/api/uploads'

        }
        // this.usersRoutesPath = '/api/users';
        // this.authPath        = '/api/auth'; 

        //Conectar a base de datos
        this.connectDB();

        // MIDDLEWARES - funcion que siempre se ejecutará cuando se levante el server
        this.middlewares();

        // RUTAS DE APP
        this.routes();

        //SOCKETS
        this.sockets();
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares(){

        //CORS
        this.app.use(cors()); 

        
        //Lectura y parseo del body
        this.app.use( express.json() );
        
        //directorio publico
        this.app.use( express.static('public') );

        //Fileupload - carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        })); 

    }

    routes(){
        
        this.app.use(this.paths.auth, require('../routes/auth.routes'))
        this.app.use(this.paths.users, require('../routes/user.routes'))
        this.app.use(this.paths.product, require('../routes/products.routes'))
        this.app.use(this.paths.categories, require('../routes/categories.routes'))
        this.app.use(this.paths.search, require('../routes/search.routes'))
        this.app.use(this.paths.uploads, require('../routes/uploads.routes'))


    }

    sockets(){
        this.io.on('connection', (socket) => socketController(socket, this.io ))
    }

    listen(){
        this.server.listen(this.port, () =>{
            console.log('Server running on port: ', this.port);
            
        } )
         
    }


}

module.exports = Server;