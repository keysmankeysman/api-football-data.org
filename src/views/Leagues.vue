<template>
  <div class="leagues-page">
    <div class="header">
      <h1>🏆 Футбольные лиги</h1>
      <button @click="logout" class="logout-btn">Выйти</button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка лиг...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>❌ {{ error }}</p>
      <button @click="loadLeagues" class="retry-btn">Повторить</button>
    </div>

    <div v-else class="leagues-grid">
      <div
        v-for="league in leagues"
        :key="league.id"
        class="league-card"
        @click="goToLeague(league.id)"
      >
        <div class="league-info">
          <h3>{{ league.name }}</h3>
          <p class="code">{{ league.code }}</p>
          <p class="area">{{ league.area.name }}</p>
        </div>
        <div class="arrow">→</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { footballApi, type Competition } from '../api/football'

const router = useRouter()
const authStore = useAuthStore()

const leagues = ref<Competition[]>([])
const loading = ref(true)
const error = ref('')

const loadLeagues = async () => {
  loading.value = true
  error.value = ''

  try {
    const data = await footballApi.getCompetitions()
    // Фильтруем только футбольные лиги (type: LEAGUE или CUP)
    leagues.value = data.filter((comp) => comp.type === 'LEAGUE').slice(0, 20)
  } catch (err) {
    console.error(err)
    error.value = 'Не удалось загрузить лиги. Проверьте подключение к API.'
  } finally {
    loading.value = false
  }
}

const goToLeague = (id: number) => {
  router.push(`/leagues/${id}`)
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadLeagues()
})
</script>

<style scoped>
.leagues-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

h1 {
  color: #333;
  margin: 0;
}

.logout-btn {
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #c82333;
}

.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  padding: 40px;
  color: #dc3545;
}

.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.leagues-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.league-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.league-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.league-info h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.code {
  color: #667eea;
  font-weight: bold;
  margin: 5px 0;
}

.area {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.arrow {
  font-size: 24px;
  color: #ccc;
  transition: transform 0.2s;
}

.league-card:hover .arrow {
  transform: translateX(5px);
  color: #667eea;
}
</style>
