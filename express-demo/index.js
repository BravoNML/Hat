const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/static'));
const MongoClient    = require('mongodb').MongoClient;

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile('./start.html', {root: __dirname });
});

app.get('/api/add', (req, res) => {
    res.sendFile('./add.html', {root: __dirname });
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("The course with the given ID wasn't found");

    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
        
    course.name = req.body.name;
    res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("The course with the given ID wasn't found");
    res.send(course);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

// function validateCourse(course){
//     const schema = {
//         name: Joi.string().min(3).required()
//     };
//     return Joi.validate(course, schema);
// };


function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required(),
        difficulty: Joi.string().valid('простое', 'сложное', 'очень сложное').required()
    };
    return Joi.validate(course, schema);
};

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("The course with the given ID wasn't found");

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course)
});
