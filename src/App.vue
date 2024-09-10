<template>
  <div id="app">
    <h1>Uploader des Images</h1>

    <!-- Input pour "created_by" -->
    <div>
      <label for="created_by">Created By:</label>
      <input
        type="text"
        id="created_by"
        v-model="created_by"
        placeholder="Entrez le nom du créateur"
      />
    </div>

    <!-- Input pour uploader des fichiers -->
    <div>
      <label for="images">Sélectionner une ou plusieurs images:</label>
      <input
        type="file"
        id="images"
        multiple
        @change="onFileChange"
        accept="image/*"
      />
    </div>

    <!-- Bouton pour envoyer les images -->
    <button @click="uploadImages">Envoyer les Images</button>

    <!-- Message de confirmation -->
    <div v-if="uploadMessage">
      <p>{{ uploadMessage }}</p>
    </div>

    <h1>Liste des Images</h1>

    <!-- Bouton pour récupérer les images -->
    <button @click="fetchImages">Get Images</button>

    <!-- Tableau pour afficher les images -->
    <table v-if="images.length > 0" border="1">
      <thead>
        <tr>
          <th>Filename</th>
          <th>Gems</th>
          <th>Created By</th>
          <th>Created At</th>
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
    <p v-else>No images found.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      created_by: "", // Stocker la valeur de l'input texte
      selectedImages: [], // Stocker les fichiers sélectionnés
      uploadMessage: "", // Stocker le message de confirmation après upload
      images: [], // Liste des images récupérées
    };
  },
  computed: {
    // Trier les images par nombre de gems
    sortedImages() {
      return [...this.images].sort((a, b) => a.gem - b.gem);
    },
  },
  methods: {
    // Fonction pour gérer les fichiers sélectionnés
    onFileChange(event) {
      this.selectedImages = event.target.files; // Stocker les fichiers sélectionnés dans selectedImages
    },
    // Fonction pour uploader les images
    async uploadImages() {
      if (this.selectedImages.length === 0) {
        this.uploadMessage = "Veuillez sélectionner au moins une image.";
        return;
      }

      const formData = new FormData();

      // Ajouter les fichiers au FormData
      for (let i = 0; i < this.selectedImages.length; i++) {
        formData.append("images", this.selectedImages[i]);
      }

      // Ajouter le "created_by" au FormData
      formData.append("created_by", this.created_by);

      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          this.uploadMessage = "Images uploadées avec succès !";
          // Réinitialiser les fichiers sélectionnés
          this.selectedImages = [];
          document.getElementById("images").value = ""; // Réinitialiser l'input file
        } else {
          this.uploadMessage = "Erreur lors de l'upload des images.";
        }
      } catch (error) {
        this.uploadMessage = "Une erreur s'est produite.";
      }
    },

    // Fonction pour récupérer les images depuis le backend
    async fetchImages() {
      try {
        const response = await fetch("http://localhost:5000/images");
        const data = await response.json();
        this.images = data;
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },
  },
};
</script>

<style>
#app {
  text-align: center;
  margin-top: 50px;
}

input[type="file"] {
  margin-top: 20px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
