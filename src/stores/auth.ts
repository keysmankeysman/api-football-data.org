import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('jwt_token'))
    const user = ref<{ email: string } | null>(null)

    const isAuthenticated = computed(() => !!token.value)

    const login = async (email: string, password: string) => {
        if (email === 'test@example.com' && password === '123456') {
            const fakeToken = btoa(JSON.stringify({
                email,
                exp: Date.now() + 3600000
            }))

            token.value = fakeToken
            localStorage.setItem('jwt_token', fakeToken)
            user.value = { email }

            return { success: true }
        }

        return { success: false, error: 'Неверный email или пароль' }
    }

    const logout = () => {
        token.value = null
        user.value = null
        localStorage.removeItem('jwt_token')
    }

    return { token, user, isAuthenticated, login, logout }
})