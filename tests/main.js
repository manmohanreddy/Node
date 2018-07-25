var common = require("./common");
process.env.NODE_ENV = 'test';

function importTest(name, path){
    describe(name, function(){
        require(path);
    });
}

describe("Main Test Suite", function(){

    beforeEach(function(done){
        var input = {
            name: "Uday",
            password: "welcome"
        }

        chai.request(serverurl)
            .post('/login')
            .send(input)
            .end((err, res) => {
                if (err) return done();
                token = res.body.token;
                return done();
            });
    });


    importTest("Auth related tests", './auth');
    importTest("HTTP related tests", './HttpTests');

    afterEach(function(done){
        //Anything that needs to execute after each test function.
        return done();
    });

});