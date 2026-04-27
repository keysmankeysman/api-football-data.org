<template>
  <div class="container">
    <h1>Тест API Football-Data.org</h1>
    
    <div class="status">
      <h3>Статус: {{ status }}</h3>
    </div>

    <div v-if="loading" class="loading">
      Загрузка данных...
    </div>

    <div v-else-if="error" class="error">
      <h3>Ошибка:</h3>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="leagues.length > 0" class="leagues">
      <h2>Список лиг (первые 10):</h2>
      <ul>
        <li v-for="league in leagues" :key="league.id">
          <strong>{{ league.name }}</strong> ({{ league.code }}) - {{ league.area?.name || 'Неизвестно' }}
        </li>
      </ul>
    </div>

    <div v-else class="no-data">
      Нет данных для отображения
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Area {
  name: string
}

interface League {
  id: number
  name: string
  code: string
  area?: Area
}

const leagues = ref<League[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const status = ref('Подключение...')

onMounted(async () => {
  try {
    status.value = 'Отправка запроса...'
    console.log('📤 Отправляем запрос к API...')
    
    // Запрос через прокси Vite
    const response = await fetch('/api/football/competitions')
    
    status.value = `Получен ответ: ${response.status} ${response.statusText}`
    console.log('📥 Статус ответа:', response.status)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('✅ Полученные данные:', data)
    
    if (data.competitions && Array.isArray(data.competitions)) {
      leagues.value = data.competitions.slice(0, 10) // Берем первые 10 лиг
      status.value = `Успех! Загружено ${leagues.value.length} лиг`
    } else {
      throw new Error('Неверный формат ответа от API')
    }
    
  } catch (err) {
    console.error('❌ Ошибка:', err)
    error.value = err instanceof Error ? err.message : 'Неизвестная ошибка'
    status.value = 'Ошибка подключения'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  border-bottom: 3px solid #4CAF50;
  padding-bottom: 10px;
}

.status {
  background: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  margin: 20px 0;
  font-family: monospace;
}

.loading {
  color: #2196F3;
  font-weight: bold;
  margin: 20px 0;
}

.error {
  background: #ffebee;
  color: #f44336;
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
}

.leagues {
  margin-top: 20px;
}

.leagues ul {
  list-style: none;
  padding: 0;
}

.leagues li {
  background: #f9f9f9;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  border-left: 4px solid #4CAF50;
}

.leagues strong {
  color: #333;
}

.no-data {
  color: #999;
  text-align: center;
  margin: 40px 0;
}
</style>