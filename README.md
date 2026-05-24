# Enterprise-Ready Node.js REST API

> A production-ready Node.js/Express API with MongoDB backend, built to demonstrate modern backend engineering practices and Kubernetes-first architectural thinking.

## The Story

I took a basic Node.js API and intentionally transformed it into something enterprise-ready. Not because it was broken, but to understand how production systems should be designed from the ground up.

Most developers build features. I built **operational maturity**—the kind of thing that keeps systems running at 2 AM without waking anyone up.

---

## What Makes This Different

This isn't just another CRUD API. It's a **deliberate case study in production engineering**:

✅ **Kubernetes-first design** — Health checks, graceful shutdown, environment-based config  
✅ **Structured logging** — JSON-formatted logs ready for aggregation and monitoring  
✅ **Request tracing** — Every request gets a unique ID for debugging production issues  
✅ **Input validation** — Defense against bad data at the boundary  
✅ **Comprehensive error handling** — Consistent, predictable error responses  
✅ **Testable architecture** — Integration tests covering real workflows  
✅ **API documentation** — Swagger/OpenAPI 3.0 for developer experience  

This is what "shipping to production" really means.

---

## The Transformation: Three Intentional Phases

Rather than boil the ocean, I rebuilt this incrementally across three phases, each independently deployable:

### Phase 1: Kubernetes Foundation ✅
**Why this first?** You can't operate what you can't observe or control.

- Environment-based configuration (no hardcoded secrets or ports)
- Health check endpoints (`/health/ready`, `/health/live`) for Kubernetes probes
- Graceful SIGTERM shutdown with 30-second timeout
- Structured JSON logging to stdout (ready for log aggregation)
- Request context tracking with correlation IDs

**Why it matters:** This is the foundation for everything. Without this, you can't safely deploy to production infrastructure.

### Phase 2: Modern Async & Error Handling ✅
**Why next?** Maintainability compounds over time.

- Converted callback-based async code to async/await (modern, readable, debuggable)
- Centralized error handling middleware
- Consistent error response format across all endpoints
- Proper HTTP status codes (not everything is 500 or 200)
- Database error scenarios handled gracefully

**Why it matters:** Code that developers can understand is code that doesn't cause bugs at 2 AM.

### Phase 3: Validation & Testing ✅
**Why last?** Validation and tests protect what you've built.

- Input validation using Joi on all API endpoints
- Integration tests for complete workflows
- Test coverage for error scenarios and edge cases
- Validation middleware catches bad data at the boundary

**Why it matters:** Testing and validation aren't nice-to-haves—they're what separate "it works on my machine" from "it ships to production."

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                    Express Server                        │
│  (Health Checks, Request Context, Error Handling)       │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    ┌─────────┐ ┌─────────┐ ┌─────────┐
    │  Routes │ │Middleware│ │Validation│
    └────┬────┘ └─────────┘ └─────────┘
         │
    ┌────▼──────────────┐
    │   Business Logic  │
    │   (Services/BO)   │
    └────┬──────────────┘
         │
    ┌────▼─────────────┐
    │  Data Layer (DA) │
    │  MongoDB         │
    └──────────────────┘
```

**Key architectural decisions:**
- Separation of concerns (Routes → Services → Data Access)
- Centralized configuration and logging
- Middleware-based error handling and request context
- Stateless design (no session affinity needed for scaling)

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Runtime** | Node.js 18+ | Modern async/await support |
| **Framework** | Express | Minimal, battle-tested, industry standard |
| **Database** | MongoDB | Document-oriented, JSON-friendly |
| **Validation** | Joi | Schema-based validation, clear error messages |
| **Logging** | Winston | Structured logging, multiple transports |
| **Testing** | Mocha + Chai + Chai-HTTP | Industry standard test framework |
| **Documentation** | Swagger/OpenAPI 3.0 | Interactive API docs, developer-friendly |
| **Deployment** | Docker/Kubernetes-ready | Environment-based config, graceful shutdown |

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or connection string)
- npm or yarn

### Setup

```bash
# Clone and install
git clone <repo-url>
cd Node
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and other settings

# Start the server
npm start

# Run tests
npm test
```

### Access the API

- **API Base URL:** `http://localhost:3501/api/v1.0`
- **API Documentation:** `http://localhost:3501/api/docs` (Swagger UI)
- **Health Checks:** 
  - Readiness: `http://localhost:3501/health/ready`
  - Liveness: `http://localhost:3501/health/live`

---

## Key Implementation Details

