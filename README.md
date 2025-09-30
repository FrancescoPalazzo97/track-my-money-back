# Track My Money - Backend

Un'applicazione backend per il tracciamento delle finanze personali costruita con Node.js, Express, TypeScript e MongoDB.

## 🚀 Caratteristiche

- **Gestione Categorie**: Sistema gerarchico di categorie per entrate e spese
- **Tracciamento Spese**: Registrazione dettagliata di transazioni finanziarie
- **Multi-valuta**: Supporto per oltre 120 valute (fiat e criptovalute)
- **Validazione Dati**: Validazione robusta con Zod e localizzazione italiana
- **API RESTful**: Endpoints ben strutturati per tutte le operazioni CRUD
- **TypeScript**: Tipizzazione forte per maggiore sicurezza del codice

## 📋 Prerequisiti

- Node.js (versione 16 o superiore)
- MongoDB (locale o remoto)
- npm o yarn

## 🔧 Installazione

1. Clona il repository:
```bash
git clone https://github.com/FrancescoPalazzo97/track-my-money-back.git
cd track-my-money-back
```

2. Installa le dipendenze:
```bash
npm install
```

3. Configura le variabili d'ambiente:
```bash
cp .env.example .env
```

Modifica il file `.env` con le tue configurazioni:
```env
PORT=<your-port>
MONGODB_URI=<your-mongodb-connection-string>
API_KEY=<your-currencyapi-key>
```

**Variabili richieste:**
- `PORT`: Porta su cui avviare il server (default: 3000)
- `MONGODB_URI`: Stringa di connessione MongoDB
- `API_KEY`: Chiave API per currencyapi.com (per tassi di cambio)

4. Avvia MongoDB (se locale):
```bash
mongod
```

5. (Opzionale) Popola il database con i dati storici dei tassi di cambio:
```bash
npm run seed
```

## 🚀 Utilizzo

### Sviluppo
```bash
npm run dev
```
Avvia il server di sviluppo con hot reload su http://localhost:3000

### Produzione
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Categorie

#### GET /categories
Recupera tutte le categorie con popolamento delle categorie parent.

**Risposta:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Alimentari",
    "type": "expense",
    "description": "Spese per cibo e bevande",
    "parentCategory": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /categories
Crea una nuova categoria.

**Body:**
```json
{
  "name": "Alimentari",
  "type": "expense",
  "description": "Spese per cibo e bevande",
  "parentCategory": "507f1f77bcf86cd799439011"
}
```

**Risposta:**
```json
{
  "success": true,
  "message": "Nuova Categoria aggiunta!"
}
```

### Spese

#### GET /expense
Recupera tutte le spese con popolamento delle categorie associate.

**Risposta:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Spesa al supermercato",
    "description": "Spesa settimanale",
    "expenseDate": "2024-01-01T00:00:00.000Z",
    "amount": 50.00,
    "currency": "EUR",
    "category": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Alimentari",
      "type": "expense"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /expense
Crea una nuova spesa.

**Body:**
```json
{
  "title": "Spesa al supermercato",
  "description": "Spesa settimanale",
  "expenseDate": "2024-01-01T00:00:00.000Z",
  "amount": 50.00,
  "currency": "EUR",
  "category": "507f1f77bcf86cd799439011"
}
```

**Risposta:**
```json
{
  "success": true,
  "message": "Spesa aggiunta!"
}
```

**Nota:** Il campo `expenseDate` è opzionale e usa la data corrente se non specificato.

## 📊 Modelli Dati

### Categoria
- `name`: Nome della categoria (1-50 caratteri)
- `type`: Tipo di categoria (`income` | `expense`)
- `description`: Descrizione opzionale
- `parentCategory`: Riferimento alla categoria parent (opzionale, ObjectId)
- `createdAt`: Data di creazione (automatica)
- `updatedAt`: Data di aggiornamento (automatica)

### Spesa
- `title`: Titolo della spesa (1-50 caratteri)
- `description`: Descrizione opzionale (max 100 caratteri)
- `expenseDate`: Data della spesa (default: data corrente)
- `amount`: Importo (numero positivo)
- `currency`: Codice valuta (enum con 120+ valute: ISO 4217 + criptovalute)
- `category`: Riferimento alla categoria (obbligatorio, ObjectId)
- `createdAt`: Data di creazione (automatica)
- `updatedAt`: Data di aggiornamento (automatica)

### ExchangeRate
- `meta.last_updated_at`: Data ultimo aggiornamento dei tassi
- `data`: Mappa di codici valuta → oggetti con `code` e `value`

## 💱 Valute Supportate

L'applicazione supporta oltre 120 valute tra cui:

**Valute Fiat:** EUR, USD, GBP, JPY, CHF, CAD, AUD, CNY, e molte altre

**Criptovalute:** BTC, ETH, ADA, BNB, DOT, LTC, XRP, USDC, USDT, e altre

## 🏗️ Architettura

```
src/
├── controllers/          # Logic di business per gli endpoint
├── db/                  # Configurazione database (connection.ts)
├── lib/                 # Utilità e helper (currencyClient.ts, utility.ts)
├── middlewares/         # Middleware Express (errorsHandler.ts)
├── models/             # Schemi Mongoose (schemas.ts) e tipi Zod (types.ts)
├── routers/            # Definizione delle rotte API
├── seeders/            # Script per popolare il database
└── index.ts            # Entry point dell'applicazione
```

### Pattern Architetturali

- **Validazione duale**: Gli schemi Zod in `src/models/types.ts` definiscono la validazione dei dati, mentre gli schemi Mongoose in `src/models/schemas.ts` definiscono la struttura del database. I due schemi sono sincronizzati.
- **Error handling centralizzato**: Tutti gli errori (Zod, standard, sconosciuti) vengono gestiti dal middleware in `src/middlewares/errorsHandler.ts`.
- **Popolamento relazioni**: Le query usano `.populate()` di Mongoose per includere automaticamente i dati delle relazioni (es. categoria padre, categoria della spesa).
- **Graceful shutdown**: Il server gestisce SIGINT e SIGTERM per disconnettersi correttamente da MongoDB prima di terminare.

## 🔧 Stack Tecnologico

- **Runtime:** Node.js
- **Framework:** Express.js
- **Linguaggio:** TypeScript
- **Database:** MongoDB con Mongoose ODM
- **Validazione:** Zod con localizzazione italiana
- **Sviluppo:** ts-node-dev per hot reload
- **Date/Time:** Day.js per manipolazione date
- **HTTP Client:** Axios per chiamate API esterne

## 🤝 Contribuire

1. Fork del progetto
2. Crea un feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push del branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📝 Licenza

Questo progetto è distribuito sotto licenza ISC. Vedi il file `LICENSE` per maggiori dettagli.

## 📧 Contatti

Francesco Palazzo - [GitHub](https://github.com/FrancescoPalazzo97)

Link del progetto: [https://github.com/FrancescoPalazzo97/track-my-money-back](https://github.com/FrancescoPalazzo97/track-my-money-back)