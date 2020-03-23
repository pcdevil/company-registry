# company-registry
A simple showcase application for a company registry API.

### Table of Contents
- **[Usage]**
  - **[Live]**
  - **[Local]**
- **[Development]**
  - **[Installation]**
  - **[Handling the MongoDB instance]**
  - **[Automated Tests]**
  - **[Linting rules]**
- **[Types of responses]**
  - **[Success response]**
  - **[Bad request response]**
  - **[Not found response]**
- **[Endpoints]**
  - **[Create a category]**
  - **[Get a category]**
  - **[Amend a category]**
  - **[Remove a category]**
  - **[Get all categories]**
  - **[Create a company]**
  - **[Get a company]**
  - **[Amend a company]**
  - **[Add a category to a company]**
  - **[Remove a category from a company]**
  - **[Remove a company]**
  - **[Get all companies]**
- **[License]**

---

## Usage

### Live

The application is deployed on [Heroku] to be tested easily.

| Environment | Url                                            | Note                        |
| ----------- | ---------------------------------------------- | --------------------------- |
| Staging     | https://company-registry-staging.herokuapp.com | Auto deployment from master |
| Production  | https://company-registry.herokuapp.com         | Manual deployment           |

All endpoints listed in the "Endpoints" section should be accessible on the test site.

### Local

The application can be installed and used locally via the installation steps described in the "Development" section.

---

## Development

### Installation
Use the following steps to install the application on your local machine:
- Fork/clone the repository
- Optional: Set the right version of Node.js with [nvm]
- Install dependencies
- Copy the [.env.example](.env.example) file into a new `.env` file and populate
  it with the correct data
- Setup a MongoDB resource
  - Optional: use [Docker] to easily bootstrap the built-in database instance
    (described below)
- Start the server via the `start` npm task
  - Optional: use the `PORT` env variable to modify the default listening port
