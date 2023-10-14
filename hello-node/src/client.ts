import axios from 'axios';

addTODO("TODO number one");
addTODO("the second TODO");
addTODO("et cetera");

getAllTODOs();

function getAllTODOs() {
    axios("http://localhost:3000/todos")
        .then(res => {
            console.log(res.data);
        });
}

function addTODO(message: string) {
    axios.post(
        "http://localhost:3000/todos",
        {
            text: message
        }
    ).then(res => {
        console.log(res.status);
    });
}

