<template>
    <div>
      <!-- Status Filter Dropdown -->
      <el-select v-model="statusFilter" placeholder="Filter by status" @change="fetchReports">
        <el-option label="All" value=""></el-option>
        <el-option label="Pending" value="pending"></el-option>
        <el-option label="Refused" value="refused"></el-option>
        <el-option label="Answered" value="answered"></el-option>
      </el-select>
  
      <!-- Reports Table -->
      <el-table :data="reports" style="width: 100%">
        <el-table-column prop="id" label="رقم البلاغ" width="100"></el-table-column>
        <el-table-column prop="category.name" label="الفئـة"></el-table-column>
        <el-table-column prop="classification.name" label="التصنيـف"  width="100"></el-table-column>
        <el-table-column prop="content_report" width="150" label="محتوى البلاغ"></el-table-column>
        <el-table-column prop="status" label="حالة البلاغ" width="150"></el-table-column>
        <el-table-column label="وقت البلاغ" width="150">
          <template #default="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>
        
  
        <!-- Actions Column -->
        <el-table-column label="Actions" width="580">
          <template #default="scope">
            <el-button @click="showLocation(scope.row.latitude, scope.row.longitude)">
              عرض الموقع
            </el-button>
            <el-button @click="showPhoto(scope.row.photo)">
              عرض الصورة
            </el-button>
            <el-button @click="showFiles(scope.row.attached_files)">
              عرض الملفات المرفقة
            </el-button>
  
            <!-- Reply Button -->
            <el-button @click="openReplyDialog(scope.row)">
              Reply
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- Pagination Controls -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      ></el-pagination>
  
      <!-- Photo Dialog -->
      <el-dialog v-model="photoDialogVisible" title="Photo">
        <img :src="selectedPhoto" alt="Report Photo" style="width: 100%;" />
      </el-dialog>
  
      <!-- Files Dialog -->
      <el-dialog v-model="filesDialogVisible" title="Attached Files">
        <ul>
          <li v-for="file in selectedFiles" :key="file">
            <a :href="getFileUrl(file)" target="_blank">{{ file }}</a>
          </li>
        </ul>
      </el-dialog>
  
      <!-- Map Dialog -->
      <el-dialog v-model="locationDialogVisible" title="موقع البلاغ">
        <div id="map" style="height: 400px;"></div>
      </el-dialog>
  
      <!-- Reply Dialog -->
      <el-dialog v-model="replyDialogVisible" title="Reply to Report">
        <el-form :model="replyForm">
          <!-- Status Select -->
          <el-form-item label="Status">
            <el-select v-model="replyForm.status" placeholder="Select status">
              <el-option label="Pending" value="pending"></el-option>
              <el-option label="Refused" value="refused"></el-option>
              <el-option label="Answered" value="answered"></el-option>
            </el-select>
          </el-form-item>
      
          <!-- Reply Textarea -->
          <el-form-item label="Super User Reply">
            <el-input type="textarea" v-model="replyForm.super_user_reply" placeholder="Enter your reply"></el-input>
          </el-form-item>
        </el-form>
      
        <!-- Submit and Cancel Buttons -->
        <template #footer>
          <el-button @click="replyDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitReply">Submit</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import axios from "../../axios";
  import L from "leaflet"; // Import leaflet for the map
  
  export default {
    data() {
      return {
        reports: [],
        statusFilter: '',
        photoDialogVisible: false,
        replyDialogVisible: false,
        filesDialogVisible: false,
        locationDialogVisible: false,
        selectedReportId: null,
        replyForm: {
          status: "",
          super_user_reply: ""
        },
        selectedPhoto: null,
        selectedFiles: [],
        map: null,
        pagination: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
        },
        backendUrl: "https://sos.mohimen.ly", // Set your backend URL
      };
    },
    methods: {
      formatDate(date) {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      return new Date(date).toLocaleDateString('en-GB', options).replace(',', '');
    },
      fetchReports() {
        const params = {
          page: this.pagination.currentPage,
          status: this.statusFilter || undefined,
        };
  
        axios
          .get("reports", { params })
          .then((response) => {
            this.reports = response.data.data;
            this.pagination.total = response.data.total;
          })
          .catch((error) => {
            console.error("Error fetching reports", error);
          });
      },
      handleSizeChange(size) {
        this.pagination.pageSize = size;
        this.fetchReports();
      },
      handleCurrentChange(page) {
        this.pagination.currentPage = page;
        this.fetchReports();
      },
      // Show the report photo
      showPhoto(photo) {
        this.selectedPhoto = `${this.backendUrl}/storage/${photo}`; // Ensure URL points to public storage
        this.photoDialogVisible = true;
      },
      // Show the attached files
      showFiles(files) {
        this.selectedFiles = JSON.parse(files); // Parse JSON string of files
        this.filesDialogVisible = true;
      },
      // Get the URL of the file
      getFileUrl(file) {
        return `${this.backendUrl}/storage/${file}`; // Use backend URL
      },
      // Show the location on the map using OpenStreetMap
      showLocation(lat, lng) {
        this.locationDialogVisible = true;
  
        // Initialize the map only if it's not already initialized
        this.$nextTick(() => {
          if (this.map) {
            this.map.setView([lat, lng], 13); // Update map location if it already exists
          } else {
            this.map = L.map("map").setView([lat, lng], 13);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: '© OpenStreetMap contributors',
            }).addTo(this.map);
  
            // Add a marker for the location
            L.marker([lat, lng]).addTo(this.map);
          }
        });
      },
      // Open Reply Dialog and Set Selected Report
      openReplyDialog(report) {
        this.selectedReportId = report.id;
        this.replyForm.status = report.status;
        this.replyForm.super_user_reply = report.super_user_reply || "";
        this.replyDialogVisible = true;
      },
      submitReply() {
        const { status, super_user_reply } = this.replyForm;
  
        axios
          .post(`reports/${this.selectedReportId}/reply`, {
            status,
            super_user_reply
          })
          .then(() => {
            this.replyDialogVisible = false;
            this.fetchReports();
          })
          .catch((error) => {
            console.error("Error submitting reply", error);
          });
      }
    },
    mounted() {
      this.fetchReports();
    },
  };
  </script>
  