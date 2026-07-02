# ClearClause

**Know what you're actually signing.**

ClearClause is an AI-powered web application that translates legal documents into plain English. Paste a contract, lease, or Terms of Service and receive a concise summary, key terms, potential red flags, and practical insights before you sign.

> **Disclaimer:** ClearClause is an informational tool and does **not** provide legal advice. Always consult a qualified legal professional for important legal decisions.

---

## ✨ Features

* 📄 Plain-English summaries of contracts and legal documents
* 🚩 Highlights potentially risky clauses
* 📌 Extracts important terms such as:

  * Duration
  * Payment
  * Termination
  * Penalties
* ⚖️ Overall risk assessment
* 📝 Top three things you should know before signing
* 🔍 Clickable clause highlighting in the original document
* 🔒 Privacy-first design with no document storage
* ⚡ Fast analysis powered by Google's Gemini API

---

## Tech Stack

* HTML
* CSS
* Vanilla JavaScript
* Vercel Serverless Functions
* Google Gemini API

---

## Project Structure

```text
clearclause/
│
├── api/
│   └── analyze.js
├── index.html
├── package.json
├── README.md
└── .gitignore
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/clearclause.git
cd clearclause
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your environment

Create a `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

---

## Run Locally

```bash
vercel dev
```

Open:

```
http://localhost:3000
```

---

## Deploy

This project is designed for **Vercel**.

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the environment variable:

```
GEMINI_API_KEY
```

4. Deploy.

---

## How It Works

1. Paste a contract, lease, or Terms of Service.
2. Click **Analyze Document**.
3. The document is securely sent to the backend.
4. Gemini analyzes the document and returns structured JSON.
5. ClearClause displays:

   * Overall Risk
   * Top 3 Things You Should Know
   * Plain-English Summary
   * Key Terms
   * Red Flags
   * Original Document with highlighted clauses
   * Consequences of breaking the agreement

---

## Privacy

ClearClause does **not** store your documents.

The document is sent securely to the AI model for analysis and is discarded after processing.

---

## Roadmap

* PDF and DOCX uploads
* Document comparison
* Saved analysis history
* Multi-language support
* Contract search
* Export to PDF
* User accounts
* Premium features

---

## Contributing

Contributions, feature suggestions, and bug reports are welcome. Feel free to open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License.

---

Built with ❤️ to make legal documents easier to understand.
