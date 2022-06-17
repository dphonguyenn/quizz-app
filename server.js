const path = require('path');
const express = require('express');
const cookieParse = require('cookie-parser');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const Handlebars = require('handlebars');
const port = process.env.PORT || 3000;
const db = require('./src/config/db/index');
const app = express();
const { multipleMongooseToObject, mongooseToObject } = require('./src/Utils/mongoose');
const questions = require('./src/config/db/questions');

// sử dụng method override để thực hiện delete,put,...
app.use(methodOverride('_method'));

// * ket noi voi database
db.connect();

// * set up handlebars
var hbs = handlebars.create({
    extname:'.hbs',
    helpers: {
        sum: (a, b) => a + b,
        ratio: (a, max) => a / max * 100,
        answer: (answers, index) => answers[index],
        checked: (correct, index) => {
            var correct = Handlebars.escapeExpression(correct);
            var index = Handlebars.escapeExpression(index);
            if (correct === index) {
                return "checked";
            }
            return "";
        }
    },
    defaultLayout: 'main',
    layoutsDir: __dirname + '/src/views/layouts'
}); 
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src', 'views'));

// * Thao tac voi cac file tinh
app.use(express.static(path.join(__dirname, 'src/public')));

// * add middleware de nhan du lieu
app.use(
    express.urlencoded({
        extended: true,
    })
);

// * add middleware de doc file json
app.use(express.json());
app.use(cookieParse());

// * dinh tuyen vs cac method

// render trang index
app.get('/', (req, res, next) => {
    questions.find({})
        .then(data => {
            let ques = multipleMongooseToObject(data);
            res.render('index',{questions: ques});
        })
        .catch(err => res.json(err))
})

// render trang add question
app.get('/add', (req, res, next) => {
    res.render('add');
})

// render trang edit question
app.get('/edit/:id', (req, res, next) => {
    questions.findById(req.params.id)
        .then(data => {
            const question = mongooseToObject(data);
            res.render('edit', { question: question });
        })
        .catch(err => res.json(err))
})

// tao api cho questions
app.get('/api-questions', (req, res, next) => {
    questions.find({})
        .then(data => {
            res.json(data);
        })
        .catch(err => { res.json(err);})
})

// add câu hỏi
app.post('/add-question', (req, res, next) => {
    var question = new questions(req.body);
    question.save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {res.json(err);})
})

// xoa cau hoi
app.delete('/question/:id/delete', (req, res, next)=> {
    questions.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect('back');
        })
        .catch(err=>res.json(err))
})

// EDIT cau hoi
app.put('/edit-question/:id', (req, res, next) => {
    questions.updateOne({ _id: req.params.id }, req.body)
        .then(() => res.redirect('/'))
        .catch(err=>res.json(err))
})

// * Access port
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});