# Práctica 11 - Aplicación Express para coleccionistas de cartas Magic

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-GarviArveloDaniel&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-GarviArveloDaniel)[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-GarviArveloDaniel/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-GarviArveloDaniel?branch=main)[![Tests](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-GarviArveloDaniel/actions/workflows/tests.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-GarviArveloDaniel/actions/workflows/tests.yml)

**Información de contacto:**
  - Daniel Garvi Arvelo
    - GitHub: [@GarviArveloDaniel](https://github.com/GarviArveloDaniel)
    - Email: [alu0101501338@ull.edu.es](mailto:alu0101501338@ull.edu.es)

## 🌳 Estructura del repositorio
```shell
.
├── Collections
│   ├── edegre
│   │   ├── 1
│   │   └── 2
│   └── testUser
│       ├── 1
│       └── 2
├── package.json
├── package-lock.json
├── README.md
├── sonar-project.properties
├── src
│   ├── card_interface.ts
│   ├── card_utilities.ts
│   ├── collection.ts
│   └── server.ts
├── tests
│   └── server.spec.ts
└── tsconfig.json

5 directories, 14 files
```

## 📚Introducción

En esta práctica partimos de la práctica 10, y debemos modificarla para implementarla mediante peticiones http.

## 📋Tareas Previas

Al igual que en prácticas anteriores, en primer lugar acepto la tarea de github Classroom para poder acceder al repositorio y realizo la misma configuración que en la práctica anteior.

## Enunciado

En esta práctica, tendrá que basarse en las implementaciones de la aplicación para coleccionistas de cartas Magic que ha llevado a cabo en prácticas pasadas, con el objetivo de que la funcionalidad de dicha aplicación se implemente a través de un servidor HTTP escrito con Express. Desde un cliente como, por ejemplo, ThunderClient o Postman, se podrán llevar a cabo peticiones HTTP al servidor. Las peticiones que podrá realizar el cliente al servidor deberán permitir añadir, modificar, eliminar, listar y mostrar cartas de un usuario concreto. El servidor Express deberá almacenar la información de las cartas como ficheros JSON en el sistema de ficheros, siguiendo la misma estructura de directorios utilizada durante prácticas pasadas.

## Implementación

### Interfaz CardInterface

Se desarrolla la interfaz `CardInterface` que lista todos los atributos que debe poseer una carta Magic, además, se crean una serie de enums `Color`, `CardType`, `Rarity` y `StrengthResistanceType` que limitan las opciones de ciertos atributos.

```ts
export interface CardInterface {
  name: string;
  manaCost: number;
  color: Color;
  rarity: Rarity;
  rulesText: string;
  marketValue: number;
  strengthResitance?: StrengthResistanceType;
  loyalty?: number;
}

export enum Color {
  white = 'white',
  blue = 'blue',
  black = 'black',
  red = 'red',
  green = 'green',
  colorless = 'colorless',
  multi = 'multi'
}

export enum CardType {
  land = 'land',
  creature = 'creature',
  enchantment = 'enchantment',
  conjure = 'conjure',
  instant = 'instant',
  artefact = 'artefact',
  planeswalker = 'planeswalker'
}

export enum Rarity {
  common = 'common',
  uncommon = 'uncommon',
  rare = 'rare',
  mythic = 'mythic'
}

export type StrengthResistanceType = [number, number];
```

### Collection

Se desarrolla una clase `Collection` con único atributo el path al directorio donde se almacenarán las colecciones. La clase presenta además cinco métodos que usan la API asíncrona de Node fs mediante callbacks:

  - `add y addCard`:
  ```ts
    public add(username: string, card: CardInterface, callback: (error: string | undefined, data: string | undefined) => void) {
        fs.access(this.fullPath + `/${username}`, fs.constants.F_OK, (err) => {
        if (err) {
            fs.mkdir(this.fullPath + `/${username}`, (error) => {
            if (error) {
                callback(`Error creating the directory: ${error}`, undefined);
            } else {
                this.addCard(username, card, callback);
            }
            });
        } else {
            this.addCard(username, card, callback);
        }
        });
    }

    private addCard(username: string, card: CardInterface, callback: (error: string | undefined, data: string | undefined) => void) {
        fs.access(this.fullPath + `/${username}/${card.id}`, fs.constants.F_OK, (err) => {
        if (err) {
            fs.writeFile(this.fullPath + `/${username}/${card.id}`, JSON.stringify(card), (error) => {
            if (error) {
                callback(`Error writing the file: ${error}`, undefined);
            } else {
                callback(undefined, `Card with id ${card.id} added to collection`);
            }
            });
        } else {
            callback(`Card with id ${card.id} already exists in collection`, undefined)
        }
        });
    }
  ```
  En primer lugar comprobamos si existe el directorio con el nombre del usuario (es decir, si existe el usuario), en caso de que no, se crea un directorio con el nombre del usuario y se comprueba si la carta ya existe antes de añadirla. Está dividida en dos partes para mayor simplicidad de lectura. Se hace uso de callbacks para retornar errores o información.

  - `modify`:
  ```ts
  public modify(username: string, card: CardInterface, callback: (error: string | undefined, data: string | undefined) => void) {
    fs.access(this.fullPath + `/${username}`, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`User ${username} does not exist.`, undefined);
      } else {
        fs.access(this.fullPath + `/${username}/${card.id}`, fs.constants.F_OK, (err) => {
          if (err) {
            callback(`Card with id ${card.id} does not exist in collection`, undefined);
          } else {
            fs.writeFile(this.fullPath + `/${username}/${card.id}`, JSON.stringify(card), (error) => {
              if (error) {
                callback(`Error writing the file: ${error}`, undefined);
              } else {
                callback(undefined, `Card with id ${card.id} modified`);
              }
            });
          }
        });
      }
    });
  }
  ```
  Primero comprobamos si existe el usuario y posteriormente si existe la carta, en caso de que si, se sobreescribe el fichero. Se hace uso de callbacks para retornar errores o información.

  - `remove`:
  ```ts
  public remove(username: string, cardId: number, callback: (error: string | undefined, data: string | undefined) => void) {
    fs.access(this.fullPath + `/${username}`, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`User ${username} does not exist.`, undefined);
      } else {
        fs.access(this.fullPath + `/${username}/${cardId}`, fs.constants.F_OK, (err) => {
          if (err) {
            callback(`Card with id ${cardId} does not exist in collection`, undefined);
          } else {
            fs.unlink(this.fullPath + `/${username}/${cardId}`, (error) => {
              if (error) {
                callback(`Error removing the file: ${error}`, undefined);
              } else {
                callback(undefined, `Card with id ${cardId} removed from collection`);
              }
            });
          }
        });
      }
    });
  }
  ```
  De forma similar a la anterior, comprobamos la existencia del usuario y carta, y la eliminamos, usando callbacks para el retorno de errores o información.

  - `list`:
  ```ts
  public list(username: string, callback: (error: string | undefined, data: string[] | undefined) => void) {
    fs.access(this.fullPath + `/${username}`, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`User ${username} does not exist.`, undefined);
      } else {
        fs.readdir(this.fullPath + `/${username}`, (error, files) => {
          if (error) {
            callback(`Error reading the directory: ${error}`, undefined);
          } else {
            const fullContent: string[] = [];
            files.forEach(file => {
              fs.readFile(this.fullPath + `/${username}/${file}`, (error, data) => {
                if (error) {
                  callback(`Error reading the file: ${error}`, undefined);
                } else {
                  fullContent.push(data.toString());
                  if (fullContent.length === files.length) {
                    callback(undefined, fullContent);
                  }
                }
              });
            });
          }
        });
      }
    });
  }
  ```
  Realizamos las comprobaciones pertinentes y para listar todas las cartas primero cargamos todas las cartas de un usuario y luego mediante un forEach almacenamos la información de las cartas en un vector, cuando el vector tenga todas las cartas se llama al callback para retornar la información.

  - `read`:
  ```ts
  public read(username: string, cardId: number, callback: (error: string | undefined, data: string | undefined) => void) {
    fs.access(this.fullPath + `/${username}`, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`User ${username} does not exist.`, undefined);
      } else {
        fs.access(this.fullPath + `/${username}/${cardId}`, fs.constants.F_OK, (err) => {
          if (err) {
            callback(`Card with id ${cardId} does not exist in collection`, undefined);
          } else {
            fs.readFile(this.fullPath + `/${username}/${cardId}`, (error, data) => {
              if (error) {
                callback(`Error reading the file: ${error}`, undefined);
              } else {
                callback(undefined, data.toString());
              }
            });
          }
        });
      }
    });
  }
  ```
  Para leer una carta, realizamos las correspondientes comprobaciones y devolvemos la información.

Podemos comprobar que en cada caso los mensajes por la consola se pasan en color verde, y los de error en color rojo.

### Server

En el archivo server.ts se ha desarrollado un servidor http con Express, usando los siguientes verbos:

1. GET /cards: Se muestra información especifica de una carta si se proporciona un usuario y un id de la carta. Si no se especifica el id se muestran todas las cartas del usuario.

2. POST /cards: Se añade una carta a la colección, el usuario se especifica por la query string y la carta en el cuerpo de la petición.

3. DELETE /cards: Se elimina una carta de la colección, hay que especificar un usuario y un id en la query string.

4. PATCH /cards: Se modifica una carta existente, hay que proporcionar un usuario y un id a través de la query, y la nueva información de la carta en el cuerpo de la petición.

```ts
server.get('/cards', (req, res) => {
  if (!req.query.user) {
    res.send({
      status: 'Error',
      answer: 'A user has to be provided.'
    });
    return;
  }
  if (!req.query.id) {
    collection.list(req.query.user as string, (error, result) => {
      if (error) {
        res.send({
          status: 'Error',
          answer: error
        });
      } else {
        res.send({
          status: 'Success',
          answer: result
        });
      }
    });
  } else {
    collection.read(req.query.user as string, parseInt(req.query.id as string), (error, result) => {
      if (error) {
        res.send({
          status: 'Error',
          answer: error
        });
      } else {
        res.send({
          status: 'Success',
          answer: result
        });
      }
    });
  }
});

server.post('/cards', (req, res) => {
  if (!req.query.user) {
    res.send({
      status: 'Error',
      answer: 'A user has to be provided.',
    });
  } else {
    collection.add(req.query.user as string, req.body, (error, result) => {
      if (error) {
        res.send({
          status: 'Error',
          answer: error
        });
      } else {
        res.send({
          status: 'Success',
          answer: result
        });
      }
    });
  }
});

server.delete('/cards', (req, res) => {
  if (!req.query.user) {
    res.send({
      status: 'Error',
      answer: 'A user has to be provided.',
    });
    return;
  }
  if (!req.query.id) {
    res.send({
      status: 'Error',
      answer: 'An id has to be provided.',
    });
  } else {
    collection.remove(req.query.user as string, parseInt(req.query.id as string), (error, result) => {
      if (error) {
        res.send({
          status: 'Error',
          answer: error
        });
      } else {
        res.send({
          status: 'Success',
          answer: result
        });
      }
    });
  }
});

server.patch('/cards', (req, res) => {
  if (!req.query.user) {
    res.send({
      status: 'Error',
      answer: 'A user has to be provided.',
    });
    return;
  }
  if (!req.query.id) {
    res.send({
      status: 'Error',
      answer: 'An id has to be provided.',
    });
  } else {
    if (parseInt(req.query.id as string) !== req.body.id) {
      res.send({
        status: 'Error',
        answer: 'The id in the body has to be the same as in the query string.',
      });
      return;
    }
    collection.modify(req.query.user as string, req.body, (error, result) => {
      if (error) {
        res.send({
          status: 'Error',
          answer: error
        });
      } else {
        res.send({
          status: 'Success',
          answer: result
        });
      }
    });
  }
});
```

## Ejercicio de pe

### Descripción del ejercicio
Durante prácticas anteriores, debería haber escrito en alguna clase métodos para añadir, modificar, borrar y actualizar la información de una carta de la colección de un usuario:

1. Escoja dos de esos métodos y haga uso de llamadas a los métodos del API asíncrona basada en promesas de Node.js para gestionar el sistema de ficheros.
2. Haga que sus propios métodos devuelvan promesas.
3. Modifique el código fuente que invoca a dichos métodos para gestionar las promesas devueltas por los mismos.

### Solución implementada

En mi caso, escogí las opciones de remove y read.

```ts
  public removeWithPromises(username: string, cardId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.promises.access(this.fullPath + `/${username}/${cardId}`, fs.constants.F_OK)
      .then(() => {
        return fs.promises.unlink(this.fullPath + `/${username}/${cardId}`);
      })
      .then(() => {
        resolve(`Card with id ${cardId} removed from collection`);
      })
      .catch(() => {
        reject(`Card with id ${cardId} or user does not exist.`);
      });
    });
  }

  public readWithPromise(username: string, cardId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.promises.access(this.fullPath + `/${username}/${cardId}`, fs.constants.F_OK)
      .then(() => {
        return fs.promises.readFile(this.fullPath + `/${username}/${cardId}`)
      })
      .then((data) => {
        resolve(data.toString());
      }).catch(() => {
        reject(`Card with id ${cardId} or user does not exist.`);
      });
    });
  }
```

## 💭Conclusiones

En esta práctica hemos trabajado la creación de un servidor http con Express, trabajado con verbos http y el patrón callback.

## 🔗Bibliografía

[Guión de práctica 11](https://ull-esit-inf-dsi-2324.github.io/prct11-http-express-magic-app/)

## 🛠️Herramientas
Algunas de las herramientas que se han utilizado en esta práctica son las siguientes:

<img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /> <img src="https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=GitHub%20Pages&logoColor=white"/>  <img src="https://img.shields.io/badge/Github%20Actions-282a2e?style=for-the-badge&logo=githubactions&logoColor=367cfe"/> <img src="https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white"/> <img src="https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E"/> <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/> <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"/> <img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/> <img src="https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=Mocha&logoColor=white"/> <img src="https://img.shields.io/badge/chai-A30701?style=for-the-badge&logo=chai&logoColor=white"/> 