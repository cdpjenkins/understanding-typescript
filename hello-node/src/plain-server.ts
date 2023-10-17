// Plain server that just uses node (no Express) and does basic HTTP stuff. For science.

import http from "http";

let visitorNumber = 0;

const server = http.createServer( (req, res) => {    
        res.setHeader("Content-type", "text/html");
        res.write(`
        <html>
            <body>
                <h1>Hello World!!!1</h1>
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
        </html>`);
        res.end();
    }
)

// Note that the visitor number appears to go up by 2 each time when you hit this from Chrome (and likely other browsers)
// because Chrome sends two requests, one for "/" and one for "favicon.ico".
function getNextVisitorNumber() {
    console.log(visitorNumber);

    return ++visitorNumber;
}

server.listen(3001);