- Call the server via [Postman's API Client], or with [curl] on
  http://localhost:8080/ (as default port)

```bash
$ git clone git@github.com:pcdevil/company-registry.git
$ cd company-registry
$ cp .env.example .env
$ nano .env # fill out with correct data
$ make up # or use a custom MongoDB server
$ nvm install
$ npm install
$ npm start # or "PORT=9090 npm start"
```

---

### Handling the MongoDB instance
In case of no available database in reach you can start one with the help of
[Docker].

Use [make] to manage the database connection with the following tasks:

| Task    | Description                           |
| ------- | ------------------------------------- |
| help    | list all available tasks              |
| up      | up all containers                     |
| restart | restart all containers               |
| down    | down all containers                   |
| status  | get process report from the container |
| logs    | show last log lines                   |

**⚠ IMPORTANT**: To use the built-in MongoDB instance you have to set the
`MONGODB_PORT` variable inside the `.env` file too!

---

### Automated Tests
Automated tests are maintained in the [test](test/) folder.

You can run the test manually with the `npm test` command. Additionally, a watch
mode is available with the `npm run test:watch` command.

It is adviced to check test errors during development to catch and fix them in
this early stage.

There is also a GitHub Action set up on the repository which runs the tests on
every push.

---

### Linting rules
Alongside with tests there are linting rules configured on the repository with
[ESLint].

While the most widely used IDEs have the ability to resolve all fixable style
errors on save, you can run the `npm run lint` command to achieve the same
thing.

---

## Types of responses
The endpoints communicate with uniformalised responses. This will make the
return data predictable and reliable.

### Success response
On `200 OK` response there is always a `data` property as array to return all
the manipulated data:

```jsonc
{
  "statusCode": 200,
  "data": [/* returned data */],
}
```

### Bad request response
Finally, when an endpoint is called with invalid payload it returns a `400 Bad
Request` error:

```jsonc
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "body should have required property 'name'"
}
```

### Not found response
When an endpoint is called with non-existing `_id` it returns a `404 Not Found`
error with the following object:

```jsonc
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "the given id is not present in the collection"
}
```

---

## Endpoints
All endpoints are publicly accessible for requests and will return a `JSON`
object as response.

### Create a category
This endpoint puts a new category in the collection.

- **Path:** `/api/categories`
- **Method:** `PUT`
- **Payload:**
  - `name` _(string, unique)_: the name of the category
  ```jsonc
  {
    "name": "Test Category"
  }
  ```
- **Response:** The `data` will contain the new object with the given properties
  and the generated `_id`
  ```jsonc
  {
    "statusCode": 200,
    "data": [{
      "_id": "5e779b967fe9b57f29b40cbf",
      "name": "Test Category"
    }],
  }
  ```

---

### Get a category
This endpoint retrieves an existing category from the collection.

- **Path:** `/api/categories/:_id`
- **Params:**
  - `_id` _(ObjectId)_: the id of a category
- **Method:** `GET`
- **Response:** The `data` will contain the fetched object
  ```jsonc
  {
    "statusCode": 200,
    "data": [{
      "_id": "5e779b967fe9b57f29b40cbf",
      "name": "Test Category"
    }],
  }
  ```

---

### Amend a category
This endpoint updates an existing category in the collection.

- **Path:** `/api/categories/:_id`
- **Params:**
  - `_id` _(ObjectId)_: the id of a category
- **Method:** `PATCH`
- **Payload:** A `JSON` object with any combination of the previously described
  properties
  ```jsonc
  {
    "name": "Updated Test Category"
  }
  ```
- **Response:** The `data` will contain the updated object
  ```jsonc
  {
    "statusCode": 200,
    "data": [{
      "_id": "5e779b967fe9b57f29b40cbf",
      "name": "Updated Test Category"
    }],
  }
  ```

---

### Remove a category
This endpoint deletes an existing category from the collection.

- **Path:** `/api/categories/:_id`
- **Params:**
  - `_id` _(ObjectId)_ : the id of a category
- **Method:** `DELETE`
- **Response:** The `data` will contain the deleted object
  ```jsonc
  {
    "statusCode": 200,
    "data": [{
      "_id": "5e779b967fe9b57f29b40cbf",
      "name": "Test Category"
    }],
  }
  ```

---

### Get all categories
This endpoint retrieves all categories from the collection.

- **Path:** `/api/categories`
- **Method:** `GET`
- **Response:** The `data` will contain all the saved objects
  ```jsonc
  {
    "statusCode": 200,
    "data": [{
      "_id": "5e779b967fe9b57f29b40cbf",
      "name": "Test Category"
    }, {
      "_id": "5349b4ddd2781d08c09890f4",
      "name": "Real Category"
    }],
  }
  ```

---

### Create a company
This endpoint puts a new company in the collection.

- **Path:** `/api/companies`
- **Method:** `PUT`
- **Payload:**
  - `name` _(string, unique)_: the name of the company
  - `email` _(string)_: contact e-mail address of the company
  - `logoUrl` _(string, non-mandatory)_: url for the company logo (default: '')
  - `categories` _(array, non-mandatory)_: list of existing categories attached
    to the company (default: [])
  - `categories[]` _(ObjectId)_: the ids of categories
  ```jsonc
  {
    "name": "Test Company",
    "email": "contact@testcompany.org",
    "logoUrl": "https://placekitten.com/244/244",
    "categories": [
      "5e779b967fe9b57f29b40cbf",
      "5349b4ddd2781d08c09890f4"
    ]
  }
  ```
- **Response:** The `data` will contain the new object with the given properties
  and the generated `_id`
  ```jsonc
  {
    "statusCode": 200,
    "data": [{
      "_id": "5e78e463e94a446cb1a946b1",
      "name": "Test Company",
      "email": "contact@testcompany.org",
      "logoUrl": "https://placekitten.com/244/244",
      "categories": [
        "5e779b967fe9b57f29b40cbf",
        "5349b4ddd2781d08c09890f4"
      ]
    }],
  }
  ```

---

### Get a company
This endpoint retrieves an existing company from the collection.

- **Path:** `/api/companies/:_id`
- **Params:**
  - `_id` _(ObjectId)_: the id of a company
- **Method:** `GET`
- **Response:** The `data`  will contain the fetched object
  ```jsonc
  {
    "statusCode": 200,
    "data": [{
      "_id": "5e78e463e94a446cb1a946b1",
      "name": "Test Company",
      "email": "contact@testcompany.org",
      "logoUrl": "https://placekitten.com/244/244",
      "categories": [
        "5e779b967fe9b57f29b40cbf",
        "5349b4ddd2781d08c09890f4"
      ]
    }],
  }
  ```

---

### Amend a company
This endpoint updates an existing company in the collection.

- **Path:** `/api/companies/:_id`
- **Params:**
  - `_id` _(ObjectId)_: the id of a company
- **Method:** `PATCH`
- **Payload:** A `JSON` object with any combination of the previously described
  properties
  ```jsonc
  {
    "name": "Updated Test Company"
  }
  ```
- **Response:** The `data` will contain the updated object
  ```jsonc
  {
    "statusCode": 200,
    "data": [{
      "_id": "5e78e463e94a446cb1a946b1",
      "name": "Updated Test Company",
      "email": "contact@testcompany.org",
      "logoUrl": "https://placekitten.com/244/244",
      "categories": [
        "5e779b967fe9b57f29b40cbf",
        "5349b4ddd2781d08c09890f4"
      ]
    }],
  }
  ```

---

### Add a category to a company
This endpoint assigns an existing category to an existing company in the
collection.

- **Path:** `/api/companies/:_companyId/:categories/:_categoryId`
- **Params:**
  - `_companyId` _(ObjectId)_: the id of a company
  - `_categoryId` _(ObjectId)_: the id of a category
- **Method:** `PUT`
- **Response:** The `data` will contain the updated object
  ```jsonc
  {
    "statusCode": 200,
    "data": [{
      "_id": "5e78e463e94a446cb1a946b1",
      "name": "Updated Test Company",
      "email": "contact@testcompany.org",
      "logoUrl": "https://placekitten.com/244/244",
      "categories": [
        "5349b4ddd2781d08c09890f4"
      ]
    }],
  }
  ```

---

### Remove a category from a company
This endpoint removes an existing category from an existing company in the
collection.

- **Path:** `/api/companies/:_companyId/:categories/:_categoryId`
- **Params:**
  - `_companyId` _(ObjectId)_: the id of a company
  - `_categoryId` _(ObjectId)_: the id of a category
- **Method:** `DELETE`
- **Response:** The `data` will contain the updated object
  ```jsonc
  {
    "statusCode": 200,
    "data": [{
      "_id": "5e78e463e94a446cb1a946b1",
      "name": "Updated Test Company",
      "email": "contact@testcompany.org",
      "logoUrl": "https://placekitten.com/244/244",
      "categories": []
    }],
  }
  ```

---

### Remove a company
This endpoint deletes an existing company from the collection.

- **Path:** `/api/companies/:_companyId/:categories/:_categoryId`
- **Params:**
  - `_id` _(ObjectId)_: the id of a company
- **Method:** `DELETE`
- **Response:** The `data` will contain the deleted object
  ```jsonc
  {
    "statusCode": 200,
    "data": [{
      "_id": "5e78e463e94a446cb1a946b1",
      "name": "Test Company",
      "email": "contact@testcompany.org",
      "logoUrl": "https://placekitten.com/244/244",
      "categories": [
        "5e779b967fe9b57f29b40cbf",
        "5349b4ddd2781d08c09890f4"
      ]
    }],
  }
  ```

---

### Get all companies
This endpoint retrieves all companies from the collection.

- **Path:** `/api/companies`
- **Method:** `GET`
- **Response:** The `data` will contain all the saved objects
  ```jsonc
  {
    "statusCode": 200,
    "data": [{
      "_id": "5e78e463e94a446cb1a946b1",
      "name": "Test Company",
      "email": "contact@testcompany.org",
      "logoUrl": "https://placekitten.com/244/244",
      "categories": [
        "5e779b967fe9b57f29b40cbf",
        "5349b4ddd2781d08c09890f4"
      ]
    }, {
      "_id": "5e779b967fe9b57f29b40cc1",
      "name": "Real Company",
      "email": "contact@realcompany.org",
      "logoUrl": "http://placebear.com/244/244",
      "categories": [
        "5e779b967fe9b57f29b40cbf",
      ]
    }]
  }
  ```


## License
Available under the [MIT license](LICENSE.md).

[Docker]: https://www.docker.com/
[ESLint]: https://eslint.org/
[Heroku]: https://heroku.com
[Postman's API Client]: https://www.getpostman.com/product/api-client
[curl]: https://curl.haxx.se/
[make]: https://www.gnu.org/software/make/
[nvm]: https://github.com/nvm-sh/nvm
[Usage]: #usage
[Live]: #live
[Local]: #local
[Development]: #development
[Installation]: #installation
[Handling the MongoDB instance]: #handling-the-mongodb-instance
[Automated Tests]: #automated-tests
[Linting rules]: #linting-rules
[Types of responses]: #types-of-responses
[Success response]: #success-response
[Bad request response]: #bad-request-response
[Not found response]: #not-found-response
[Available endpoints]: #available-endpoints
[Endpoints]: #endpoints
[Create a category]: #create-a-category
[Get a category]: #get-a-category
[Amend a category]: #amend-a-category
[Remove a category]: #remove-a-category
[Get all categories]: #get-all-categories
[Create a company]: #create-a-company
[Get a company]: #get-a-company
[Amend a company]: #amend-a-company
[Add a category to a company]: #add-a-category-to-a-company
[Remove a category from a company]: #remove-a-category-from-a-company
[Remove a company]: #remove-a-company
[Get all companies]: #get-all-companies
[License]: #license
