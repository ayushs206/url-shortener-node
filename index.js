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
                body { font-family: 'Segoe UI'; text-align: center; padding: 100px; background: #f7f9fc; }
                h1 { color: #2c3e50; }
                form { margin-top: 30px; }
                input { padding: 10px; width: 300px; border: 1px solid #ccc; border-radius: 6px; }
                button { padding: 10px 20px; border: none; background: #3498db; color: white; border-radius: 6px; cursor: pointer; }
                button:hover { background: #2980b9; }
            </style>
        </head>
        <body>
            <h1>🔗 URL Shortener</h1>
            <form action="/shorten" method="POST">
                <input type="text" name="url" placeholder="Enter your URL" required />
                <button type="submit">Shorten</button>
            </form>
        </body>
        </html>
    `);
});

app.post("/shorten", async (req, res) => {

    const { url } = req.body;

    if (!url || !url.startsWith("http")) {
        return res.status(400).send("❌ Please enter a valid URL starting with http or https.");
    }

    const id = Math.random().toString(36).substring(2, 8);

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


app.listen(process.env.PORT, () => {
    console.log("Site started on port: ", process.env.PORT);
})