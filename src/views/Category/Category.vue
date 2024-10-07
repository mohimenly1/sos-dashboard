<template>
    <div>
      <!-- Select Classification -->
      <el-select v-model="selectedClassification" placeholder="إختر تصنيفاً للإضافة" @change="fetchCategoriesByClassification">
        <el-option
          v-for="classification in classifications"
          :key="classification.id"
          :label="classification.name"
          :value="classification.id"
        ></el-option>
      </el-select>
  
      <!-- Categories Table -->
      <el-row>
        <el-col :span="24">
          <el-table :data="categories" style="width: 100%">
            <el-table-column prop="name" label="إسم الفئة"></el-table-column>
  
            <el-table-column label="إسم التصنيف">
              <template v-slot="scope">
                {{ getClassificationName(scope.row.classification_id) }}
              </template>
            </el-table-column>
  
            <el-table-column label="العمليات">
              <template v-slot="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="openUpdateDialog(scope.row)"
                >Edit</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteCategory(scope.row.id)"
                >Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
  
      <!-- Add New Category Button -->
      <el-button
        type="success"
        icon="el-icon-plus"
        @click="openAddDialog"
        style="margin-top: 20px"
        :disabled="!selectedClassification"
      >
        Add New Category
      </el-button>
  
      <!-- Add Category Dialog -->
      <el-dialog v-model="addDialogVisible" title="Add Category">
        <el-form :model="newCategory" label-width="120px">
          <el-form-item label="Name">
            <el-input v-model="newCategory.name"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="storeCategory">Submit</el-button>
        </template>
      </el-dialog>
  
      <!-- Update Category Dialog -->
      <el-dialog v-model="updateDialogVisible" title="Update Category">
        <el-form :model="selectedCategory" label-width="120px">
          <el-form-item label="Name">
            <el-input v-model="selectedCategory.name"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="updateDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="updateCategory">Update</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import axios from '@/axios';
  
  export default {
    data() {
      return {
        categories: [],
        classifications: [],
        selectedClassification: null,
        addDialogVisible: false,
        updateDialogVisible: false,
        newCategory: {
          name: '',
          classification_id: null,
        },
        selectedCategory: {
          id: null,
          name: '',
          classification_id: null,
        },
      };
    },
    methods: {
      // Fetch categories based on the selected classification
      fetchCategoriesByClassification() {
        axios
          .get(`/categories/classification/${this.selectedClassification}`)
          .then((response) => {
            this.categories = response.data;
          })
          .catch((error) => {
            console.error('Error fetching categories:', error);
          });
      },
  
      // Fetch all classifications to populate the dropdown
      fetchClassifications() {
        axios
          .get('/classifications')
          .then((response) => {
            this.classifications = response.data;
          })
          .catch((error) => {
            console.error('Error fetching classifications:', error);
          });
      },
      fetchCategories() {
        axios
          .get('/categories')
          .then((response) => {
            this.categories = response.data;
          })
          .catch((error) => {
            console.error('Error fetching categories:', error);
          });
      },
  
      // Get classification name by ID
      getClassificationName(classification_id) {
        const classification = this.classifications.find(
          (c) => c.id === classification_id
        );
        return classification ? classification.name : 'N/A';
      },
  
      // Open add category dialog
      openAddDialog() {
        this.newCategory.name = '';
        this.newCategory.classification_id = this.selectedClassification;
        this.addDialogVisible = true;
      },
  
      // Store a new category
      storeCategory() {
        this.newCategory.classification_id = this.selectedClassification;
        axios
          .post('/categories', this.newCategory)
          .then((response) => {
            this.categories.push(response.data.data);
            this.addDialogVisible = false;
          })
          .catch((error) => {
            console.error('Error adding category:', error);
          });
      },
  
      // Open update category dialog
      openUpdateDialog(category) {
        this.selectedCategory = { ...category };
        this.updateDialogVisible = true;
      },
  
      // Update category
      updateCategory() {
        axios
          .put(`/categories/${this.selectedCategory.id}`, this.selectedCategory)
          .then((response) => {
            const index = this.categories.findIndex(
              (c) => c.id === this.selectedCategory.id
            );
            if (index !== -1) {
              this.$set(this.categories, index, response.data.data);
            }
            this.updateDialogVisible = false;
          })
          .catch((error) => {
            console.error('Error updating category:', error);
          });
      },
  
      // Delete a category
      deleteCategory(id) {
        axios
          .delete(`/categories/${id}`)
          .then(() => {
            this.categories = this.categories.filter((c) => c.id !== id);
          })
          .catch((error) => {
            console.error('Error deleting category:', error);
          });
      },
    },
    created() {
      this.fetchClassifications(); // Fetch classifications when component is created
      this.fetchCategories(); // Fetch classifications when component is created
    },
  };
  </script>
  
  <style scoped>
  /* Add any necessary styles */
  </style>
  