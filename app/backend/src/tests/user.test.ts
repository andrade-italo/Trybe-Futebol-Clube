import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/UserModel';
const userMock = require('./mocks/userMock.json')

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando a rota post /login', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(User, "findOne")
      .resolves(userMock[0] as User);
  });

  after(()=>{
    (User.findOne as sinon.SinonStub).restore();
  })

  it('Teste se ao fazer o login com o email e password valido, retorna o token', async () => {
    const bodyValido: {} = {
      email: 'italo@gmail.com',
      password: '123456'
    }
    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send(bodyValido);
      
    expect(chaiHttpResponse.body).to.have.property('token');
  });

    it('Ao fazer a requisição faltando email, retorna a mensagem email is required e status 400', async () => {
      chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ password: '123456' });
  
    const { message } = chaiHttpResponse.body;

    expect(message).to.be.contain('All fields must be filled');
    expect(chaiHttpResponse).to.have.status(400);
  });

  it('Ao fazer a requisição faltando password, retorna a mensagem: "password is required e o status 400', async () => {
    chaiHttpResponse = await chai
    .request(app)
    .post('/login')
    .send({ email: 'italo@gmail.com' });

    const { message } = chaiHttpResponse.body;

    expect(message).to.be.contain('All fields must be filled');
    expect(chaiHttpResponse).to.have.status(400);
  });

  it('Ao fazer a requisição com um email invalido, retorna a mensagem: "email must be valid e o status 422', async () => {
    chaiHttpResponse = await chai
    .request(app)
    .post('/login')
    .send({ email: 'italo', password: '123456' });

    const { message } = chaiHttpResponse.body;

    expect(message).to.be.contain('Incorrect email or password');
    expect(chaiHttpResponse).to.have.status(422);
  });

  it('Ao fazer a requisição com password menor que 6, retorna a mensagem: "password length e o status 422', async () => {
    chaiHttpResponse = await chai
    .request(app)
    .post('/login')
    .send({ email: 'italo@gmail.com', password: '1' });

    const { message } = chaiHttpResponse.body;

    expect(message).to.be.contain('Incorrect email or password');
    expect(chaiHttpResponse).to.have.status(422);
  });
});
describe('Testando a rota get /login/validate', () => {
  let chaiHttpResponse: Response;
  let getToken: Response;

  before(async () => {
    sinon
      .stub(User, "findOne")
      .resolves(userMock[0] as User);
  });

  after(()=>{
    (User.findOne as sinon.SinonStub).restore();
  })

  it('A rota retorna o campo role com o valor correspondente ao usuario', async () => {
    const bodyValido: {} = {
      email: 'italo@gmail.com',
      password: '123456'
    }
    getToken = await chai
       .request(app)
       .post('/login')
       .send(bodyValido);
    const { token } = getToken.body;

    chaiHttpResponse = await chai
       .request(app)
       .get('/login/validate')
       .set({ authorization: token });

    expect(chaiHttpResponse.body).to.eql({ role: 'admin' });
    expect(chaiHttpResponse).to.have.status(200);
  });
});