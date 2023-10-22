if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const methodOverride = require('method-override');

const mongoose = require('mongoose');

const Todo = require('./models/todo');

const app = express();

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/todo-list';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection open!");
    })
    .catch(error => {
        console.log("Error!");
        console.log(error);
    })

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}))

app.use(methodOverride('_method'));

app.get('/', async(req, res) => {
    const todos = await Todo.find({});
    res.render('index', {todos});
});

app.get('/:id/edit', async(req, res) => {
    const todo = await Todo.findById(req.params.id); 
    if (todo) {
        res.render('edit', {todo});
    } else {
        res.render('undefined');
    }
});

app.post('/', async(req, res) => {
    const content = req.body.content;
    const todo = new Todo(req.body);
    await todo.save();
    res.redirect('/');
});

app.patch('/:id', async(req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndUpdate(id, { ...req.body });
    res.redirect('/');
});

app.delete('/:id', async(req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.redirect('/');
});

app.all('*', (req, res) => {
    res.render('undefined');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('todo app live!! baby');
})
