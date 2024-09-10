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
  {
    path: "/validation/:id", // Route dynamique avec un paramètre d'ID
    name: "ValidationWithId",
    component: ValidationPage,
    props: true, // Permet de passer l'ID comme prop au composant
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
