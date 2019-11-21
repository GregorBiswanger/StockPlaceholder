function bootstrap(app) {
    // swagger definition
    const swaggerJSDoc = require('swagger-jsdoc');
    const swaggerDefinition = {
        info: {
            title: "Stock Placerholder API",
            description: "Simple Stock Web-Service with fake data for my workshops.",
            termsOfService: "http://swagger.io/terms/",
            contact: {
                name: "API Support",
                url: "http://about.me/gregor.biswanger",
                email: "gregor.biswanger@web-enliven.de"
            },
            license: {
                name: "MIT",
                url: "http://www.apache.org/licenses/LICENSE-2.0.html"
            },
            version: "1.0.0"
        },
        host: 'stockplaceholder.herokuapp.com',
        basePath: '/',
        swagger: "2.0",
        paths: {},
        definitions: {},
        responses: {},
        parameters: {},
        securityDefinitions: {}
    };

    // options for the swagger docs
    const options = {
        // import swaggerDefinitions
        swaggerDefinition: swaggerDefinition,
        // path to the API docs
        apis: ['./routes/*.js']
    };

    // initialize swagger-jsdoc
    const swaggerSpec = swaggerJSDoc(options);

    // serve swagger
    const swaggerUi = require('swagger-ui-express');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, false));
}

module.exports.bootstrap = bootstrap;