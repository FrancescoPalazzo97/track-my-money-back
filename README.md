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
Recupera tutte le categorie.

**Query Parameters:**
- `group` (opzionale): Se impostato a `true`, restituisce le categorie in struttura gerarchica con sottocategorie

**Esempio richiesta lista piatta:**
```
GET /categories
```

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

**Esempio richiesta gerarchica:**
```
GET /categories?group=true
```

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
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "subCategories": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Supermercato",
        "type": "expense",
        "parentCategory": "507f1f77bcf86cd799439011",
        "subCategories": []
      }
    ]
  }
]
```

#### GET /categories/:id
Recupera una categoria specifica per ID.

**Risposta:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Alimentari",
  "type": "expense",
  "description": "Spese per cibo e bevande",
  "parentCategory": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
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

#### PATCH /categories/:id
Modifica una categoria esistente. Tutti i campi sono opzionali.

**Body:**
```json
{
  "name": "Supermercato",
  "description": "Spese per alimentari e generi vari"
}
```

**Risposta:**
```json
{
  "success": true,
  "message": "Categoria modificata con successo!"
}
```

#### DELETE /categories/:id
Elimina una categoria.

**Risposta:**
```json
{
  "success": true,
  "message": "Categoria Eliminata con successo!"
}
```

### Transazioni

#### GET /transactions
Recupera tutte le transazioni con popolamento delle categorie associate e conversione valutaria dinamica.

**Query Parameters:**
- `startDate` (obbligatorio): Data inizio periodo (formato ISO 8601)
- `endDate` (obbligatorio): Data fine periodo (formato ISO 8601)
- `baseCurrency` (opzionale): Valuta di conversione (default: EUR)

**Esempio richiesta:**
```
GET /transactions?startDate=2024-01-01&endDate=2024-12-31&baseCurrency=EUR
```

**Risposta:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Spesa al supermercato",
    "description": "Spesa settimanale",
    "transactionDate": "2024-01-01T00:00:00.000Z",
    "amount": 50.00,
    "currency": "EUR",
    "amountInEUR": 50.00,
    "category": {
      "_id": "507f1f77bcf86cd799439011"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Note:**
- Gli importi vengono convertiti automaticamente nella valuta base specificata
- Il campo `amountInEUR` contiene l'importo convertito (il campo `amount` rimane nella valuta originale)
- La conversione usa i tassi di cambio storici alla data della transazione
- Se i tassi di cambio mancano per una data specifica, vengono scaricati automaticamente

#### GET /transactions/:id
Recupera una transazione specifica per ID con conversione valutaria opzionale.

**Query Parameters:**
- `baseCurrency` (opzionale): Valuta di conversione (default: EUR)

**Esempio richiesta:**
```
GET /transactions/507f1f77bcf86cd799439012?baseCurrency=USD
```

**Risposta:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Spesa al supermercato",
  "description": "Spesa settimanale",
  "transactionDate": "2024-01-01T00:00:00.000Z",
  "amount": 50.00,
  "currency": "EUR",
  "amountInEUR": 54.25,
  "category": "507f1f77bcf86cd799439011",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### POST /transactions
Crea una nuova transazione.

**Body:**
```json
{
  "title": "Spesa al supermercato",
  "description": "Spesa settimanale",
  "transactionDate": "2024-01-01T00:00:00.000Z",
  "amount": 50.00,
  "currency": "EUR",
  "category": "507f1f77bcf86cd799439011"
}
```

**Risposta:**
```json
{
  "success": true,
  "message": "Transazione aggiunta!"
}
```

**Note:**
- Il campo `transactionDate` è opzionale e usa la data corrente se non specificato
- Le transazioni vengono salvate nella valuta originale
- La conversione valutaria avviene dinamicamente durante il recupero dati (GET)

#### PATCH /transactions/:id
Modifica una transazione esistente. Tutti i campi sono opzionali.

**Body:**
```json
{
  "title": "Spesa mensile",
  "amount": 75.00
}
```

**Risposta:**
```json
{
  "success": true,
  "message": "Transazione modificata con successo!"
}
```

#### DELETE /transactions/:id
Elimina una transazione.

**Risposta:**
```json
{
  "success": true,
  "message": "transazione eliminata con successo"
}
```

## 📊 Modelli Dati

### Categoria
- `name`: Nome della categoria (1-50 caratteri)
- `type`: Tipo di categoria (`income` | `expense`)
- `description`: Descrizione opzionale
- `parentCategory`: Riferimento alla categoria parent (opzionale, ObjectId)
- `createdAt`: Data di creazione (automatica)
- `updatedAt`: Data di aggiornamento (automatica)

### Transazione
- `title`: Titolo della transazione (1-50 caratteri)
- `description`: Descrizione opzionale (max 100 caratteri)
- `transactionDate`: Data della transazione (default: data corrente)
- `amount`: Importo nella valuta originale (numero positivo)
- `currency`: Codice valuta (enum con 120+ valute: ISO 4217 + criptovalute)
- `category`: Riferimento alla categoria (obbligatorio, ObjectId)
- `createdAt`: Data di creazione (automatica)
- `updatedAt`: Data di aggiornamento (automatica)

**Campi calcolati dinamicamente (solo in GET /transactions):**
- `amountInEUR`: Importo convertito nella valuta base specificata (il campo `amount` rimane nella valuta originale)

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
│   ├── categoryControllers.ts
│   └── transactionController.ts
├── db/                  # Configurazione database
│   └── connection.ts
├── lib/                 # Utilità e helper
│   ├── currencyClient.ts       # Client Axios per API esterne
│   ├── utility.ts              # Conversione valute e arrotondamenti
│   ├── validations.ts          # Validazione date e categorie
│   ├── dumbOneRates.ts         # Fetch tassi di cambio mancanti
│   └── dumpHistoricalRates.ts  # Fetch tassi storici
├── middlewares/         # Middleware Express
│   └── errorsHandler.ts
├── models/             # Definizioni modelli Mongoose
│   └── models.ts
├── routers/            # Definizione delle rotte API
│   ├── categoriesRoute.ts
│   └── transactionsRouter.ts
├── schemas/            # Schemi Mongoose
│   ├── categoriesSchemas.ts
│   ├── transactionsSchemas.ts
│   ├── exchangeRatesSchemas.ts
│   └── index.ts
├── seeders/            # Script per popolare il database
│   └── historicalExchangeRates.ts
├── types/              # Tipi TypeScript e schemi Zod
│   ├── commonTypes.ts          # Tipi condivisi (codes, ObjectId, TSuccess)
│   ├── categoriesTypes.ts      # Zod schemas per categorie
│   ├── transactionsTypes.ts    # Zod schemas per transazioni
│   ├── apiResponsesTypes.ts    # Tipi per risposte API esterne
│   └── index.ts
└── index.ts            # Entry point dell'applicazione
```

