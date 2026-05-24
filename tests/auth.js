require('./common');

describe('RUNNING AUTHENTICATION TESTS', () => {

    it('TEST LOGIN METHOD - It tests the login API positive scenario', async () => {
        const input = {
            name: "Uday",
            password: "welcome"
        };

        const res = await axios.post(`${serverurl}/login`, input);
        expect(res.status).to.equal(200);
        expect(res.data).to.be.an('object');
        expect(res.data).to.have.property('token');
        expect(res.data).to.have.property('name').that.equals('Uday');
    });

    it('TEST LOGIN METHOD - It tests the login API negative scenario', async () => {
        const input = {
            name: "fake",
            password: "welcomefake"
        };

        try {
            await axios.post(`${serverurl}/login`, input);
            throw new Error('Expected request to fail');
        } catch (err) {
            if (err.message === 'Expected request to fail') throw err;
            expect(err.response.status).to.equal(401);
            expect(err.response.data).to.be.an('object');
            expect(err.response.data).to.have.property('error');
        }
    });
});