### Structured Logging Example
Every log entry includes context:
```json
{
  "timestamp": "2026-05-24T10:30:45.123Z",
  "level": "info",
  "message": "Server running on http://localhost:3501",
  "port": 3501,
  "env": "development",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Request Context Tracking
Every HTTP request gets a unique correlation ID, allowing you to trace it through logs and services:
```javascript
// Automatic on every request
res.locals.requestId = "550e8400-e29b-41d4-a716-446655440000"
```

### Input Validation
Endpoints validate incoming data before processing:
```javascript
// Example: POST /api/v1.0/employees
// Body is validated against Joi schema
// Returns 400 with clear error messages if invalid
```

### Error Handling
Consistent error response format:
```json
{
  "error": {
    "message": "Validation failed",
    "status": 400,
    "details": ["field: error message"]
  }
}
```

### Graceful Shutdown
On SIGTERM (Kubernetes termination signal):
1. Stop accepting new requests
2. Wait up to 30 seconds for in-flight requests to complete
3. Close database connections
4. Exit cleanly

---

## Testing

```bash
# Run full test suite
npm test

# Tests include:
# - Integration tests (actual API calls with real/test database)
# - Validation tests (schema and endpoint validation)
# - Error scenario tests (proper error handling)
# - Health check tests (Kubernetes probe endpoints)
```

---

## API Documentation

Full API documentation is available at `/api/docs` when the server is running (Swagger UI).

### Example Endpoints

**Get all employees:**
```bash
GET /api/v1.0/employees
Authorization: Bearer <token>
```

**Create employee:**
```bash
POST /api/v1.0/employees
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "salary": 50000
}
```

---

## Environment Variables

```env
# Server Configuration
PORT=3501
NODE_ENV=development|staging|production

# Database
MONGODB_URI=mongodb://localhost:27017/demodb

# Logging
LOG_LEVEL=debug|info|warn|error

# Authentication (if using token-based auth)
JWT_SECRET=your-secret-key
```

See `.env.example` for the full template.

---

## Key Learnings & Architectural Insights

### 1. **Infrastructure Shapes Code**
When I designed this for Kubernetes from day one, the code became simpler and more testable. Health checks forced me to think about dependencies. Environment config forced me to eliminate hardcoding.

### 2. **Logging is Observability**
Structured logging isn't luxury—it's how you know what's happening in production. JSON format means logs are queryable, not just readable.

### 3. **Validation at the Boundary**
Catching bad data early (at API boundary) is infinitely cheaper than catching it in the database or business logic later.

### 4. **Async/Await Over Callbacks**
The async/await conversion made this codebase 10x more maintainable. Callbacks were impossible to reason about; async/await reads like synchronous code.

### 5. **Error Handling as Design**
Error handling isn't an afterthought—it's the contract between your service and its consumers. Consistent error responses mean clients can code against your API reliably.

### 6. **Incremental Transformation Over Big Bang**
Each phase was independently deployable. This meant I could get feedback after Phase 1 before committing to Phase 2. Much safer than a massive refactor.

---

## Skills Demonstrated

This project showcases:

- ✅ **Backend Architecture** — Layered design, separation of concerns, scalable patterns
- ✅ **Production Engineering** — Health checks, graceful shutdown, structured logging, monitoring readiness
- ✅ **Kubernetes-First Thinking** — Environment-based config, stateless design, operational excellence
- ✅ **Modern Node.js** — Async/await, middleware patterns, error handling
- ✅ **API Design** — RESTful principles, input validation, consistent error responses, documentation
- ✅ **Testing** — Integration tests, error scenario coverage, real database testing
- ✅ **Operational Mindset** — Thinking about observability, debuggability, and 2 AM support
- ✅ **Incremental Development** — Shipping in phases, getting feedback, iterating safely

---

## What I'd Do Differently (If Building Again)

1. **TypeScript** — Type safety would catch more errors at compile time. For production code, this matters.
2. **Dependency Injection** — More testable, less tightly coupled (refactor for Phase 4)
3. **Database Connection Pooling** — Explicit pool management instead of relying on mongojs defaults
4. **Circuit Breaker Pattern** — For external service calls, not present in this iteration
5. **API Rate Limiting** — Important for production APIs, not included in this version

These are intentional omissions for scope, not oversights. A real production system would have them.

---

## Deployment

### Local Development
```bash
npm install
npm start
```

### Docker
```bash
docker build -t node-api .
docker run -p 3501:3501 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/demodb \
  node-api
```

### Kubernetes
This app is built for Kubernetes from the ground up:
- Environment-based configuration ✅
- Health check endpoints (`/health/ready`, `/health/live`) ✅
- Graceful SIGTERM shutdown ✅
- Structured logging to stdout ✅

Example deployment manifest:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: node-api
  template:
    metadata:
      labels:
        app: node-api
    spec:
      containers:
      - name: node-api
        image: node-api:latest
        ports:
        - containerPort: 3501
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: uri
        - name: NODE_ENV
          value: "production"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3501
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3501
          initialDelaySeconds: 5
          periodSeconds: 5
```

---

## Contributing

This is a portfolio project, but if you're interested in extending it:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes following the existing patterns
4. Add tests for new functionality
5. Submit a pull request

---

## License

ISC

---

## Questions?

This README is designed to showcase engineering thinking, not just features. If you're hiring and want to understand my approach to building production systems, that's what this project demonstrates.

**Connect:** [LinkedIn](https://www.linkedin.com/in/manmohanreddym/)

---

**Built with intention.** 🚀
