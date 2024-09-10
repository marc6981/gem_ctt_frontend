<template>
  <div class="upload-page">
    <h1>Uploader des Images</h1>

    <div class="form-group">
      <label for="created_by">Created By:</label>
      <input
        type="text"
        id="created_by"
        v-model="created_by"
        placeholder="Entrez le nom du créateur"
        class="input-field"
      />
    </div>

    <div class="form-group">
      <label for="images">Sélectionner une ou plusieurs images:</label>
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

    <button @click="fetchImages" class="btn secondary">Get Images</button>

    <table v-if="images.length > 0" class="styled-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Filename</th>
          <th>Gems</th>
          <th>Created By</th>
          <th>Created At</th>
          <th>Validé</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="image in sortedImages" :key="image._id">
          <td>{{ image._id }}</td>
          <td>{{ image.filename }}</td>
          <td>{{ image.gem }}</td>
          <td>{{ image.created_by || "N/A" }}</td>
          <td>{{ new Date(image.created_at).toLocaleString() }}</td>
          <td>
            <!-- Vérifier si l'image est validée -->
            <span v-if="image.validation">Oui</span>
            <span v-else>Non</span>
          </td>
          <td>
            <!-- Bouton pour rediriger vers la page de validation de l'image -->
            <button @click="goToValidation(image._id)" class="btn primary">
              Valider
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No images found.</p>
  </div>
</template>

<script>
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

      formData.append("created_by", this.created_by);

      try {
        const response = await fetch("http://localhost:5016/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          this.uploadMessage = "Images uploadées avec succès !";
        } else {
          this.uploadMessage = "Erreur lors de l'upload des images.";
        }
      } catch (error) {
        this.uploadMessage = "Une erreur s'est produite.";
      }
    },
    async fetchImages() {
      try {
        const response = await fetch("http://localhost:5016/images");
        const data = await response.json();
        this.images = data;
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },
    goToValidation(imageId) {
      // Redirection vers la route de validation avec l'ID de l'image
      this.$router.push(`/validation/${imageId}`);
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
