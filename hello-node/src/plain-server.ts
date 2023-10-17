// Plain server that just uses node (no Express) and does basic HTTP stuff. For science.

import http from "http";

const server = http.createServer( (req, res) => {
        console.log("received a request!!!1");
        
        
        res.setHeader("Content-type", "text/plain");
        res.write("Hello, world!!!1\r\n");
        res.end();
    }
)

server.listen(3001);
