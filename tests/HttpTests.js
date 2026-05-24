require('./common');

describe("Test getname API", () => {
    it("Test Getname Positive", async () => {
        const res = await axios.get(`${serverurl}/GetName`, {
            headers: {
                'token': token,
                'roleId': '1'
            }
        });

        expect(res.status).to.equal(200);
        expect(res.data).to.be.an('object');
    });
});
