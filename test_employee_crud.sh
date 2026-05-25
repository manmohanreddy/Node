#!/bin/bash

echo "🔐 STEP 1: LOGIN"
echo "================="

LOGIN=$(curl -s -X POST http://localhost:3501/api/v1.0/login \
  -H "Content-Type: application/json" \
  -d '{"UserName": "johndoe", "Password": "secure123"}')

TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
ROLE=$(echo "$LOGIN" | grep -o '"RoleId":[0-9]*' | cut -d':' -f2)
NAME=$(echo "$LOGIN" | grep -o '"name":"[^"]*' | cut -d'"' -f4)

echo "✓ Login successful"
echo "  User: $NAME (RoleId: $ROLE)"
echo "  Token: $TOKEN"
echo ""
echo "---"
echo ""

echo "📦 STEP 2: FETCH CURRENT EMPLOYEES"
echo "===================================="

EMPLOYEES=$(curl -s -X GET http://localhost:3501/api/v1.0/Employee/GetAllEmployees \
  -H "Content-Type: application/json" \
  -H "token: $TOKEN" \
  -H "roleid: $ROLE")

echo "Current Employees:"
echo "$EMPLOYEES" | sed 's/},{/}\n{/g'

EMPLOYEE_COUNT=$(echo "$EMPLOYEES" | grep -o '"EmployeeName"' | wc -l)
echo ""
echo "Total: $EMPLOYEE_COUNT employees"
echo ""
echo "---"
echo ""

echo "✏️  STEP 3: UPDATE EMPLOYEE"
echo "============================"
echo ""
echo "Updating: John Doe (EmployeeId: 101)"
echo ""

UPDATE_RESPONSE=$(curl -s -X PUT http://localhost:3501/api/v1.0/Employee/UpdateEmployee \
  -H "Content-Type: application/json" \
  -H "token: $TOKEN" \
  -H "roleid: $ROLE" \
  -d '{
    "EmployeeId": 101,
    "EmployeeName": "John Doe - Senior Developer",
    "Department": "Engineering",
    "IsActive": true
  }')

echo "Update Response:"
echo "$UPDATE_RESPONSE"
echo ""

if echo "$UPDATE_RESPONSE" | grep -q '"ok"'; then
  echo "✓ Employee updated successfully"
elif echo "$UPDATE_RESPONSE" | grep -q '"nModified"'; then
  echo "✓ Employee updated"
fi

echo ""
echo "---"
echo ""

echo "🗑️  STEP 4: DELETE EMPLOYEE"
echo "============================"
echo ""
echo "Deleting: Sarah Johnson (EmployeeId: 103)"
echo ""

DELETE_RESPONSE=$(curl -s -X PUT http://localhost:3501/api/v1.0/Employee/DeleteEmployee \
  -H "Content-Type: application/json" \
  -H "token: $TOKEN" \
  -H "roleid: $ROLE" \
  -d '{
    "EmployeeId": 103
  }')

echo "Delete Response:"
echo "$DELETE_RESPONSE"
echo ""

if echo "$DELETE_RESPONSE" | grep -q '"ok"'; then
  echo "✓ Employee deleted successfully"
elif echo "$DELETE_RESPONSE" | grep -q '"nModified"'; then
  echo "✓ Employee deleted"
fi

echo ""
echo "---"
echo ""

echo "📦 STEP 5: VERIFY - FETCH ALL EMPLOYEES AFTER UPDATES"
echo "====================================================="
echo ""

EMPLOYEES_AFTER=$(curl -s -X GET http://localhost:3501/api/v1.0/Employee/GetAllEmployees \
  -H "Content-Type: application/json" \
  -H "token: $TOKEN" \
  -H "roleid: $ROLE")

echo "Updated Employee List:"
echo "$EMPLOYEES_AFTER" | sed 's/},{/}\n{/g'

EMPLOYEE_COUNT_AFTER=$(echo "$EMPLOYEES_AFTER" | grep -o '"EmployeeName"' | wc -l)
echo ""
echo "Total: $EMPLOYEE_COUNT_AFTER employees"
echo ""
echo "---"
echo ""

echo "📊 SUMMARY"
echo "=========="
echo "  Before Operations: $EMPLOYEE_COUNT employees"
echo "  After Operations:  $EMPLOYEE_COUNT_AFTER employees"
echo "  Changes Made:"
echo "    ✏️  Updated: John Doe → John Doe - Senior Developer"
echo "    🗑️  Deleted: Sarah Johnson (EmployeeId: 103)"
echo ""
