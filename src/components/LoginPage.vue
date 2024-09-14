<!-- components/LoginPage.vue -->

<template>
  <div class="login-page">
    <h1>Connexion</h1>
    <div class="form-group">
      <label for="username">Nom d'utilisateur :</label>
      <input
        type="text"
        v-model="username"
        placeholder="Entrez votre nom d'utilisateur"
        class="input-field"
      />
    </div>
    <div class="form-group">
      <label for="password">Mot de passe :</label>
      <input
        type="password"
        v-model="password"
        placeholder="Entrez votre mot de passe"
        class="input-field"
      />
    </div>
    <button @click="login" :disabled="loading" class="btn primary">
      Se connecter
    </button>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import api from "../api";

export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      if (!this.username || !this.password) {
        this.errorMessage = "Veuillez remplir tous les champs.";
        return;
      }

      this.loading = true;
      this.errorMessage = "";
      try {
        const response = await api.post("/users/login", {
          username: this.username,
          password: this.password,
        });

        // Stocker le token dans le localStorage
        localStorage.setItem("token", response.data.token);

        // Rediriger vers la page d'accueil
        this.$router.push("/");
      } catch (error) {
        if (error.response) {
          this.errorMessage =
            error.response.data.message || "Erreur lors de la connexion.";
        } else {
          this.errorMessage = "Une erreur s'est produite.";
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  box-sizing: border-box;
}

.btn {
  padding: 10px 20px;
  cursor: pointer;
}

.btn.primary {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
