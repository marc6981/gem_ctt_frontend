<!-- App.vue -->

<template>
  <div id="app">
    <nav>
      <router-link to="/">Accueil</router-link>
      <router-link to="/validation">Validation</router-link>
      <span v-if="!isAuthenticated">
        <router-link to="/login">Se connecter</router-link>
      </span>
      <span v-else>
        <a href="#" @click.prevent="logout">Se déconnecter</a>
      </span>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem("token");
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>

<style>
nav {
  margin-bottom: 20px;
}
nav a {
  margin-right: 10px;
  text-decoration: none;
  color: #42b983;
}
</style>
