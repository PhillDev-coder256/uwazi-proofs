# 🕊️ Uwazi Proofs

**Transparent Eligibility – Private Data**

Uwazi Proofs is a demo web app that shows how to verify **scholarship or social-safety-net eligibility** while keeping **personal data private**. It uses **lightweight machine learning** for document data extraction and **zero-knowledge proof concepts** to share only the *proof of eligibility*—not the raw documents.

---

## 🚀 Features

* **Program Search & Filter** – Elastic-style search bar with category filtering.
* **Document Upload & Parsing** – Upload transcripts, IDs, income statements and more.
* **Automatic Eligibility Check** – ML-powered extraction checks each criterion.
* **Private Proof Generation** – Cryptographic hash/QR code proves eligibility without exposing sensitive data.
* **Responsive UI** – Built with modern React + Tailwind + Framer Motion.

---

## 🛠️ Tech Stack

* **Frontend:** React + TypeScript + Vite
* **Styling:** Tailwind CSS, Framer Motion
* **Icons:** Lucide-react
* **AI/ML:** Google Gemini API (for demo document extraction)
* **Zero-Knowledge Concept:** Cryptographic hashing to simulate ZK proofs

---

## 📦 Getting Started

### 1️⃣ Prerequisites

* [Node.js](https://nodejs.org/) $\geq$ 18
* A [Gemini API key](https://ai.google.dev/)

### 2️⃣ Clone and Install

```bash
git clone [https://github.com/PhillDev-coder256/uwazi-proofs.git](https://github.com/PhillDev-coder256/uwazi-proofs.git)
cd uwazi-proofs
npm install
````

### 3️⃣ Environment Variables

Create a file named **`.env.local`** in the project root:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4️⃣ Run Locally

```bash
npm run dev
```

Your app will be available at **`http://localhost:5173`** (or as shown in the console).

-----

## 📂 Project Structure

```
uwazi-proofs/
├─ components/         # React UI components (ProgramSelection, etc.)
├─ services/           # Gemini API & proof-generation services
├─ programs.ts         # Program definitions & eligibility rules
├─ types.ts            # Shared TypeScript interfaces
├─ App.tsx             # Root app component
└─ ...
```

-----

## 🧩 How It Works

1.  **Upload Documents** – PDFs or images (transcript, ID, income statement).
2.  **Data Extraction** – Gemini API extracts GPA, age, income, etc.
3.  **Eligibility Rules** – Each program defines criteria (e.g. GPA $\\geq$ 3.5).
4.  **Proof Generation** – App creates a cryptographic hash of the results only.
5.  **Verification** – Anyone can check the proof hash without seeing private data.

-----

## 🌍 Roadmap

  * **🔒 True zero-knowledge proof integration** (e.g. zk-SNARKs).
  * **📱 Offline / on-device ML model** for complete privacy.
  * **🏛️ Support for more social safety net programs.**

-----

## 🤝 Contributing

Pull requests are welcome\! For major changes, please open an issue first to discuss what you’d like to change.

-----

## 📜 License

This project is licensed under the **MIT** License.

-----

> **Uwazi** means “openness” or “transparency” in Swahili — perfectly reflecting the project’s mission: transparent verification with privacy preserved.

```
```