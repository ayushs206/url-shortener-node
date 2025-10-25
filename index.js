require("dotenv").config();

const express = require("express");
const app = new express();

const fs = require('fs');
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let links = {};
const linksurlpath = path.join(__dirname, "links.json");
if (fs.existsSync(linksurlpath)) {
    links = JSON.parse(fs.readFileSync(linksurlpath))
}

const saveLinks = () => {
    fs.writeFileSync(linksurlpath, JSON.stringify(links, null, 2))
}

app.get("/", (req, res) => {
    res.send(`
<html>
<head>
  <title>URL Shortener</title>
  <style>
    * {
      box-sizing: border-box;
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }

    body {
      background: linear-gradient(135deg, #74ABE2, #5563DE);
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }

    .container {
      background: white;
      padding: 40px 50px;
      border-radius: 16px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      text-align: center;
      width: 90%;
      max-width: 420px;
    }

    h1 {
      margin-bottom: 10px;
      color: #2d3436;
      font-size: 2rem;
    }

    p {
      color: #636e72;
      font-size: 0.95rem;
      margin-bottom: 30px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    input {
      padding: 12px 14px;
      font-size: 1rem;
      border: 1px solid #dfe6e9;
      border-radius: 8px;
      transition: 0.2s;
    }

    input:focus {
      border-color: #0984e3;
      outline: none;
      box-shadow: 0 0 5px rgba(9, 132, 227, 0.3);
    }

    button {
      padding: 12px;
      font-size: 1rem;
      border: none;
      background: #0984e3;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      transition: 0.25s;
    }

    button:hover {
      background: #0773c2;
      transform: translateY(-1px);
    }

    footer {
      margin-top: 25px;
      font-size: 0.8rem;
      color: #b2bec3;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔗 URL Shortener</h1>
    <p>Simplify your links and share them with ease.</p>
    <form action="/shorten" method="POST">
      <input type="text" name="url" placeholder="Enter your long URL" required />
      <input type="text" name="keyword" placeholder="Custom keyword (optional)" />
      <button type="submit">Shorten URL</button>
    </form>
    <footer>Powered by Express.js</footer>
  </div>
</body>
</html>
`);

});

app.post("/shorten", async (req, res) => {

    const { url } = req.body;

    const keyword = req.body?.keyword;

    if (keyword && links[keyword]) {
        return res.status(400).send("❌ Entered keyword is not available.");
    }

    if (!url || !url.startsWith("http")) {
        return res.status(400).send("❌ Please enter a valid URL starting with http or https.");
    }

    const id = keyword || Math.random().toString(36).substring(2, 8);

    links[id] = url;
    saveLinks();

    const fullShortUrl = `${req.protocol}://${req.get("host")}/${id}`;
    res.send(`
        <html>
        <head><title>Shortened URL</title></head>
        <body style="font-family:sans-serif;text-align:center;padding:50px;">
            <h2>✅ Your shortened URL is:</h2>
            <a href="${fullShortUrl}" target="_blank">${fullShortUrl}</a>
            <p>Redirects to → <b>${url}</b></p>
            <a href="/">Shorten another</a>
        </body>
        </html>
    `);
})

app.get("/:id", async (req, res) => {
    let keyword = req.params.id;

    if (links[keyword]) {
        res.redirect(links[keyword]);
    } else {
        res.status(404).send(`
            <html>
                <head>
                    <title>URL Not Found</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', sans-serif;
                            background-color: #f7f9fc;
                            color: #333;
                            text-align: center;
                            padding: 100px;
                        }
                        .card {
                            display: inline-block;
                            padding: 30px 50px;
                            border: 1px solid #ddd;
                            border-radius: 12px;
                            background: white;
                            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                        }
                        h1 {
                            color: #e74c3c;
                        }
                        a {
                            text-decoration: none;
                            color: #3498db;
                            font-weight: 500;
                        }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h1>🚫 No Valid URL Found</h1>
                        <a href="/">Shorten your URL now!!</a>
                    </div>
                </body>
            </html>
        `);
    }
});


app.listen(process.env.PORT, async () => {
    console.log("Site started on port: ", process.env.PORT);
})
