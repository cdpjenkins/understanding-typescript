import axios from 'axios';

axios("http://localhost:3000/todos")
    .then(res => {
        console.log(res.data);
    });
