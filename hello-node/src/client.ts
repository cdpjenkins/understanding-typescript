import axios from 'axios';
import { Todo } from './models/todosModel';

addTODO("TODO number one");
addTODO("the second TODO");
addTODO("et cetera");

getAllTODOs();

function getAllTODOs() {
    axios("http://localhost:3000/todos")
        .then(res => {
            const todos: Todo[] = res.data;
            console.log(todos);
        });
}

function addTODO(message: string) {
    axios.post(
        "http://localhost:3000/todos",
        new Todo(undefined, message)
    ).then(res => {
        console.log(res.status);
    });
}

