<template>
  <div id="app">
    <div>
      <div>
        <h1 class="postQuery">AskAnon</h1>
        <input v-model="newQuery" type="text" placeholder="Type the query..." />
        <button class="QPbutton" @click="postQuery()">Post Query</button>
      </div>

      <div>
        <Question
          v-for="(question, i) in questions"
          v-bind:key="i + question + question.myid"
          v-bind:question.sync="question"
        >Q: {{ question.question }}</Question>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
const url = window.location.href.slice(0, -1);
import Question from "./components/Question.vue";

function makeid (length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default {
  name: "App",
  data: function () {
    return {
      questions: [],
      newQuery: "",
      newID: "",
    };
  },
  methods: {
    getAllQueries: function () {
      console.log("Getting all queries");
      axios
        .get(url + ":3000/query/get")
        .then((response) => {
          console.log(response.data);
          this.questions = [];
          this.questions = response.data;
          console.log(this.questions);
        })
        .catch((err) => {
          console.log("Error:", err);
        });
    },
    postQuery: function () {
      if (this.newQuery === "") {
        return;
      }
      this.newID = makeid(10);
      this.questions.push({
        question: this.newQuery,
        myid: this.newID,
        answers: [],
      });

      axios
        .post(url + ":3000/query/add", {
          question: this.newQuery,
          myid: this.newID,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((err) => {
          console.log("Error:", err);
        });
      this.newQuery = "";
    },
  },
  created () {
    this.getAllQueries();
  },
  components: {
    Question,
  },
};
</script>

<style>
.QPbutton {
  background-color: rgb(151, 49, 49);
  border: none;
  color: white;
  padding: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 3px;
  width: 150px;
}
input[type="text"] {
  width: 70%;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
  background-position: 10px 10px;
  background-repeat: no-repeat;
  padding: 5px 8px 5px 20px;
}
</style>
