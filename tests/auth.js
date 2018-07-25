describe('RUNNING AUTHENTICATION TESTS', () => {

    it('TEST LOGIN METHOD - It tests the login API positive scenario', (done) => {

        var input = {
            name: "Uday",
            password: "welcome"
        }

        chai.request(serverurl)
            .post('/login')
            .send(input)
            .end((err, res) => {
                if (err) return done();
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                res.body.should.have.property('name').eq('Uday');
                return done();
            });
    });

    it('TEST LOGIN METHOD - It tests the login API negative scenario', (done) => {
        var input = {
            name: "fake",
            password: "welcomefake"
        }

        chai.request(serverurl)
            .post('/login')
            .send(input)
            .end((err, res) => {
                if (err) return done();
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('Error');
                res.body.should.have.property('Message').eq('Invalid user');
                return done();
            });
    });
});