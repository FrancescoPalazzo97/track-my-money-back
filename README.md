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
```

**Variabili richieste:**
- `PORT`: Porta su cui avviare il server (default: 3000)
- `MONGODB_URI`: Stringa di connessione MongoDB

4. Avvia MongoDB (se locale):
```bash
mongod
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
    "convertedAmount": ["50.00 USD"],
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
  "convertedAmount": ["50.00 USD"],
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

## 📊 Modelli Dati

### Categoria
- `name`: Nome della categoria (1-50 caratteri)
- `type`: Tipo di categoria (`income` | `expense`)
- `description`: Descrizione opzionale
- `parentCategory`: Riferimento alla categoria parent (opzionale)
- `createdAt`: Data di creazione (automatica)
- `updatedAt`: Data di aggiornamento (automatica)

### Spesa
- `title`: Titolo della spesa (1-50 caratteri)
- `description`: Descrizione opzionale (max 100 caratteri)
- `expenseDate`: Data della spesa (default: data corrente)
- `amount`: Importo (numero positivo)
- `currency`: Codice valuta (ISO 4217 + criptovalute)
- `convertedAmount`: Array di importi convertiti in altre valute
- `category`: Riferimento alla categoria (obbligatorio)
- `createdAt`: Data di creazione (automatica)
- `updatedAt`: Data di aggiornamento (automatica)

## 💱 Valute Supportate

L'applicazione supporta oltre 120 valute tra cui:

**Valute Fiat:** EUR, USD, GBP, JPY, CHF, CAD, AUD, CNY, e molte altre

**Criptovalute:** BTC, ETH, ADA, BNB, DOT, LTC, XRP, USDC, USDT, e altre

## 🏗️ Architettura

```
src/
├── controllers/          # Logic di business per gli endpoint
├── db/                  # Configurazione database
├── lib/                 # Utilità e helper
├── middlewares/         # Middleware Express (gestione errori)
├── models/             # Schemi e tipi MongoDB/Mongoose
├── routers/            # Definizione delle rotte API
└── index.ts            # Entry point dell'applicazione
```

## 🔧 Stack Tecnologico

- **Runtime:** Node.js
- **Framework:** Express.js
- **Linguaggio:** TypeScript
- **Database:** MongoDB con Mongoose ODM
- **Validazione:** Zod con localizzazione italiana
- **Sviluppo:** ts-node-dev per hot reload

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