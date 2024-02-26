import { RequestHandler, Request, Response, NextFunction } from "express";

import { Todo } from "../models/todosModel";

const todos: Todo[] = [];

let lastId: number = 0;

function allocateId(): string {
    return (++lastId).toString();
}

export const createTodo: RequestHandler = ( req, res, next) => {
    const text = (req.body as {text: string}).text;
    const newTodo = new Todo(allocateId(), text);

    todos.push(newTodo);

    return res.status(201).json(
        {
            message: "Created a TODO",
            createdTodo: newTodo
        }
    )
};

export const getTodos: RequestHandler = (req, res, next) => {
    // const id = req.query["id"];
    // const todo = todos.find( (entry) => { entry.id == id });
    // 
    // if (todo != undefined) {
        // return res.status(200).json(todo);
    // } else {
        // return res.status(404);
    // }

    return res.status(200).json(todos);
}
