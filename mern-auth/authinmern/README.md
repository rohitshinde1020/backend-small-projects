# AuthInMERN – Backend

Node/Express REST API for the MERN authentication project. Supports JWT-based auth with a **Redis-backed session store** and brute-force protection on the login route.

---

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Cache / sessions | Redis (`redis` v5) |
| Auth | JWT (`jsonwebtoken`) |
| Password hashing | bcrypt |
| Email | Nodemailer + Brevo SMTP |

---

## Redis workflow

### Session management (JWT + Redis allowlist)

When a user registers or logs in successfully the server:

1. Creates a random `sid` (`crypto.randomUUID()`).
2. Signs a JWT that embeds `{ id, sid }`.
3. Stores `sess:<sid> → <userId>` in Redis with a TTL equal to `SESSION_TTL_SECONDS` (default 24 h).
4. Returns the JWT as an **HTTP-only** cookie (`token`).

On every authenticated request the `authmiddleware`:

1. Verifies the JWT signature.
2. Looks up `sess:<sid>` in Redis.
3. Compares the stored `userId` with `decoded.id`. Mismatch or missing key → 401.

On **logout** the session key is deleted from Redis immediately, revoking all further requests with that token.

### Brute-force / rate limiting on `/api/auth/login`

Redis key: `rl:login:<ip>:<email>`

| Setting | Default | Env var |
|---|---|---|
| Max failed attempts before block | 5 | `MAX_LOGIN_ATTEMPTS` |
| Block window | 900 s (15 min) | `LOGIN_BLOCK_SECONDS` |

On each failed login the counter is incremented and the key TTL is set to `LOGIN_BLOCK_SECONDS` on the first failure. Once the threshold is reached the endpoint returns `429 Too Many Requests` with a `retryAfterSeconds` field. A successful login clears the counter.

### Redis outage behaviour

| Scenario | Behaviour |
|---|---|
| Redis down during **auth validation** | Fail closed → 401 returned |
| Redis down during **rate limiting** | Counter read fails; request proceeds (fail open) |

---

## Environment variables

Copy `.env.example` to `.env` and fill in the values.

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | HTTP port (default `4000`) |
| `NODE_ENV` | No | `development` \| `production` |
| `MONGO_URI` | **Yes** | MongoDB connection string (without DB name) |
| `JWT_SECRET` | **Yes** | Secret used to sign JWTs (≥ 32 chars recommended) |
| `REDIS_URL` | **Yes** | Redis connection URL |
| `SESSION_TTL_SECONDS` | No | Session TTL in seconds (default `86400`) |
| `MAX_LOGIN_ATTEMPTS` | No | Failed attempts before block (default `5`) |
| `LOGIN_BLOCK_SECONDS` | No | Block window in seconds (default `900`) |
| `SENDER` | **Yes** | Sender email address |
| `SMTP_USER` | **Yes** | Brevo SMTP login |
| `SMTP_PASSWORD` | **Yes** | Brevo SMTP key |
| `FRONTEND_URL` | **Yes** | Allowed frontend origin for CORS |

---

## Local setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis 6+ (local or cloud)

### 1 – Install a local Redis server (optional)

```bash
# macOS (Homebrew)
brew install redis && brew services start redis

# Ubuntu / Debian
sudo apt update && sudo apt install redis-server
sudo systemctl start redis
```

Verify it is running:

```bash
redis-cli ping   # should print PONG
```

### 2 – Install dependencies

```bash
cd mern-auth/authinmern
npm install
```

### 3 – Configure environment variables

```bash
cp .env.example .env
# Edit .env and fill in your values
```

Minimum required values for local development:

```
MONGO_URI=mongodb://127.0.0.1:27017
JWT_SECRET=replace-with-a-long-random-secret
REDIS_URL=redis://127.0.0.1:6379
SENDER=test@example.com
SMTP_USER=your-brevo-login
SMTP_PASSWORD=your-brevo-key
FRONTEND_URL=http://localhost:5173
```

### 4 – Start the server

```bash
npm run dev    # nodemon (hot reload)
# or
npm start      # plain node
```

The API will be available at `http://localhost:4000`.

### 5 – Health check

```bash
curl http://localhost:4000/api/health
# {"success":true,"message":"Backend is running"}
```

---

## API routes

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account |
| POST | `/api/auth/login` | – | Login → sets `token` cookie |
| POST | `/api/auth/logout` | Cookie | Logout + revoke Redis session |
| GET | `/api/auth/isauthenticated` | Cookie | Check auth state |
| POST | `/api/auth/verify-otp` | Cookie | Send email verification OTP |
| POST | `/api/auth/verifyaccount` | Cookie | Verify account with OTP |
| POST | `/api/auth/resetpassword` | – | Send password-reset OTP |
| POST | `/api/auth/verify-reset-otp` | – | Verify OTP and set new password |
| GET | `/api/user/data` | Cookie | Get current user profile |

---

## Running the smoke tests

A minimal smoke test script is provided (requires a running MongoDB and Redis):

```bash
node test/smoke.test.js
```

Set the optional `BASE_URL` environment variable to target a different server (default `http://localhost:4000`).
