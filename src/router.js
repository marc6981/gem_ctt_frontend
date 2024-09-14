import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./components/HomePage.vue";
import ValidationPage from "./components/ValidationPage.vue";
import LoginPage from "./components/LoginPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: { requiresAuth: true }, // Nécessite une authentification
  },
  {
    path: "/validation",
    name: "Validation",
    component: ValidationPage,
    meta: { requiresAuth: true }, // Nécessite une authentification
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Garde de navigation pour protéger les routes nécessitant une authentification
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Rediriger vers la page de connexion si non authentifié
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
