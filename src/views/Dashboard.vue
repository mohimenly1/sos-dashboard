<template>
  <div class="py-4 container-fluid">
    <div class="row mb-4">
      <div class="col-lg-12 position-relative z-index-2">
        <div class="row">
          <!-- Mini statistics for reports -->
          <div class="col-lg-3 col-md-6 col-sm-6 mt-lg-0 mt-4">
            <mini-statistics-card
              :title="{ text: 'بلاغات معلقة', value: reportStats.pending }"
              :icon="{
                name: 'weekend',
                color: 'text-white',
                background: 'info',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 mt-lg-0 mt-4">
            <mini-statistics-card
              :title="{ text: 'بلاغات مرفوضة', value: reportStats.refused }"
              :icon="{
                name: 'weekend',
                color: 'text-white',
                background: 'info',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 mt-lg-0 mt-4">
            <mini-statistics-card
              :title="{ text: 'بلاغات مقبولة', value: reportStats.answered }"
              :icon="{
                name: 'weekend',
                color: 'text-white',
                background: 'info',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 mt-lg-0 mt-4">
            <mini-statistics-card
              :title="{ text: 'عدد مستخدمين النظام', value: reportStats.userCount }"
              :icon="{
                name: 'weekend',
                color: 'text-white',
                background: 'info',
              }"
            />
          </div>
        </div>

        <!-- Chart for classification statistics -->
        <div class="row mt-4">
          <div class="col-lg-12">
            <canvas id="classificationChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../axios';
import MiniStatisticsCard from './components/MiniStatisticsCard.vue';
import Chart from 'chart.js/auto';

export default {
  name: 'dashboard-default',
  components: {
    MiniStatisticsCard,
  },
  data() {
    return {
      reportStats: {
        pending: 0,
        refused: 0,
        answered: 0,
        userCount: 0,
      },
      classificationData: [],
    };
  },
  methods: {
    fetchReportStatistics() {
      axios.get('/report-statistics').then((response) => {
        this.reportStats = response.data;
      });
    },
    fetchClassificationStatistics() {
      axios.get('/classification-statistics').then((response) => {
        this.classificationData = response.data;
        this.renderClassificationChart();
      });
    },
    renderClassificationChart() {
      const ctx = document.getElementById('classificationChart').getContext('2d');
      const labels = this.classificationData.map(item => item.name);
      const data = this.classificationData.map(item => item.report_count);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Number of Reports',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  },
  mounted() {
    this.fetchReportStatistics();
    this.fetchClassificationStatistics();
  },
};
</script>
