import axios from 'axios'

const API_BASE_URL = '/api/football'

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000
})

// Интерсептор для добавления заголовков
apiClient.interceptors.request.use(
    (config) => {
        // Токен уже добавляется через proxy в vite.config.ts
        console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export interface Competition {
    id: number
    name: string
    code: string
    type: string
    emblem?: string
    area: {
        name: string
        code: string
        flag?: string
    }
    currentSeason?: {
        startDate: string
        endDate: string
        winner?: string
    }
}

export interface Team {
    id: number
    name: string
    shortName: string
    tla: string
    crest?: string
    address?: string
    website?: string
    email?: string
    founded?: number
}

export const footballApi = {
    // Получить все лиги
    async getCompetitions(): Promise<Competition[]> {
        const response = await apiClient.get('/competitions')
        return response.data.competitions || []
    },

    // Получить конкретную лигу
    async getCompetition(id: number): Promise<Competition> {
        const response = await apiClient.get(`/competitions/${id}`)
        return response.data
    },

    // Получить команды лиги
    async getCompetitionTeams(competitionId: number): Promise<Team[]> {
        const response = await apiClient.get(`/competitions/${competitionId}/teams`)
        return response.data.teams || []
    },

    // Получить таблицу лиги
    async getStandings(competitionId: number) {
        const response = await apiClient.get(`/competitions/${competitionId}/standings`)
        return response.data.standings
    }
}