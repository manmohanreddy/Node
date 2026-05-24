require('./common');
process.env.NODE_ENV = 'test';

// Global beforeEach hook for all tests
beforeEach(async function(){
    const input = {
        name: "Uday",
        password: "welcome"
    };

    try {
        const res = await axios.post(`${serverurl}/login`, input);
        global.token = res.data.token;
    } catch (err) {
        console.error('Login failed in beforeEach:', err.response?.data || err.message);
    }
});

require('./auth');
require('./HttpTests');
require('./validation');
require('./integration');
