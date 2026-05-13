automezzi-filiali

---------- Stack scelto ------- 

Frontend
- React 19
- Vite
- Tailwind CSS 4
- Zod

Backend
- Express
- MySQL
- Zod
- CORS
- dotenv

DevOps
- Docker Compose per MySQL + Adminer in dev
- Railway per il deploy dei servizi (MySQL + backend + frontend)

---------- Requisiti ---------

- Node.js 20+ 
- Docker Desktop per MySQL

---------- Steps per avvio -----------


MySQL + Adminer
- cd automezzi-filiali
- copiare .env.example in uno nuovo .env e modificare i valori
- docker compose up -d 

Backend
- cd backend
- copiare .env.example in uno nuovo .env e modificare i valori
- npm install
- npm run migrate ---> crea le tabelle e inserisce i dati di esempio
- npm run dev ----> parte su http://localhost:3001

Frontend
- cd frontend
- copiare .env.example in uno nuovo .env e modificare i valori
- npm install
- npm run dev ----> parte su http://localhost:5173


