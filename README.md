# Rate Limiter

**Live API URL :** **https://api-ratelimiter.vishnuuuvrdn.me**

## Overview

This project is a simple API built using Node.js and Express.js.

It limits how many requests a user can make within 60 seconds. The limit depends on the user's tier and the type of endpoint they use.

There are two user tiers: `free` and `paid`. There are also two endpoint types: `ai` and `read`.

## Requirements

- Node.js 18 or newer
- npm

## Installation

Install the required packages:

```bash
npm install
```

## Run the Project

Start the server:

```bash
npm start
```

The server runs on port `5000` by default.

## Run Tests

Run the tests using:

```bash
npm test
```

## Rate Limits

| User Tier | Endpoint Type | Limit | Time |
|---|---|---:|---|
| Free | AI | 5 requests | 60 seconds |
| Free | Read | 30 requests | 60 seconds |
| Paid | AI | 30 requests | 60 seconds |
| Paid | Read | 120 requests | 60 seconds |

When a user reaches the limit, any extra request within the same 60-second window returns HTTP `429`.

## API Endpoints

| Method | Endpoint | Type |
|---|---|---|
| POST | `/api/ai/generate` | AI |
| POST | `/api/ai/summarise` | AI |
| GET | `/api/data/list` | Read |
| GET | `/api/data/export` | Read |

When a request is allowed, the API returns:

```json
{
  "ok": true
}
```

## Request Headers

The API uses two headers:

- `X-User-Tier`: Set this to `free` or `paid`. If it is missing or invalid, the user is treated as `free`.
- `X-User-ID`: Identifies the user so their requests can be counted separately.

## Example Request

```bash
curl -X POST http://localhost:5000/api/ai/generate \
  -H "X-User-ID: user-123" \
  -H "X-User-Tier: free"
```

## Rate Limit Error

When a user exceeds their limit, the API returns HTTP `429` with a response like this:

```json
{
  "error": "rate_limit_exceeded",
  "limit": 5,
  "window_seconds": 60,
  "retry_after_seconds": 34
}
```

The `limit` shows the maximum number of allowed requests. The `retry_after_seconds` field tells the user how many seconds remain before the current window ends.

## Design Decisions

The rate limits are stored in one configuration file, making them easy to understand and update.

Each route is marked as either `ai` or `read`. The middleware uses this information to select the correct limit instead of checking the URL.

A JavaScript `Map` stores request counts and window start times in memory. Each user's tier and endpoint type have separate counters.

The counter resets after 60 seconds. The middleware checks the limit before allowing a request to reach its handler. It also handles requests safely within a single Node.js process.

## Limitations

All rate-limit data is stored in memory. Restarting the server clears the counters.

If the application runs on multiple server processes or instances, each one has its own counters. The limits are not shared between them.

The fixed-window approach can allow extra requests around the boundary between two windows.

The in-memory store can also use more memory if many different users send requests.

The `X-User-ID` header is used for testing. In a real application, user identity and subscription details should come from trusted authentication.