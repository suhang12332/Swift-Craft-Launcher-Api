# Swift Craft Launcher API

A reverse-proxy API that provides reliable access to Swift Craft Launcher services.

## Project Structure

```
├── public/
│   └── _routes.json
├── functions/
│   └── api/
│       ├── contributors.js
│       ├── update/
│       │   └── [slug].js
│       └── download/
│           └── [version]/
│               └── [file].js
└── package.json
```

## Routes

| API Path | Description |
|---|---|
| `/api/contributors` | Returns the project's contributor list |
| `/api/update/*` | Serves app update manifests and metadata |
| `/api/download/*` | Proxies release downloads (e.g. `/api/download/{version}/{file}.dmg`) |

All responses include the `Access-Control-Allow-Origin: *` header so the API
can be used from the launcher and other clients.
