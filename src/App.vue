<template>
  <div class="wrapper">
    <div class="tags">
      <Categories
        v-for="item in valuesAndNames"
        :key="item.value"
        :data="item"
        @select="select(item)"
      />
    </div>
    <div class="difficulty">
      <span
        @click="selectDifficulty(item)"
        v-for="item in difficultyTabs"
        :key="item.value"
        >{{ item.name }}</span
      >
    </div>
    <h2 style="text-align: center; margin-top: 50px">{{ selectedDiff }}</h2>
    <h2 style="text-align: center; margin-top: 50px">{{ categoryTitle }}</h2>
    <div
      class="question-contents"
      v-if="isLoaded && selectedID && selectedDiff"
    >
      <p class="question">
        {{ replaceEncodedChars(data[0]?.question) }}
      </p>
      <div class="options-container">
        <button
          :disabled="isDisabled"
          @click="chooseAnswer(data, item, index)"
          type="button"
          v-for="(item, index) in answers"
          :key="index"
          :style="{
            backgroundColor:
              clickedButtonIndex === index
                ? rightAnswer
                  ? '#1eff00'
                  : '#f03559'
                : rightAnswer == false &&
                  clickedButtonIndex !== null &&
                  data[0].correct_answer == item
                ? '#1eff00'
                : '#4aaaac',
          }"
        >
          {{ replaceEncodedChars(item) }}
        </button>
      </div>
      <button @click="() => getData()" class="next-btn">Next</button>
    </div>
    <Loader v-if="!isLoaded" />
  </div>
</template>

<script setup>
import Loader from "@/components/Loader.vue";
import Categories from "./components/Categories.vue";
import { computed, onMounted, ref } from "vue";
import { valuesAndNames } from "./components/categoriesData";
import axios from "axios";

const isLoaded = ref(true);
const isDisabled = ref(false);
const selectedID = ref(null);
const categoryTitle = ref("");
const selectedDiff = ref("");
const selectedDiffValue = ref("");

const difficultyTabs = ref([
  { name: "Eazy", value: "easy" },
  { name: "Medium", value: "medium" },
  { name: "Hard", value: "hard" },
]);

const data = ref([]);

const getData = (id, difficulty) => {
  isLoaded.value = false;
  axios
    .get("https://opentdb.com/api.php", {
      params: {
        amount: 1, // Number of questions you want to fetch
        type: "multiple", // Type of questions (multiple choice, true/false, etc.)
        category: id, // Category ID (You can change this to select a different category)
        difficulty: difficulty, // Difficulty level (easy, medium, hard)
        encode: "url3986", // URL-encode the questions
        apiKey: "YOUR_API_KEY", // Replace with your API key
      },
    })
    .then((resp) => {
      data.value = resp.data.results;
      clickedButtonIndex.value = null;
      isDisabled.value = false;
      isLoaded.value = true;
    });
};

const select = (item) => {
  selectedID.value = item.value;
  categoryTitle.value = item.name;
};

const selectDifficulty = (val) => {
  selectedDiff.value = val.name;
  selectedDiffValue.value = val.value;
  getData(selectedID.value, selectedDiffValue.value);
};

const rightAnswer = ref(null);
const clickedButtonIndex = ref(null); // Track the clicked button index

const replaceEncodedChars = (val) => {
  return decodeURIComponent(val);
};

const chooseAnswer = (data, val, index) => {
  if (val == data[0].correct_answer) {
    rightAnswer.value = true;
  } else {
    rightAnswer.value = false;
  }
  isDisabled.value = true;
  clickedButtonIndex.value = index; // Set the clicked button index
};

const answers = computed(() => {
  if (data.value.length > 0) {
    let correctAnswer = data.value[0]?.correct_answer;
    let answersArray = data.value[0]?.incorrect_answers.slice();
    answersArray.push(correctAnswer);
    for (let i = answersArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answersArray[i], answersArray[j]] = [answersArray[j], answersArray[i]];
    }
    return answersArray;
  }
});
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .tags {
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
    gap: 12px;
    margin: 50px;
    flex-wrap: wrap;
  }
  .difficulty {
    display: flex;
    span {
      margin-left: 50px;
      padding: 2px 4px;
      border-radius: 2px;
      cursor: pointer;
      background-color: rgba(19, 135, 97, 0.2);
    }
  }
  .question-container {
    margin: 0 auto;
    max-width: 1200px;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .question-contents {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    padding: 30px 0 40px 0;
    width: 60%;
    margin: 70px auto;
    border-radius: 15px;
    color: #090909;
    box-shadow: 10px 10px 42px 0px rgba(0, 0, 0, 0.2);
    text-align: center;

    .question {
      font-size: 18px;
      font-weight: 600;
      text-align: center;
      line-height: 1.4;
      margin-bottom: 15px;
      padding: 0 20px;
    }
    .options-container {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: flex-start;
      button {
        box-shadow: 0.03rem 0.06rem 0.1rem #090909;
        cursor: pointer;
        color: #fff;
        font-size: 18px;
        width: 70%;
        font-weight: 600;
        padding: 13px;
        margin: 13px auto 0 auto;
        border-radius: 5px;
        border: none;
        text-align: center;
        outline: none;
        &:hover {
          background-color: #25c4c7;
        }
      }
    }
    .next-btn {
      align-items: center;
      background-image: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
      border: 0;
      border-radius: 8px;
      box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
      box-sizing: border-box;
      color: #ffffff;
      font-size: 16px;
      justify-content: center;
      line-height: 1em;
      padding: 14px 44px;
      text-decoration: none;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      white-space: nowrap;
      cursor: pointer;
      margin-top: 30px;
    }

    .button-63:active,
    .button-63:hover {
      outline: 0;
    }
  }
}
</style>
./components/categories
