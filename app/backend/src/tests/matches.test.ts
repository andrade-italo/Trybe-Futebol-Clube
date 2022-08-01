import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Matches from '../database/models/MatchesModel';
const MatchesMock = require('./mocks/matchesMock.json')

import { Response } from 'superagent';

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