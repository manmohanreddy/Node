require('./common');

describe('Input Validation Tests', () => {

  describe('Employee validation', () => {
    it('should reject CreateEmployee with missing EmployeeName', async () => {
      const input = {
        EmployeeId: 999
      };

      try {
        await axios.post(`${serverurl}/Employee/InsertEmployee`, input);
        throw new Error('Expected validation error');
      } catch (err) {
        if (err.message === 'Expected validation error') throw err;
        expect(err.response.status).to.equal(400);
        expect(err.response.data).to.have.property('errorCode').that.equals('VALIDATION_ERROR');
      }
    });

    it('should reject CreateEmployee with negative EmployeeId', async () => {
      const input = {
        EmployeeName: 'Test Employee',
        EmployeeId: -5
      };

      try {
        await axios.post(`${serverurl}/Employee/InsertEmployee`, input);
        throw new Error('Expected validation error');
      } catch (err) {
        if (err.message === 'Expected validation error') throw err;
        expect(err.response.status).to.equal(400);
      }
    });

    it('should accept CreateEmployee with valid data', async () => {
      const input = {
        EmployeeName: 'Valid Employee',
        EmployeeId: 1001,
        IsActive: true
      };

      try {
        const res = await axios.post(`${serverurl}/Employee/InsertEmployee`, input);
        expect(res.status).to.be.oneOf([201, 200, 409]);
      } catch (err) {
        if (err.response?.status === 409) {
          // Employee already exists - that's ok for validation test
        } else {
          throw err;
        }
      }
    });
  });

  describe('User validation', () => {
    it('should reject CreateUser with short password', async () => {
      const input = {
        UserName: 'testuser',
        Password: '123'
      };

      try {
        await axios.post(`${serverurl}/CreateUser`, input);
        throw new Error('Expected validation error');
      } catch (err) {
        if (err.message === 'Expected validation error') throw err;
        expect(err.response.status).to.equal(400);
      }
    });

    it('should reject login with missing name', async () => {
      const input = {
        password: 'welcome'
      };

      try {
        await axios.post(`${serverurl}/login`, input);
        throw new Error('Expected validation error');
      } catch (err) {
        if (err.message === 'Expected validation error') throw err;
        expect(err.response.status).to.equal(400);
      }
    });

    it('should accept CreateUser with valid data', async () => {
      const input = {
        UserName: `testuser_${Date.now()}`,
        Password: 'validpassword123'
      };

      try {
        const res = await axios.post(`${serverurl}/CreateUser`, input);
        expect(res.status).to.be.oneOf([201, 200, 409]);
      } catch (err) {
        if (err.response?.status === 409) {
          // User already exists - that's ok
        } else {
          throw err;
        }
      }
    });
  });

  describe('GetEmployeeById validation', () => {
    it('should reject with non-numeric ID', async () => {
      try {
        await axios.get(`${serverurl}/Employee/GetById?Id=abc`);
        throw new Error('Expected validation error');
      } catch (err) {
        if (err.message === 'Expected validation error') throw err;
        expect(err.response.status).to.be.oneOf([400, 404]);
      }
    });

    it('should reject with missing ID', async () => {
      try {
        await axios.get(`${serverurl}/Employee/GetById`);
        throw new Error('Expected validation error');
      } catch (err) {
        if (err.message === 'Expected validation error') throw err;
        expect(err.response.status).to.be.oneOf([400, 404]);
      }
    });
  });
});
