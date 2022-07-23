import { createStore } from "vuex";
import axiosClient from "../axios";

const tmpSurveys = [
  {
    id: 100,
    title: "test",
    slug: "test",
    status: "draft",
    image:
      "https://images.unsplash.com/photo-1542395765-761de4ee9696?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80",
    description: "test",
    date_created: "2022-07-20 00:30:00",
    date_last_updated: "2022-07-20 00:30:00",
    expire_date: "2023-07-20 00:30:00",
    questions: [
      {
        id: 1,
        type: "select",
        question: "From which countey are you?",
        description: null,
        data: {
          options: [
            { uuid: "c7f7986d-09c1-4304-8dbf-42ac2482a26b", text: "USA" },
            { uuid: "560c59f0-8397-4bcb-b8ef-039ad5c744d8", text: "India" },
            { uuid: "565a3fd8-251b-443a-968c-57e5cd2c9255", text: "China" },
            { uuid: "33933c99-820d-44ef-8bf0-736854a224fa", text: "Japan" },
          ],
        },
      },
      {
        id: 2,
        type: "checkbox",
        question: "Which langauges do you speak?",
        description: "random stuff",
        data: {
          options: [
            { uuid: "c7813c6d8a-2ca1-49d6-8b0c-c0bdc030f112", text: "English" },
            { uuid: "a54fd4ec-ff6f-48d5-8532-570e661b7c78", text: "Mandrin" },
            { uuid: "7063d902-0a39-4cdc-a2b8-7432adfda12c", text: "Hindi" },
            { uuid: "285994d2-22b3-4d28-b988-99c19d54997e", text: "Japanese" },
          ],
        },
      },
      {
        id: 3,
        type: "checkbox",
        question: "Which programming langauges do you master in?",
        description: "random stuff",
        data: {
          options: [
            {
              uuid: "6def4908-0a24-4c31-b6c0-9dfbdf4c08bb",
              text: "Javascript",
            },
            { uuid: "34d125af-1d1e-4aeb-b8f1-c33200fb8f39", text: "Python" },
            { uuid: "234ae19f-2491-4bd3-85d5-43b703b222d4", text: "Rust" },
            { uuid: "e9a6e690-6741-4686-ac6c-852201e1bc91", text: "Java" },
          ],
        },
      },
      {
        id: 4,
        type: "text",
        question: "Describe your favorite programming paradigm.",
        description: null,
        data: {},
      },
    ],
  },
];

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem("survey_token"),
    },
    currentSurvey: {
      loading: false,
      data: {},
    },
    surveys: [...tmpSurveys],
    questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
  },
  actions: {
    register: ({ commit }, user) => {
      return axiosClient
        .post("/auth/register", user)
        .then(({ data }) => {
          commit("setUser", data);
          return;
        })
        .catch((err) => {
          throw err;
        });
    },
    login: ({ commit }, user) => {
      return axiosClient
        .post("/auth/login", user)
        .then(({ data }) => {
          commit("setUser", data);
          return;
        })
        .catch((err) => {
          throw err;
        });
    },
    logout: ({ commit }) => {
      return axiosClient
        .get("/auth/logout")
        .then(({ data }) => {
          commit("logout", data);
          return;
        })
        .catch((err) => {
          throw err;
        });
    },
    saveSurvey: ({ commit }, survey) => {
      if (survey.id) {
        return axiosClient
          .put("/survey", survey)
          .then((res) => {
            commit("updateSurvey", res.data);
            return res;
          })
          .catch((err) => {
            throw err;
          });
      } else {
        return axiosClient
          .post("/survey", survey)
          .then((res) => {
            commit("saveSurvey", res.data);
            return res;
          })
          .catch((err) => {
            throw err;
          });
      }
    },
    getSurvey: ({ commit }, surveyId) => {
      commit("setCurrentSurveyLoading", true);
      return axiosClient
        .get(`/survey/${surveyId}`)
        .then((res) => {
          commit("setCurrentSurvey", res.data);
          commit("setCurrentSurveyLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentSurveyLoading", false);
          throw err;
        });
    },
  },
  mutations: {
    logout: (state) => {
      state.user.data = {};
      state.user.token = null;
      sessionStorage.removeItem("survey_token");
    },
    setUser: (state, userData) => {
      state.user.token = userData.token;
      state.user.data = userData.user;
      sessionStorage.setItem("survey_token", userData.token);
    },
    saveSurvey: (state, surveyData) => {
      state.surveys = [...state.surveys, surveyData.survey];
    },
    updateSurvey: (state, surveyData) => {
      state.surveys = state.surveys.map((survey) => {
        if (survey.id === surveyData.survey.id) {
          return surveyData.survey;
        }
        return survey;
      });
    },
    setCurrentSurveyLoading: (state, loading) => {
      state.currentSurvey.loading = loading;
    },
    setCurrentSurvey: (state, surveyData) => {
      state.currentSurvey.data = surveyData.survey;
    },
  },
});

export default store;
