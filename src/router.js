import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./components/HomePage.vue";
import ValidationPage from "./components/ValidationPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/validation",
    name: "Validation",
    component: ValidationPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
