# API do Pulse Robot

Esta é uma API REST simulada para o projeto Pulse Robot, criada com json-server.

## Configuração

A API já está configurada e pronta para uso. Para iniciar o servidor, execute:

```bash
npm run api
```

O servidor será iniciado na porta 3000: http://localhost:3000

## Endpoints Disponíveis

### Robôs

- `GET /robots` - Listar todos os robôs
- `GET /robots/:id` - Obter detalhes de um robô específico
- `POST /robots` - Adicionar um novo robô
- `PUT /robots/:id` - Atualizar um robô existente
- `DELETE /robots/:id` - Remover um robô

### Depoimentos

- `GET /testimonials` - Listar todos os depoimentos
- `GET /testimonials/:id` - Obter um depoimento específico
- `POST /testimonials` - Adicionar um novo depoimento
- `PUT /testimonials/:id` - Atualizar um depoimento existente
- `DELETE /testimonials/:id` - Remover um depoimento

### Contatos

- `GET /contacts` - Listar todos os contatos
- `GET /contacts/:id` - Obter um contato específico
- `POST /contacts` - Adicionar um novo contato
- `PUT /contacts/:id` - Atualizar um contato existente
- `DELETE /contacts/:id` - Remover um contato

### Lista de Espera

- `GET /waitlist` - Listar todos os emails na lista de espera
- `GET /waitlist/:id` - Obter um email específico da lista de espera
- `POST /waitlist` - Adicionar um novo email à lista de espera
- `PUT /waitlist/:id` - Atualizar um email existente na lista de espera
- `DELETE /waitlist/:id` - Remover um email da lista de espera

## Usando com Postman

1. Abra o Postman
2. Crie uma nova coleção chamada "Pulse Robot API"
3. Adicione requisições para os endpoints acima

### Exemplos de Requisições

#### Listar todos os robôs

- Método: GET
- URL: http://localhost:3000/robots

#### Obter um robô específico

- Método: GET
- URL: http://localhost:3000/robots/1

#### Adicionar um novo robô

- Método: POST
- URL: http://localhost:3000/robots
- Headers: Content-Type: application/json
- Body (raw JSON):

```json
{
  "model": "Orion",
  "version": "1.5",
  "height": "5'11\"",
  "weight": "170lbs",
  "capacity": "65lbs",
  "uptime": "7hr",
  "movement": "1.7M/S",
  "features": [
    "Terrain Adaptation",
    "Voice Recognition",
    "Object Manipulation"
  ],
  "description": "Versatile Assistant for Complex Environments",
  "image": "/robot-orion.png",
  "available": true
}
```

#### Atualizar um robô existente

- Método: PUT
- URL: http://localhost:3000/robots/1
- Headers: Content-Type: application/json
- Body (raw JSON): Inclua apenas os campos que deseja atualizar

#### Remover um robô

- Método: DELETE
- URL: http://localhost:3000/robots/2

## Filtros e Ordenação

O json-server suporta filtros, ordenação e paginação:

- Filtrar: `GET /robots?available=true`
- Ordenar: `GET /robots?_sort=model&_order=asc`
- Paginar: `GET /robots?_page=1&_limit=10`
- Buscar: `GET /robots?q=Atlas`

## Relacionamentos

O json-server também suporta relacionamentos entre recursos, que podem ser expandidos conforme necessário.