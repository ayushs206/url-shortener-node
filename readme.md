# 🔗 URL Shortener (Node.js + Express)

A simple, lightweight URL shortener built with **Express.js** and **Node.js**, storing links locally in a `links.json` file.

---

## 🚀 Features
- Shorten any valid `http` or `https` URL.
- Automatically saves shortened links to a local JSON file.
- Redirects short links instantly.
- Simple front-end form (HTML + CSS).
- Persistent storage with `links.json`.

---

## v1.1 – Custom Keyword Support
- Added ability for users to choose their own short link.
- Random generation still works if custom keyword is empty.

## ⚙️ Installation & Setup
1. Clone this repository:
   ```bash
   git clone https://github.com/ayushs206/url-shortener-node.git
   cd url-shortener-node

2. Install dependencies:
   ```bash
   npm install

3. Create a .env file:
   ```bash
   PORT=3000

4. Run:
   ```bash
   node index.js

5. Visit → http://localhost:3000

