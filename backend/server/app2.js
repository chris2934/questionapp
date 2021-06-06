const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')

let queriesModel = require('./queries_schema2')

mongoose.connect("mongodb://localhost:27017/queriesapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('open', () => {
  console.log('Connected to mongoDB');
});

// db.dropDatabase();

db.on('error', (error) => {
  console.log(error);
  console.log('Error!')
})

mongoose.set('useFindAndModify', false);

const bodyParser = require('body-parser');
const {
  default: Axios
} = require('axios');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(cors());

app.get('/', (req, res) => {
  res.send("Backend for queries app is working!");
});

//creating a query
app.post('/query/add', (req, res) => {
  console.log(req.body);
  let newQuery = new queriesModel;
  newQuery.question = req.body.question;
  newQuery.myid = req.body.myid;
  newQuery.answers = [];

  newQuery.save((err) => {
    if (err) {
      res.send("Error while adding Query");
      console.log("Error occured while adding query")
    } else {
      res.send("Query added");
      console.log('Query added!');
    }
  })
});


// getQuestions
app.get("/query/get", (req, res) => {
  console.log('Sending all questions')
  queriesModel.find({
    question: {
      $exists: true
    }
  }, (err, questions) => {
    if (err) {
      res.send("Error while fetching Questions:", err);
    } else {
      res.json(questions);
      console.log('Sent questions:', questions)
    }
  });
});


// add answer
app.post("/query/answer/:id", (req, res) => {
  console.log(req);
  queriesModel.findOneAndUpdate({
      myid: req.params.id
    }, {
      $push: {
        "answers": req.body.answer
      }
    },
    (err, _) => {
      if (err) {
        console.log("Error while adding answer:", err);
      } else {
        res.send('Answer Added');
        console.log('Answer added!', req.body.answer);
      }
    }
  );
});

//Adding some dummy question answers
function addDummyQuestions(question, id, answersList) {
  let newQuery = new queriesModel;
  newQuery.question = question;
  newQuery.myid = id;
  newQuery.answers = answersList;

  newQuery.save((err) => {
    if (err) {
      console.log("Error occured while adding query")
    } else {
      console.log('Query added!');
    }
  })
}
addDummyQuestions('Is Educative Awesome?', 'sdjits23bs', ['Yes it is', 'Of course!'])
addDummyQuestions('How to learn Vue.js?', 'a3jibs23hs', ['Take the course from Educative', 'Educative is a good platform to learn Vue.js'])
addDummyQuestions('How to increase productivity?', 'G3sibt19hg', ['Take small breaks while working'])

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
