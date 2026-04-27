<template>
  <div class="league-detail">
    <div class="header">
      <button @click="goBack" class="back-btn">← Назад</button>
      <button @click="logout" class="logout-btn">Выйти</button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка информации...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>❌ {{ error }}</p>
    </div>

    <div v-else class="content">
      <div class="league-header">
        <h1>{{ league?.name }}</h1>
        <p class="code">{{ league?.code }} • {{ league?.area?.name }}</p>
        <p class="type">{{ league?.type === 'LEAGUE' ? 'Чемпионат' : 'Кубок' }}</p>
      </div>

      <div v-if="teams.length > 0" class="teams-section">
        <h2>Команды ({{ teams.length }})</h2>
        <div class="teams-grid">
          <div v-for="team in teams" :key="team.id" class="team-card">
            <h3>{{ team.name }}</h3>
            <p v-if="team.shortName" class="short-name">{{ team.shortName }}</p>
            <p v-if="team.tla" class="tla">{{ team.tla }}</p>
            <p v-if="team.founded" class="founded">Основан: {{ team.founded }}</p>
          </div>
        </div>
      </div>

      <div v-else class="no-data">Нет данных о командах</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { footballApi, type Competition, type Team } from '../api/football'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const league = ref<Competition | null>(null)
const teams = ref<Team[]>([])
const loading = ref(true)
const error = ref('')

const goBack = () => {
  router.push('/leagues')
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  const leagueId = Number(route.params.id)

  try {
    loading.value = true
    const [leagueData, teamsData] = await Promise.all([
      footballApi.getCompetition(leagueId),
      footballApi.getCompetitionTeams(leagueId),
    ])

    league.value = leagueData
    teams.value = teamsData.slice(0, 20) 
  } catch (err) {
    console.error(err)
    error.value = 'Не удалось загрузить данные о лиге'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.league-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.back-btn,
.logout-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.back-btn {
  background: #6c757d;
  color: white;
}

.back-btn:hover {
  background: #5a6268;
}

.logout-btn {
  background: #dc3545;
  color: white;
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

.content {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.league-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.league-header h1 {
  margin: 0 0 10px 0;
  font-size: 32px;
}

.code {
  font-size: 18px;
  opacity: 0.9;
  margin: 5px 0;
}

.type {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  margin-top: 10px;
}

.teams-section h2 {
  color: #333;
  margin-bottom: 20px;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.team-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.team-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.team-card h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
}

.short-name {
  color: #667eea;
  font-weight: bold;
  font-size: 14px;
  margin: 5px 0;
}

.tla {
  color: #666;
  font-size: 12px;
  font-family: monospace;
  margin: 5px 0;
}

.founded {
  color: #999;
  font-size: 12px;
  margin: 5px 0;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>
