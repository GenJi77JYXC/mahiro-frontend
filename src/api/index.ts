import axios, { type AxiosError } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// 响应拦截器：统一返回 data + 错误提示
api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ error?: string }>) => {
    const msg = error.response?.data?.error || '请求失败，请稍后重试'
    return Promise.reject(new Error(msg))
  },
)

// —— 接口定义 ——

export interface ShortenRequest {
  url: string
}

export interface ShortenResponse {
  short_code: string
  short_url: string
}

/** 创建短链：POST /shorten  body: { url } */
export const shorten = (data: ShortenRequest): Promise<ShortenResponse> =>
  api.post('/shorten', data) as Promise<ShortenResponse>
