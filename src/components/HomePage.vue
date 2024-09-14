<template>
  <div class="upload-page">
    <h1>Uploader des Images</h1>

    <div class="form-group">
      <label for="images">Sélectionner une ou plusieurs images :</label>
      <input
        type="file"
        id="images"
        multiple
        @change="onFileChange"
        accept="image/*"
        class="input-field"
      />
    </div>

    <button @click="uploadImages" class="btn primary">
      Envoyer les Images
    </button>

    <div v-if="uploadMessage">
      <p>{{ uploadMessage }}</p>
    </div>

    <h1>Liste des Images</h1>

    <button @click="fetchImages" class="btn secondary">
      Rafraîchir la liste
    </button>

    <table v-if="images.length > 0" class="styled-table">
      <thead>
        <tr>
          <th>Nom du Fichier</th>
          <th>Gems</th>
          <th>Créé Par</th>
          <th>Date de Création</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="image in sortedImages" :key="image._id">
          <td>{{ image.filename }}</td>
          <td>{{ image.gem }}</td>
          <td>{{ image.created_by || "N/A" }}</td>
          <td>{{ new Date(image.created_at).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Aucune image trouvée.</p>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      created_by: "",
      selectedImages: [],
      uploadMessage: "",
      images: [],
    };
  },
  computed: {
    sortedImages() {
      return [...this.images].sort((a, b) => a.gem - b.gem);
    },
  },
  methods: {
    onFileChange(event) {
      this.selectedImages = event.target.files;
    },
    async uploadImages() {
      if (this.selectedImages.length === 0) {
        this.uploadMessage = "Veuillez sélectionner au moins une image.";
        return;
      }

      const formData = new FormData();
      for (let i = 0; i < this.selectedImages.length; i++) {
        formData.append("images", this.selectedImages[i]);
      }

      try {
        const response = await api.post("/images/upload", formData);
        if (response.status === 201) {
          this.uploadMessage = "Images uploadées avec succès !";
          this.selectedImages = [];
          this.fetchImages(); // Rafraîchir la liste des images
        } else {
          this.uploadMessage =
            response.data.error || "Erreur lors de l'upload des images.";
        }
      } catch (error) {
        this.uploadMessage = "Une erreur s'est produite.";
        console.error(error);
      }
    },

    async fetchImages() {
      try {
        const response = await api.get("/images");
        this.images = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des images :", error);
      }
    },
  },
};
</script>

<style scoped>
.upload-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.input-field {
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  max-width: 400px;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 18px;
  text-align: left;
}

.styled-table th,
.styled-table td {
  padding: 12px 15px;
}

.styled-table th {
  background-color: #42b983;
  color: white;
}

.styled-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

/* Boutons */
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
</style>
