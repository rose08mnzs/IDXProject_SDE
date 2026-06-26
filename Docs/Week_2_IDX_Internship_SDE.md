# WEEK 2 - Backend Foundation + REST API Basics

## Project structure
- idxproject
  - backend/
      - config/
          - db.js
      - routes/
          - health.js
      - .env
      - .gitignore
      - server.js
      - package.json

## Enter backend directory
```bash
cd backend
```

## Initialize Node.js Project 
```bash
npm init -y
```

## Install Dependencies
```bash
npm install express mysql2 dotenv cors
npm install --save-dev nodemon
```

## .gitignore example file 
```
node_modules
.env
```

## .env example file 
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=rets
PORT=5000
```

## Open package.json
```bash
notepad package.json
```

## Replace scripts
```json
"scripts": {
  "dev": "nodemon server.js"
}
```

## run server
```bash
npm run dev
```

## Test health endpoint
[http://localhost:5000/api/health](http://localhost:5000/api/health)

## Disconnect container and check status
```bash
docker stop idx-mysql-local
```

## Restart MySQL container
```bash
docker start idx-mysql-local
```
