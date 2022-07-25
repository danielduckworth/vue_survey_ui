<template>
  <PageComponent>
    <template v-slot:header>
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Surveys</h1>
        <router-link
          :to="{ name: 'SurveyCreate' }"
          class="p-2 text-white bg-emerald-500 rounded-md hover:bg-emerald-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 -mt-1 inline-block"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add new survey
        </router-link>
      </div>
    </template>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      <SurveysListItem
        v-for="survey in surveys"
        :key="survey.id"
        :survey="survey"
        @delete="deleteSurvey(survey.id)"
      />
    </div>
  </PageComponent>
</template>

<script setup>
import { computed } from "vue";
import PageComponent from "../components/PageComponent.vue";
import store from "../store";
import SurveysListItem from "../components/SurveysListItem.vue";

const surveys = computed(() => store.state.surveys.data);
const loading = computed(() => store.state.surveys.loading);

store.dispatch("getSurveys");

function deleteSurvey(id) {
  if (
    confirm(
      "Are you sure you want to delete survey? Operation can't be undone!!!"
    )
  ) {
    store.dispatch("deleteSurvey", id).then(() => store.dispatch("getSurveys"));
  }
}
</script>
