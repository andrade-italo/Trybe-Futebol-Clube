import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Matches from '../database/models/MatchesModel';
const MatchesMock = require('./mocks/matchesMock.json')
const userMock = require('./mocks/userMock.json')
const MatchesMockCreate = require('./mocks/matchesMockCreate.json')

import { Response } from 'superagent';
import User from '../database/models/UserModel';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando a rota get /Matches', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(Matches, "findAll")
      .resolves(MatchesMock);
  });

  after(()=>{
    (Matches.findAll as sinon.SinonStub).restore();
  })

  it('Teste se ao fazer a requisição para rota get /matches, retorna todas as partidas e o status 200', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/matches');
      
    expect(chaiHttpResponse.body).to.eql(MatchesMock);
    expect(chaiHttpResponse).to.have.status(200);
  });
});

describe('Testando a rota get /Matches?inProgress=true', () => {
  let chaiHttpResponse: Response;
  before(async () => {
    sinon
      .stub(Matches, "findAll")
      .resolves(MatchesMock[0]);
  });

  after(()=>{
    (Matches.findAll as sinon.SinonStub).restore();
  })

  it('Ao fazer a requisição para a rota get matches?inProgress=true retorna as partidas em progresso e o status 200', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/matches')
      .query({ inProgress: true });
  
    expect(chaiHttpResponse.body).to.be.eql(MatchesMock[0]);
    expect(chaiHttpResponse).to.have.status(200);
  });
});

describe('Testando a rota get /Matches?inProgress=false', () => {
  let chaiHttpResponse: Response;
  
  before(async () => {
    sinon
      .stub(Matches, "findAll")
      .resolves(MatchesMock[1]);
  });

  after(()=>{
    (Matches.findAll as sinon.SinonStub).restore();
  })

  it('Ao fazer a requisição para a rota get matches?inProgress=false retorna as partidas finalizadas e o status 200', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/matches?inProgress=false');
    
    expect(chaiHttpResponse.body).to.be.eql(MatchesMock[1]);
    expect(chaiHttpResponse).to.have.status(200);
  });
});

describe('Testando a rota post /matches', async () => {

  before(async () => {
    sinon
      .stub(Matches, "create")
      .resolves(MatchesMockCreate);
    sinon
      .stub(User, "findOne")
      .resolves(userMock[0] as User);
  });

  after(()=>{
    (Matches.create as sinon.SinonStub).restore();
    (User.findOne as sinon.SinonStub).restore();
  })

  let chaiHttpResponse: Response;

  it('Ao fazer a requisição para a rota post matches com um body valido e authorização, retorna as partidas criadas e o status 201', async () => {
    const bodyValido: {} = {
      email: 'italo@gmail.com',
      password: '123456'
    }
    const getToken = await chai
    .request(app)
    .post('/login')
    .send(bodyValido);
    const { token } = getToken.body;

    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set({ authorization: token })
      .send({
        "homeTeam": 16,
        "awayTeam": 8,
        "homeTeamGoals": 2,
        "awayTeamGoals": 2
      });
      
    expect(chaiHttpResponse.body).to.be.eql(MatchesMockCreate);
    expect(chaiHttpResponse).to.have.status(201);
  });

  it('Ao fazer a requisição para a rota post matches sem uma autorização, retorna uma mensagem e o status 401', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set({ authorization: 'token' })
      .send({
        "homeTeam": 16,
        "awayTeam": 8,
        "homeTeamGoals": 2,
        "awayTeamGoals": 2
      });
    
    expect(chaiHttpResponse.body).to.be.eql({ message: "Token must be a valid token" });
    expect(chaiHttpResponse).to.have.status(401);
  });
});