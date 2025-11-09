import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mercadinho JS",
      version: "1.0.0",
      description: "Documentação da API com Swagger",
    },
    servers: [
      {
        url: "https://mercadinhoestoque.onrender.com",
      },
    ],
    components: {
      schemas: {
        Supplier: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Fornecedor XPTO" },
            telephone: { type: "string", example: "1199999999" },
            address: { type: "string", example: "Rua das Flores, 123" },
            cnpj: { type: "string", example: "12.345.678/0001-99" },
          },
          required: ["id", "name", "telephone", "endereco", "cnpj"],
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Bebidas" },
            description: { type: "string", example: "Refrigerantes e sucos" },
          },
          required: ["id", "name"],
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Notebook" },
            description: { type: "string", example: "Notebook Dell i7" },
            unitPrice: { type: "number", example: 4500.0 },
            categoryId: { type: "integer", example: 1 },
          },
          required: ["id", "name", "unitPrice", "categoryId"],
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "johndoe@example.com" },
            password: { type: "string", example: "123456" },
            accessType: { type: "integer", example: 1 },
          },
          required: ["id", "name", "email", "password", "accessType"],
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
