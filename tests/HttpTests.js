describe("Test getname API", () => {
    it("Test Getname Postivie", (done) => {
        chai.request(serverurl)
            .get('/getName')
            .set('token', token)
            .set('roleId', 1)
            .end((err, res) => {
                if (err) return done();
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('IsError').eql(false);
                return done();
            });
    })
})