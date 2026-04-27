const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()

// Настройка CORS для разработки
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
)

// Логирование всех запросов для отладки
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`)
  next()
})

// Эндпоинт для получения лиг
app.get('/api/leagues', async (req, res) => {
  const { country = 'England', sport = 'Soccer' } = req.query

  console.log(`🔍 Запрос лиг: страна=${country}, спорт=${sport}`)

  // Пробуем разные версии API
  const apiVersions = ['3', '2', '1']
  let lastError = null

  for (const version of apiVersions) {
    try {
      const apiUrl = `https://www.thesportsdb.com/api/v1/json/${version}/search_all_leagues.php?c=${country}&s=${sport}`
      console.log(`🌐 Попытка с версией ${version}: ${apiUrl}`)

      const response = await axios.get(apiUrl, {
        timeout: 10000, // 10 секунд таймаут
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      })

      console.log(`✅ Успех с версией ${version}`)
      console.log(`📦 Получены данные:`, Object.keys(response.data))

      // Отправляем данные обратно
      return res.json(response.data)
    } catch (error) {
      console.log(`❌ Ошибка с версией ${version}: ${error.message}`)
      lastError = error
    }
  }

  // Если все версии не сработали
  console.error('❌ Все попытки API не удались')
  res.status(500).json({
    error: 'Не удалось получить данные от TheSportsDB',
    details: lastError?.message || 'Неизвестная ошибка',
  })
})

// Добавим простой тестовый эндпоинт
app.get('/api/test', (req, res) => {
  res.json({ message: 'Сервер работает!', timestamp: new Date().toISOString() })
})

// Эндпоинт для поиска команд
app.get('/api/search-team', async (req, res) => {
  const { teamName } = req.query

  if (!teamName) {
    return res.status(400).json({ error: 'Параметр teamName обязателен' })
  }

  try {
    const apiUrl = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`
    const response = await axios.get(apiUrl)
    res.json(response.data)
  } catch (error) {
    console.error('Ошибка поиска команды:', error.message)
    res.status(500).json({ error: 'Не удалось найти команду' })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`\n✅ Прокси-сервер запущен на http://localhost:${PORT}`)
  console.log(`📋 Доступные эндпоинты:`)
  console.log(`   - GET http://localhost:${PORT}/api/test`)
  console.log(`   - GET http://localhost:${PORT}/api/leagues?country=England&sport=Soccer`)
  console.log(`   - GET http://localhost:${PORT}/api/search-team?teamName=Barcelona`)
  console.log(`\n🔧 Нажмите Ctrl+C для остановки сервера\n`)
})
