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
- `withTransactions` (opzionale): Se impostato a `true`, include le transazioni associate a ogni categoria
- **Nota**: I due parametri possono essere combinati per ottenere categorie raggruppate con transazioni

**Esempio richiesta lista piatta:**
```
GET /categories
```

**Risposta:**
```json
{
  "success": true,
  "message": "Elenco categorie",
  "data": [
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
}
```

**Esempio richiesta gerarchica:**
```
GET /categories?group=true
```

**Risposta:**
```json
{
  "success": true,
  "message": "Elenco categorie raggruppate",
  "data": [
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
}
```

#### GET /categories/:id
Recupera una categoria specifica per ID.

**Risposta:**
```json
{
  "success": true,
  "message": "Categoria con id \"507f1f77bcf86cd799439011\"",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Alimentari",
    "type": "expense",
    "description": "Spese per cibo e bevande",
    "parentCategory": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
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

**Validazione:**
- `name`: Stringa (1-50 caratteri, required)
- `type`: Enum `"income"` o `"expense"` (required)
- `description`: Stringa (max 200 caratteri, optional)
- `parentCategory`: ObjectId valido (optional)

**Note:**
- Se specificato `parentCategory`, deve esistere e avere lo stesso `type` della categoria da creare
- Il nome della categoria deve essere unico

**Risposta:**
```json
{
  "success": true,
  "message": "Nuova Categoria aggiunta!",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Alimentari",
    "type": "expense",
    "description": "Spese per cibo e bevande",
    "parentCategory": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
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

**Note:**
- Una categoria non può essere figlia di sé stessa
- Se `parentCategory` non è presente nel body, viene rimosso dal database (categoria diventa di primo livello)
- La validazione si applica anche alle modifiche parziali

**Risposta:**
```json
{
  "success": true,
  "message": "Categoria modificata con successo!",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Supermercato",
    "type": "expense",
    "description": "Spese per alimentari e generi vari",
    "parentCategory": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### DELETE /categories/:id
Elimina una categoria con logica di cascata per le sottocategorie.

**Comportamento:**
- Se la categoria eliminata aveva un `parentCategory`, le sue sottocategorie ereditano quel genitore
- Se la categoria era di primo livello (senza parent), le sottocategorie diventano di primo livello

**Risposta:**
```json
{
  "success": true,
  "message": "Categoria Alimentari Eliminata con successo!",
  "data": "507f1f77bcf86cd799439011"
}
```

### Transazioni

#### GET /transactions
Recupera tutte le transazioni con popolamento delle categorie associate e conversione valutaria dinamica.

**Query Parameters:**
- `startDate` (obbligatorio): Data inizio periodo (formato ISO 8601, es: "2024-01-01")
- `endDate` (obbligatorio): Data fine periodo (formato ISO 8601, es: "2024-12-31")
- `baseCurrency` (opzionale): Valuta di conversione (default: EUR)

**Validazione:**
- `startDate` deve essere precedente o uguale a `endDate`
- `baseCurrency` deve essere uno dei 120+ codici valuta supportati

**Esempio richiesta:**
```
GET /transactions?startDate=2024-01-01&endDate=2024-12-31&baseCurrency=EUR
```

**Risposta:**
```json
{
  "success": true,
  "message": "Elenco delle transazioni",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Spesa al supermercato",
      "description": "Spesa settimanale",
      "transactionDate": "2024-01-01T00:00:00.000Z",
      "amount": 50.00,
      "currency": "EUR",
      "amountInEUR": 50.00,
      "category": {
        "_id": "507f1f77bcf86cd799439011",
        "type": "expense"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Note sulla Conversione Valutaria:**
- Gli importi vengono convertiti automaticamente nella valuta base specificata tramite la funzione `convertTransaction()` in [src/lib/utility.ts](src/lib/utility.ts)
- Il campo `amountInEUR` (o `amountIn[Currency]`) contiene l'importo convertito; il campo `amount` rimane nella valuta originale
- La conversione usa i tassi di cambio storici più recenti disponibili alla o prima della data della transazione
- Formula di conversione: `(amount / transactionCurrencyData.value) * baseCurrencyData.value`
- Se i tassi di cambio mancano per una data specifica, vengono scaricati automaticamente tramite `dumbOneRates()`
- Il middleware `verifyExchangeRates` assicura che i tassi di cambio siano aggiornati prima di processare le richieste
- Le transazioni sono ordinate per `transactionDate` decrescente (più recenti prima)

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
  "success": true,
  "message": "Elenco delle transazioni",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Spesa al supermercato",
    "description": "Spesa settimanale",
    "transactionDate": "2024-01-01T00:00:00.000Z",
    "amount": 50.00,
    "currency": "EUR",
    "amountInUSD": 54.25,
    "category": {
      "_id": "507f1f77bcf86cd799439011",
      "type": "expense"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
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

**Validazione:**
- `title`: Stringa (1-50 caratteri, required)
- `description`: Stringa (max 100 caratteri, optional)
- `transactionDate`: Data ISO 8601 (optional, default: data corrente)
- `amount`: Numero non negativo (required, viene arrotondato a 2 decimali)
- `currency`: Enum dei codici valuta supportati (required)
- `category`: ObjectId valido di una categoria esistente (required)

**Risposta:**
```json
{
  "success": true,
  "message": "Transazione aggiunta!",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "title": "Spesa al supermercato",
    "description": "Spesa settimanale",
    "transactionDate": "2024-01-01T00:00:00.000Z",
    "amount": 50.00,
    "currency": "EUR",
    "amountInEUR": 50.00,
    "category": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Note:**
- Il campo `transactionDate` è opzionale e usa la data corrente se non specificato
- Le transazioni vengono salvate nella valuta originale tramite Mongoose `Model.insertOne()`
- L'importo viene automaticamente arrotondato a 2 decimali tramite la funzione `round()` in [src/lib/utility.ts](src/lib/utility.ts)
- La conversione valutaria avviene dinamicamente durante il recupero dati (GET) tramite `convertTransaction()`
- La validazione dei dati viene effettuata con Zod schema (`TransactionInputZSchema`) prima dell'inserimento

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
  "message": "Transazione modificata con successo!",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Spesa mensile",
    "description": "Spesa settimanale",
    "transactionDate": "2024-01-01T00:00:00.000Z",
    "amount": 75.00,
    "currency": "EUR",
    "amountInEUR": 75.00,
    "category": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T14:00:00.000Z"
  }
}
```

#### DELETE /transactions/:id
Elimina una transazione.

**Risposta:**
```json
{
  "success": true,
  "message": "transazione eliminata con successo",
  "data": "507f1f77bcf86cd799439012"
}
```

## 📊 Modelli Dati

### Struttura Risposta API
Tutti gli endpoint seguono una struttura di risposta consistente:
```typescript
{
  success: boolean,    // Indica se l'operazione è riuscita
  message: string,     // Messaggio descrittivo in italiano
  data: T              // I dati richiesti (tipo varia per endpoint)
}
```

### Categoria
**Schema Zod** ([src/types/categoriesTypes.ts](src/types/categoriesTypes.ts)):
- `name`: Stringa (1-50 caratteri, required, trimmed)
- `type`: Enum `"income"` | `"expense"` (required)
- `description`: Stringa (max 200 caratteri, optional)
- `parentCategory`: ObjectId (optional)
- `createdAt`: Data (automatica)
- `updatedAt`: Data (automatica)

**Validazioni:**
- Il nome deve essere unico nel database
- Se specificato, `parentCategory` deve esistere e avere lo stesso `type`
- Una categoria non può essere figlia di sé stessa

**Schema Mongoose** ([src/schemas/categoriesSchemas.ts](src/schemas/categoriesSchemas.ts)):
- Timestamps automatici abilitati
- Indice su `name` per performance

### Transazione
**Schema Zod** ([src/types/transactionsTypes.ts](src/types/transactionsTypes.ts)):
- `title`: Stringa (1-50 caratteri, required, trimmed)
- `description`: Stringa (max 100 caratteri, optional)
- `transactionDate`: Data (optional, default: data corrente, supporta coerce da stringa ISO)
- `amount`: Numero non negativo (required, arrotondato a 2 decimali)
- `currency`: Enum dei [codici valuta supportati](#-valute-supportate) (required)
- `category`: ObjectId di categoria esistente (required)
- `createdAt`: Data (automatica)
- `updatedAt`: Data (automatica)

**Campi calcolati dinamicamente (solo in GET endpoints):**
- `amountInEUR` (o `amountIn[Currency]`): Importo convertito nella valuta base specificata
  - Il campo `amount` originale rimane invariato
  - Usa i tassi di cambio storici più recenti disponibili alla data della transazione

**Schema Mongoose** ([src/schemas/transactionsSchemas.ts](src/schemas/transactionsSchemas.ts)):
- Timestamps automatici abilitati
- Indice su `transactionDate: -1` per ordinamento efficiente (transazioni più recenti prima)
- Referenza alla categoria tramite ObjectId

### ExchangeRate
**Schema Mongoose** ([src/schemas/exchangeRatesSchemas.ts](src/schemas/exchangeRatesSchemas.ts)):
- `meta.last_updated_at`: Data ultimo aggiornamento dei tassi
- `data`: Mappa di codici valuta → oggetti `{ code: string, value: number }`

**Note:**
- I tassi vengono aggiornati automaticamente quando mancanti
- Usati per conversione dinamica delle transazioni
- Possono essere popolati tramite `npm run seed`

## 💱 Valute Supportate

L'applicazione supporta oltre 120 valute tra cui:

**Valute Fiat:** EUR, USD, GBP, JPY, CHF, CAD, AUD, CNY, e molte altre

**Criptovalute:** BTC, ETH, ADA, BNB, DOT, LTC, XRP, USDC, USDT, e altre

## 🏗️ Architettura

### Struttura del Progetto

```
src/
├── controllers/          # Logica di business per gli endpoint
│   ├── categoryControllers.ts      # 5 controller: getAllCategories, getCategoryById,
│   │                                # addNewCategory, deleteCategory, modifyCategory
│   └── transactionController.ts    # 5 controller: getTransactions, getTransactionById,
│                                    # addNewTransaction, deleteTransaction, modifyTransaction
├── db/                  # Configurazione database
│   └── connection.ts               # Connessione MongoDB con Mongoose
│
├── lib/                 # Utilità e helper functions
│   ├── currencyClient.ts           # Client Axios configurato per currencyapi.com
│   ├── utility.ts                  # Funzioni: convertTransaction, round,
│   │                                # getSubCategories, getCategoriesWitTransactions
│   ├── validations.ts              # Funzioni: validateDate, validateNewCategory
│   ├── dumbOneRates.ts             # Fetch tassi di cambio mancanti per range di date
│   ├── dumpHistoricalrates.ts      # Fetch tassi storici per seeding iniziale
│   └── index.ts                    # Barrel export
│
├── middlewares/         # Middleware Express
│   ├── errorsHandler.ts            # Gestione centralizzata errori (Zod, standard, unknown)
│   ├── verifyExchangeRates.ts      # Verifica tassi di cambio aggiornati prima delle richieste
│   └── index.ts                    # Barrel export
│
├── models/             # Definizioni modelli Mongoose
│   ├── models.ts                   # CategoryModel, TransactionModel, ExchangeRateModel
│   └── index.ts                    # Barrel export
│
├── routers/            # Definizione delle rotte API
│   ├── categoriesRoute.ts          # Router per /categories con tutti gli endpoint
│   └── transactionsRouter.ts       # Router per /transactions con verifyExchangeRates middleware
│
├── schemas/            # Schemi Mongoose (mirror degli Zod schemas)
│   ├── categoriesSchemas.ts        # CategorySchema con timestamps
│   ├── transactionsSchemas.ts      # TransactionSchema con timestamps e index su transactionDate
│   ├── exchangeRatesSchemas.ts     # ExchangeRateSchema
│   └── index.ts                    # Barrel export
│
├── seeders/            # Script per popolare il database
│   └── historicalExchangeRates.ts  # Popola database con tassi storici (npm run seed)
│
├── types/              # Tipi TypeScript e schemi Zod (validazione runtime)
│   ├── commonTypes.ts              # codes array (120+ valute), CodesSchema, objectIdZSchema, TSuccess
│   ├── categoriesTypes.ts          # CategoryInputZSchema, CategoryInputZSchemaForPatch, types
│   ├── transactionsTypes.ts        # TransactionInputZSchema, TransactionInputZSchemaForPatch,
│   │                                # GetTransactionQueryZSchema, types
│   ├── apiResponsesTypes.ts        # Tipi per risposte API esterne (currencyapi.com)
│   └── index.ts                    # Barrel export
│
└── index.ts            # Entry point: setup Express, CORS, routes, graceful shutdown
```

### Pattern Architetturali

#### 1. Architettura Modulare
Separazione chiara delle responsabilità in directory dedicate:
- **types/**: Definizioni Zod e TypeScript
- **schemas/**: Schemi Mongoose (mirror degli Zod)
- **models/**: Modelli Mongoose compilati
- **controllers/**: Logica di business
- **routers/**: Definizione rotte
- **middlewares/**: Middleware Express
- **lib/**: Funzioni di utilità

#### 2. Barrel Exports
Tutte le directory principali usano file `index.ts` per export centralizzati:
```typescript
// Esempio: src/types/index.ts
export * from './commonTypes';
export * from './categoriesTypes';
export * from './transactionsTypes';
```
Abilita import puliti: `import { CategoryInputZSchema, objectIdZSchema } from '../types'`

#### 3. Validazione Duale (Zod + Mongoose)
- **Zod schemas** ([src/types/](src/types/)): Validazione runtime dei dati in input/output
- **Mongoose schemas** ([src/schemas/](src/schemas/)): Definizione struttura database
- I due schemi sono **sincronizzati** e mirror l'uno dell'altro
- Zod valida prima che i dati raggiungano il database

#### 4. Type Safety Completa
```typescript
// I tipi TypeScript sono inferiti dagli schemi Zod
export type TCategoryInput = z.infer<typeof CategoryInputZSchema>;
export type TTransactionLean = z.infer<typeof TransactionZSchema> & { _id: Types.ObjectId };
```
- Zero duplicazione di definizioni di tipo
- Type safety sia a compile-time che runtime

#### 5. Error Handling Centralizzato
Il middleware `errorsHandler` in [src/middlewares/errorsHandler.ts](src/middlewares/errorsHandler.ts) gestisce:
- **Errori Zod**: Validazione fallita con messaggi in italiano
- **Errori standard**: Errori applicativi con message personalizzati
- **Errori unknown**: Errori imprevisti con risposta generica

Tutti i controller possono semplicemente `throw` errori senza preoccuparsi della gestione.

#### 6. Pattern dei Controllers
Tutti i controller seguono lo stesso pattern ([src/controllers/](src/controllers/)):
```typescript
export const getExample = async (req: Request, res: Response<TSuccess<DataType>>) => {
  // 1. Parse e validazione input con Zod
  const input = Schema.parse(req.body);

  // 2. Operazioni database
  const data = await Model.find().populate().lean();

  // 3. Risposta strutturata
  res.status(200).json({ success: true, message: "Messaggio in italiano", data });
}
```

#### 7. Query Optimization
- **`.lean()`**: Usato su tutte le query di lettura per performance (ritorna plain objects)
- **`.populate()`**: Popola automaticamente le relazioni (es: category nelle transazioni)
- **Indici**: TransactionSchema ha indice su `transactionDate: -1` per ordinamento efficiente

#### 8. Conversione Valutaria Dinamica
Implementata in [src/lib/utility.ts](src/lib/utility.ts):
```typescript
convertTransaction(transaction, baseCurrency)
```
- Usa tassi di cambio storici (non real-time) per consistenza
- Formula: `(amount / transactionCurrencyData.value) * baseCurrencyData.value`
- Ritorna il campo `amountIn[Currency]` lasciando `amount` originale invariato
- Se i tassi mancano, li scarica automaticamente tramite `dumbOneRates()`

#### 9. Middleware Specializzato
**verifyExchangeRates** ([src/middlewares/verifyExchangeRates.ts](src/middlewares/verifyExchangeRates.ts)):
- Usato su tutte le route `/transactions`
- Verifica che i tassi di cambio siano aggiornati
- Scarica tassi mancanti prima di processare richieste

#### 10. Graceful Shutdown
[src/index.ts](src/index.ts) gestisce SIGINT e SIGTERM:
```typescript
process.on('SIGINT', async () => {
  await disconnectToMongo();
  process.exit(0);
});
```
Garantisce disconnessione pulita da MongoDB prima di terminare.

#### 11. Logica Gerarchica Categorie
- **Cascading delete**: Quando una categoria viene eliminata, le sottocategorie ereditano il parent
- **getSubCategories()**: Costruisce ricorsivamente l'albero gerarchico
- **Validazione parent**: Una categoria parent deve esistere e avere lo stesso `type`

#### 12. Localizzazione Italiana
- Zod configurato con locale italiana: `z.config(it())`
- Tutti i messaggi di errore e successo sono in italiano
- Console output in italiano

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