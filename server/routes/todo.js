const express = require('express');
const router = express.Router();
const validTodo = require('../../lib/validations').validTodo;
const validId = require('../../lib/validations').validId;
const queries = require('../db/queries');
const setStatusRenderError = require('../../lib/responseHelpers');
const authHelpers = require('../auth/_helpers');

/* Router mounted at /todo . */
router.get('/', (req, res, next) => {
    queries
        .getAll()
        .then(todos =>{
            res.render('all', { todos: todos });
        })
});

router.get('/new', authHelpers.loginRequired, (req, res) => {
    res.render('new');
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    respondAndRender(id, res, 'single');
});

router.get('/:id/edit', authHelpers.loginRequired, (req, res) => {
     const id = req.params.id;
    respondAndRender(id, res, 'edit');
});

router.post('/', authHelpers.loginRequired, (req, res) => {
    validateTodoRenderError(req, res, (todo) => {
        console.log(req, 'request within todo create')
        todo.date = new Date();
        todo.user_id = req.user.uid;
        // insert to db with knex
        queries
            .create(todo)
            .then(ids => {
                const id = ids[0];
                res.redirect(`/todo/${id}`);
            });
    });
});

router.put('/:id', authHelpers.loginRequired, (req,res) => {
    validateTodoRenderError(req, res, (todo) => {
        // insert to db with knex
        const id = req.params.id;
        queries
            .update(id, todo)
            .then(() => {
                res.redirect(`/todo/${id}`);
            });
    });
});

router.delete('/:id/delete', authHelpers.loginRequired, (req, res) => {
    const id = req.params.id;
    if (validId(id)) {
        queries
            .delete(id)
            .then(todo =>{
                res.redirect('/todo');
            });
    } else {
        // response with error
        setStatusRenderError(res, 500, 'invalid id');
    }
});

function respondAndRender(id, res, viewName){
    if (validId(id)) {
        queries
            .getOne(id)
            .then(todo =>{
                res.render(viewName, todo);
            });
    } else {
        // response with error
        setStatusRenderError(res, 500, 'invalid id');
    }
}

function validateTodoRenderError(req, res, callback) {
    if (validTodo(req.body)){
        const todo = {
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
        };
        callback(todo);
    } else {
        // response with error
        setStatusRenderError(res, 500, 'invalid todo');
    }
}

module.exports = router;
