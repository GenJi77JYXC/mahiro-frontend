import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('token') || null as string | null,
        userInfo: null as any | null
    }),
    actions: {
        setToken(token: string) {
            this.token = token
            localStorage.setItem('token', token)
        },
        logout() {
            this.token = null
            this.userInfo = null
            localStorage.removeItem('token')
        }
    }
})
