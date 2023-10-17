// Plain server that just uses node (no Express) and does basic HTTP stuff. For science.

import http from "http";
import url from "url";

let visitorNumber = 0;

const server = http.createServer((req: http.IncomingMessage, res) => {

    const queryParams = url.parse(req.url!, true).query;
    const name = queryParams["name"];

    if (req.url === "/favicon.ico") {
        res.statusCode = 404;
        res.end();
    } else if (req.method === "GET") {

        res.setHeader("Content-type", "text/html");

        if (name == undefined) {
            res.write(`
                <html>
                    <body>
                        <h1>Wot is ur name???</h1>
            
                        <form action="hello" method="POST">
                            <input type="text" name="postedName"/>
                            <input type="submit"/>
                        </form>
                    </body>
                </html>`
            );
        } else {
            res.write(`
                <html>
                    <body>
                        <h1>Hello ${name}!!!1</h1>
                    </body>

                    <p>
                        This is a page returned from Node.
                    </p>

                    <p>
                        You are visitor number ${getNextVisitorNumber()}.
                    </p>

                    <p>
                        Please visit again soon!
                    </p>
                </html>
            `);
        }
        res.end();
    } else if (req.method === "POST") {
        const body: Buffer[] = [];

        req.on("data", (chunk) => body.push(chunk));
        req.on("end", () => {
            const parsedBody = Buffer.concat(body).toString();
            const name = parsedBody.split("=")[1];
            res.setHeader("Location", `/hello?name=${name}`);
            res.statusCode = 302;
            res.end();                
        });
    }
});

function getNextVisitorNumber() {
    console.log(visitorNumber);

    return ++visitorNumber;
}

server.listen(3001);
