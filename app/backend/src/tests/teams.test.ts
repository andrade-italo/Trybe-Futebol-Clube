import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Teams from '../database/models/TeamsModel';
const TeamsMock = require('./mocks/teamsMock.json')

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando a rota get /teams', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(Teams, "findOne")
      .resolves(TeamsMock[0] as Teams);
    sinon
      .stub(Teams, "findAll")
      .resolves(TeamsMock);
  });

  after(()=>{
    (Teams.findOne as sinon.SinonStub).restore();
  })

  it('Teste se ao fazer a requisição para rota get /teams, retorna todos os times e o status 200', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/teams');
      
    expect(chaiHttpResponse.body).to.eql(TeamsMock);
    expect(chaiHttpResponse).to.have.status(200);
  });

    it('Ao fazer a requisição para a rota get teams/:id retorna o time do id e o status 200', async () => {
      chaiHttpResponse = await chai
      .request(app)
      .get('/teams/1');
    expect(chaiHttpResponse.body).to.be.eql(TeamsMock[0]);
    expect(chaiHttpResponse).to.have.status(200);
  });
});