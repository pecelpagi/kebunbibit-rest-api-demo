process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.should();

chai.use(chaiHttp);

describe('/GET category', () => {
    it('it should Get all categories', (done) => {
        chai.request(server)
        .get('/api/category')
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
});

describe('/GET product', () => {
    it('it should Get all products', (done) => {
        chai.request(server)
        .get('/api/product')
        .query({ limit: 1 })
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
});