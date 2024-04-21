import 'mocha';
import { expect } from 'chai';
import { Color, Rarity, CardType } from '../src/card_interface.js';
import request from 'request';

describe('Pruebas de las rutas de la aplicación Express', () => {

  describe('Pruebas de get', () => {

    it('no debería funcionar si el usuario no se da en la query string', (done) => {
      request.get({ url: 'http://localhost:3000/cards', json: true }, (error: Error, response) => {
        expect(response.body.status).to.equal('Error');
        expect(response.body.answer).to.equal('A user has to be provided.');
        done();
      });
    });

    it('debería obtener todas las cartas de un usuario', (done) => {
      request.get({ url: 'http://localhost:3000/cards?user=testUser', json: true }, (error: Error, response) => {
        expect(response.body.status).to.equal('Success');
        done();
      });
    });

    it('debería obtener una carta de un usuario', (done) => {
      request.get({ url: 'http://localhost:3000/cards?user=testUser&id=1', json: true }, (error: Error, response) => {
        expect(response.body.status).to.equal('Success');
        done();
      });
    });

  });

  describe('Pruebas de post', () => {

    it('no debería funcionar si el usuario no se da en la query string', (done) => {
      request.post({ url: 'http://localhost:3000/cards', json: true }, (error: Error, response) => {
        expect(response.body.status).to.equal('Error');
        expect(response.body.answer).to.equal('A user has to be provided.');
        done();
      });
    });

    it('debería añadir una carta a un usuario', (done) => {
      const card = {
        id: 26,
        name: 'Test Card',
        manaCost: 3,
        color: Color.blue,
        type: CardType.creature,
        rarity: Rarity.common,
        rulesText: 'Test rules text',
        marketValue: 5,
      };
      request.post({ url: 'http://localhost:3000/cards?user=testUser', json: card }, (error: Error, response) => {
        expect(response.body.status).to.equal('Success');
        done();
      });
    });

    it('no debería añadir una carta a un usuario si ya existe una con el mismo id', (done) => {
      const card = {
        id: 26,
        name: 'Test Card',
        manaCost: 3,
        color: Color.blue,
        type: CardType.creature,
        rarity: Rarity.common,
        rulesText: 'Test rules text',
        marketValue: 5,
      };
      request.post({ url: 'http://localhost:3000/cards?user=testUser', json: card }, (error: Error, response) => {
        expect(response.body.status).to.equal('Error');
        expect(response.body.answer).to.equal("Card with id 26 already exists in collection");
        done();
      });
    });

  });

  describe('Pruebas de delete', () => {
    
    it('no debería funcionar si el usuario no se da en la query string', (done) => {
      request.delete({ url: 'http://localhost:3000/cards', json: true }, (error: Error, response) => {
        expect(response.body.status).to.equal('Error');
        expect(response.body.answer).to.equal('A user has to be provided.');
        done();
      });
    });

    it('debería eliminar una carta de un usuario', (done) => {
      request.delete({ url: 'http://localhost:3000/cards?user=testUser&id=26', json: true }, (error: Error, response) => {
        expect(response.body.status).to.equal('Success');
        expect(response.body.answer).to.equal("Card with id 26 removed from collection");
        done();
      });
    });

    it('no debería eliminar una carta de un usuario si no existe', (done) => {
      request.delete({ url: 'http://localhost:3000/cards?user=testUser&id=2000', json: true }, (error: Error, response) => {
        expect(response.body.status).to.equal('Error');
        expect(response.body.answer).to.equal("Card with id 2000 does not exist in collection");
        done();
      });
    });

  });

  describe('Pruebas de patch', () => {

    it('no debería funcionar si el usuario no se da en la query string', (done) => {
      request.patch({ url: 'http://localhost:3000/cards', json: true }, (error: Error, response) => {
        expect(response.body.status).to.equal('Error');
        expect(response.body.answer).to.equal('A user has to be provided.');
        done();
      });
    });

    it('debería actualizar una carta a un usuario', (done) => {
      const card = {
        id: 1,
        name: 'Test Card modified',
        manaCost: 3,
        color: Color.blue,
        type: CardType.creature,
        rarity: Rarity.common,
        rulesText: 'Test rules text',
        marketValue: 5,
      };
      request.patch({ url: 'http://localhost:3000/cards?user=testUser&id=1', json: card }, (error: Error, response) => {
        expect(response.body.status).to.equal('Success');
        expect(response.body.answer).to.equal("Card with id 1 modified");
        done();
      });
    });

    it('no debería actualizar una carta a un usuario si no existe', (done) => {
      const card = {
        id: 99,
        name: 'Test Card modified',
        manaCost: 3,
        color: Color.blue,
        type: CardType.creature,
        rarity: Rarity.common,
        rulesText: 'Test rules text',
        marketValue: 5,
      };
      request.patch({ url: 'http://localhost:3000/cards?user=testUser&id=99', json: card }, (error: Error, response) => {
        expect(response.body.status).to.equal('Error');
        expect(response.body.answer).to.equal("Card with id 99 does not exist in collection");
        done();
      });
    });

    it('el id en la query string debe coincidir con el de la carta actualizada', (done) => {
      const card = {
        id: 1,
        name: 'Test Card modified',
        manaCost: 3,
        color: Color.blue,
        type: CardType.creature,
        rarity: Rarity.common,
        rulesText: 'Test rules text',
        marketValue: 5,
      };
      request.patch({ url: 'http://localhost:3000/cards?user=testUser&id=99', json: card }, (error: Error, response) => {
        expect(response.body.status).to.equal('Error');
        expect(response.body.answer).to.equal('The id in the body has to be the same as in the query string.');
        done();
      });
    });

  });

});