import * as http from "http";

http.get("http://localhost:3000/todos", (res) => {
    if (res.statusCode === 200) {
        let data = "";
        res.on("data", (chunk) => {
            data += chunk;
        });

        res.on("close", () => {console.log(data)});
    }
});
