<template>
    <div>
      <!-- Classification Table -->
      <el-row>
        <el-col :span="24">
          <el-table :data="classifications" style="width: 100%">
            <el-table-column prop="name" label="إسم التصنيف"></el-table-column>
  
            <el-table-column label="العمليات">
              <template v-slot="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="openUpdateDialog(scope.row)"
                >تعديل</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteClassification(scope.row.id)"
                >الحذف</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
  
      <!-- Add New Classification Button -->
      <el-button
        type="success"
        icon="el-icon-plus"
        @click="openAddDialog"
        style="margin-top: 20px"
      >
        اضافة تصنيف جديد
      </el-button>
  
      <!-- Add Classification Dialog -->
      <el-dialog v-model="addDialogVisible" title="Add Classification">
        <el-form :model="newClassification" label-width="120px">
          <el-form-item label="Name">
            <el-input v-model="newClassification.name"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="storeClassification">Submit</el-button>
        </template>
      </el-dialog>
  
      <!-- Update Classification Dialog -->
      <el-dialog v-model="updateDialogVisible" title="Update Classification">
        <el-form :model="selectedClassification" label-width="120px">
          <el-form-item label="Name">
            <el-input v-model="selectedClassification.name"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="updateDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="updateClassification">Update</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import axios from '@/axios';
  
  export default {
    data() {
      return {
        classifications: [],
        addDialogVisible: false,
        updateDialogVisible: false,
        newClassification: {
          name: '',
        },
        selectedClassification: {
          id: null,
          name: '',
        },
      };
    },
    methods: {
      // Fetch classifications
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
  
      // Open add classification dialog
      openAddDialog() {
        this.newClassification.name = '';
        this.addDialogVisible = true;
      },
  
      // Store classification
      storeClassification() {
        axios
          .post('/classifications', this.newClassification)
          .then((response) => {
            this.classifications.push(response.data.data);
            this.addDialogVisible = false;
          })
          .catch((error) => {
            console.error('Error adding classification:', error);
          });
      },
  
      // Open update classification dialog
      openUpdateDialog(classification) {
        this.selectedClassification = { ...classification };
        this.updateDialogVisible = true;
      },
  
      // Update classification
      updateClassification() {
        axios
          .put(`/classifications/${this.selectedClassification.id}`, this.selectedClassification)
          .then((response) => {
            const index = this.classifications.findIndex((c) => c.id === this.selectedClassification.id);
            if (index !== -1) {
              this.$set(this.classifications, index, response.data.data);
            }
            this.updateDialogVisible = false;
          })
          .catch((error) => {
            console.error('Error updating classification:', error);
          });
      },
  
      // Delete classification
      deleteClassification(id) {
        axios
          .delete(`/classifications/${id}`)
          .then(() => {
            this.classifications = this.classifications.filter((c) => c.id !== id);
          })
          .catch((error) => {
            console.error('Error deleting classification:', error);
          });
      },
    },
    created() {
      this.fetchClassifications(); // Fetch classifications when the component is created
    },
  };
  </script>
  
  <style scoped>
  /* Add any necessary styles here */
  </style>
  