### Pattern Architetturali

- **Architettura modulare**: Separazione in directory dedicate per types, schemas, models, e utilities per una migliore organizzazione del codice
- **Validazione duale**: Gli schemi Zod in `src/types/` definiscono la validazione dei dati, mentre gli schemi Mongoose in `src/schemas/` definiscono la struttura del database. I due schemi sono sincronizzati.
- **Error handling centralizzato**: Tutti gli errori (Zod, standard, sconosciuti) vengono gestiti dal middleware in `src/middlewares/errorsHandler.ts`.
- **Popolamento relazioni**: Le query usano `.populate().lean()` di Mongoose per includere automaticamente i dati delle relazioni con performance ottimizzate.
- **Graceful shutdown**: Il server gestisce SIGINT e SIGTERM per disconnettersi correttamente da MongoDB prima di terminare.
- **Conversione dinamica valute**: La conversione valutaria avviene durante il recupero delle transazioni (GET /transactions) tramite la funzione `convertTransaction()` in `src/lib/utility.ts`. La formula di conversione è: `(amount / transactionCurrencyData.value) * baseCurrencyData.value`, usando i tassi di cambio storici più recenti disponibili alla data della transazione.
- **Fetch automatico tassi di cambio**: Se i tassi di cambio mancano per una data specifica, il sistema li scarica automaticamente tramite `dumbOneRates()` per garantire conversioni accurate.
- **Validazione categorie**: Le categorie parent devono esistere e avere lo stesso tipo (income/expense) della categoria figlia tramite `validateNewCategory()` in `src/lib/validations.ts`.

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