const express = require("express")

const server = express()

server.get("/:page", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="module" src="/assets/${req.params.page}/index.js"></script>
        <link rel="stylesheet" href="/assets/${req.params.page}/index.css"></link>
        <link rel="stylesheet" href="/assets/app.css"></link>
        <title>${req.params.page.toUpperCase()}</title>
    </head>
    <body>
        
    </body>
    </html>
`)
})


server.use("/assets", express.static("dist"))
server.use("/", express.static("public"))

server.listen(3001)