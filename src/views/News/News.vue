<template>
    <div>
      <el-form :model="newsForm" ref="newsForm" label-width="120px" @submit.prevent="submitForm">
        <el-form-item label="Title" prop="title">
          <el-input v-model="newsForm.title" placeholder="Enter news title"></el-input>
        </el-form-item>
  
        <el-form-item label="Content" prop="content_text">
          <el-input v-model="newsForm.content_text" type="textarea" placeholder="Enter news content"></el-input>
        </el-form-item>
  
        <el-form-item label="Cover Image" prop="cover_image">
          <el-upload
            action=""
            :on-change="handleCoverImageChange"
            :show-file-list="false"
            accept="image/*"
            list-type="picture">
            <el-button size="small" type="primary">Upload Cover Image</el-button>
          </el-upload>
        </el-form-item>
  
        <el-form-item label="Gallery Images">
          <el-upload
            action=""
            :on-change="handleGalleryImagesChange"
            :multiple="true"
            :show-file-list="false"
            accept="image/*"
            list-type="picture">
            <el-button size="small" type="primary">Upload Gallery Images</el-button>
          </el-upload>
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="submitForm">Submit</el-button>
        </el-form-item>
      </el-form>
  
      <!-- News List -->
      <el-table :data="newsList" style="width: 100%">
        <el-table-column prop="title" label="Title"></el-table-column>
        <el-table-column prop="created_at" label="Created At"></el-table-column>
        <el-table-column label="Actions">
          <template #default="scope">
            <el-button size="mini" @click="editNews(scope.row)">Edit</el-button>
            <el-button size="mini" type="danger" @click="deleteNews(scope.row.id)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script>
  import axiosInstance from '../../axios'; // Import the customized axios instance
  
  export default {
    data() {
      return {
        newsForm: {
          title: '',
          content_text: '',
          cover_image: null,
          gallery_images: [],
        },
        newsList: [],
      };
    },
    methods: {
      // Handle cover image change
      handleCoverImageChange(file) {
        this.newsForm.cover_image = file.raw;
      },
  
      // Handle gallery images change
      handleGalleryImagesChange(file) {
        this.newsForm.gallery_images.push(file.raw);
      },
  
      // Submit form to create or update news
      async submitForm() {
        const formData = new FormData();
        formData.append('title', this.newsForm.title);
        formData.append('content_text', this.newsForm.content_text);
  
        if (this.newsForm.cover_image) {
          formData.append('cover_image', this.newsForm.cover_image);
        }
  
        this.newsForm.gallery_images.forEach((image, index) => {
          formData.append(`gallery_images[${index}]`, image);
        });
  
        try {
          const response = await axiosInstance.post('/news', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log(response.data);
          this.fetchNews(); // Fetch news after creation
          this.$message.success('News created successfully!');
        } catch (error) {
          console.error(error);
          this.$message.error('Failed to create news');
        }
      },
  
      // Fetch news list
      async fetchNews() {
        try {
          const response = await axiosInstance.get('/news');
          this.newsList = response.data.data; // Assuming it's paginated
        } catch (error) {
          console.error(error);
        }
      },
  
      // Edit news
      editNews(news) {
        this.newsForm.title = news.title;
        this.newsForm.content_text = news.content_text;
        this.newsForm.id = news.id;
      },
  
      // Delete news
      async deleteNews(newsId) {
        try {
          await axiosInstance.delete(`/news/${newsId}`);
          this.fetchNews(); // Refresh list after deletion
          this.$message.success('News deleted successfully!');
        } catch (error) {
          console.error(error);
          this.$message.error('Failed to delete news');
        }
      },
    },
    mounted() {
      this.fetchNews(); // Fetch the news list when component is mounted
    },
  };
  </script>
  
  <style scoped>
  /* Add any necessary styling here */
  </style>
  