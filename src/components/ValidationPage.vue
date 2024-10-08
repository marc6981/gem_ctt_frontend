<template>
  <div class="validation-page">
    <h1>Valider une Image</h1>

    <!-- Sélectionner une image à valider par ID -->
    <div class="form-group">
      <label for="image_id">Entrez l'ID de l'image:</label>
      <input
        type="text"
        v-model="imageId"
        placeholder="Image ID"
        class="input-field"
      />
      <button @click="fetchImageById" :disabled="loading" class="btn primary">
        Rechercher par ID
      </button>
      <button
        @click="fetchRandomImageToValidate"
        :disabled="loading"
        class="btn secondary"
      >
        Obtenir une image à valider
      </button>
    </div>

    <!-- Afficher l'image et les détails -->
    <div v-if="image" class="image-details">
      <h3>Détails de l'image</h3>
      <p><strong>Filename:</strong> {{ image.filename }}</p>
      <p><strong>Gems:</strong> {{ image.gem }}</p>
      <p><strong>Created By:</strong> {{ image.created_by || "N/A" }}</p>
      <p>
        <strong>Created At:</strong>
        {{ new Date(image.created_at).toLocaleString() }}
      </p>

      <!-- Input pour modifier le nombre de gems -->
      <div class="form-group">
        <label for="gems">Modifier le nombre de gems:</label>
        <input
          type="number"
          v-model="newGemCount"
          placeholder="Entrez un nouveau nombre de gems"
          :disabled="loading"
          class="input-field"
        />
        <button @click="updateGems" :disabled="loading" class="btn primary">
          Mettre à jour les gems
        </button>
      </div>

      <!-- Bouton pour valider l'image -->
      <div>
        <button @click="validateImage" :disabled="loading" class="btn primary">
          Valider l'image
        </button>
      </div>

      <!-- Afficher l'image en base64 si présente -->
      <div v-if="image.imageBase64">
        <h3>Image:</h3>
        <img
          :src="'data:image/jpeg;base64,' + image.imageBase64"
          alt="Image"
          class="responsive-image"
        />
      </div>
    </div>

    <p v-else>Pas d'image trouvée.</p>

    <!-- Indicateur de chargement -->
    <div v-if="loading" class="loading-indicator">
      <p>Chargement d'une nouvelle image...</p>
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      imageId: this.$route.params.id || "", // ID de l'image à rechercher (initialisé depuis l'URL si présent)
      image: null, // Détails de l'image récupérée
      newGemCount: 0, // Nouveau nombre de gems à mettre à jour
      loading: false, // Indicateur de chargement
    };
  },
  methods: {
    // Fonction pour récupérer une image par ID
    async fetchImageById() {
      if (!this.imageId) {
        return;
      }

      this.loading = true;
      try {
        const response = await api.get(`/images/${this.imageId}`, {
          params: { includeImageBase64: true },
        });
        this.image = response.data;
        this.newGemCount = this.image.gem;
      } catch (error) {
        console.error("Erreur lors de la récupération de l'image :", error);
        this.image = null;
        alert("Image non trouvée.");
      } finally {
        this.loading = false;
      }
    },

    async fetchRandomImageToValidate() {
      this.loading = true;
      try {
        const response = await api.get("/images/validate", {
          params: { includeImageBase64: true },
        });
        this.image = response.data;
        this.newGemCount = this.image.gem;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'image à valider :",
          error
        );
        this.image = null;
      } finally {
        this.loading = false;
      }
    },

    async updateGems() {
      if (!this.newGemCount || this.newGemCount < 0) {
        return;
      }

      this.loading = true;
      try {
        await api.post(`/images/${this.image._id}/update`, {
          gem: this.newGemCount,
        });
        // Rafraîchir les informations de l'image
        await this.fetchImageById();
      } catch (error) {
        console.error("Erreur lors de la mise à jour des gems :", error);
      } finally {
        this.loading = false;
      }
    },

    async validateImage() {
      this.loading = true;
      try {
        await api.post(`/images/${this.image._id}/validate`);
        // Obtenir une nouvelle image à valider
        await this.fetchRandomImageToValidate();
      } catch (error) {
        console.error("Erreur lors de la validation de l'image :", error);
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    // Si un ID est présent dans l'URL, récupérer automatiquement l'image
    if (this.imageId) {
      this.fetchImageById();
    }
  },
};
</script>

<style scoped>
/* Mise en page de la page de validation */
.validation-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

/* Style des boutons */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.btn.primary {
  background-color: #42b983;
  color: white;
}

.btn.primary:hover {
  background-color: #36a471;
}

.btn.secondary {
  background-color: #5bc0de;
  color: white;
}

.btn.secondary:hover {
  background-color: #4ca9c0;
}

.input-field {
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.image-details {
  margin-top: 20px;
}

/* Style de l'indicateur de chargement */
.loading-indicator {
  margin-top: 20px;
  text-align: center;
  font-weight: bold;
  color: #42b983;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #42b983;
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Rendre l'image responsive */
.responsive-image {
  max-width: 100%;
  max-height: 80vh;
  display: block;
  margin: 10px auto;
}
</style>
