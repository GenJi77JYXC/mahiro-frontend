import axios, {type AxiosError, type AxiosResponse} from 'axios'
import {getCurrentInstance} from "vue";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
})

// 请求拦截器：自动加 token
api.interceptors.request.use(config => {
    const publicPaths = ['/login', '/register']
    if (!publicPaths.some(path => config.url?.includes(path))) {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

// 响应拦截器：统一错误处理
api.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            const instance = getCurrentInstance()
            const router = instance?.appContext.config.globalProperties.$router

            const currentPath = router?.currentRoute.value.path || window.location.pathname

            const noRedirectPaths = ['/login', '/register']

            if (!noRedirectPaths.some(path => currentPath.startsWith(path))) {
                localStorage.removeItem('token')
                router?.push('/login')
            }
        }
        return Promise.reject(error)
    }
)

// 接口定义
export interface LoginRequest {
    username: string
    password: string
}

export interface LoginResponse {
    token: string
}

export interface RegisterRequest {
    username: string
    password: string
}

export interface ShortenRequest {
    url: string
    expire_days?: number
    custom_code?: string
}

export interface ShortenResponse {
    short_url: string
}

export interface LinkItem {
    id: number
    original_url: string
    short_code: string
    created_at: string
    user_id: number
    clicks: number
}

export interface MyLinksResponse {
    links: LinkItem[]
}

export interface StatsResponse {
    clicks: number
}

type ApiResponse<T> = Promise<T>

// 登录
export const login = (data: LoginRequest): ApiResponse<LoginResponse> =>
    api.post('/login', data) as any as Promise<LoginResponse>

// 注册
export const register = (data: RegisterRequest): ApiResponse<{ message: string }> =>
    api.post('/register', data) as any as Promise<{ message: string }>

// 创建短链
export const shorten = (data: ShortenRequest): ApiResponse<ShortenResponse> =>
    api.post('/shorten', data) as any as Promise<ShortenResponse>

// 我的短链
export const getMyLinks = (page = 1, limit = 20): ApiResponse<MyLinksResponse> =>
    api.get('/my-links', { params: { page, limit } }) as any as Promise<MyLinksResponse>

// 短链统计
export const getStats = (shortCode: string) =>
    api.get<StatsResponse>(`/stats/${shortCode}`)
