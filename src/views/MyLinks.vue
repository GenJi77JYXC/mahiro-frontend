<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getMyLinks, type LinkItem } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const links = ref<LinkItem[]>([])

const loadLinks = async () => {
  loading.value = true
  try {
    const res = await getMyLinks()
    links.value = res.links || []
  } catch {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const goHome = () => router.push('/home')

const logout = () => {
  userStore.logout()
  router.push('/login')
}

onMounted(loadLinks)
</script>

<template>
  <div class="links-container">
    <el-card class="links-card">
      <div class="header">
        <h2>我的短链</h2>
        <div class="actions">
          <el-button @click="goHome">返回生成</el-button>
          <el-button type="danger" plain @click="logout">退出登录</el-button>
        </div>
      </div>

      <el-table :data="links" v-loading="loading" stripe>
        <el-table-column prop="short_code" label="短码" width="120" />
        <el-table-column prop="original_url" label="原链接" show-overflow-tooltip />
        <el-table-column prop="clicks" label="点击量" width="100" align="center" />
        <el-table-column prop="created_at" label="创建时间" width="180" />
      </el-table>

      <el-empty v-if="!loading && links.length === 0" description="还没有短链，去生成一个吧" />
    </el-card>
  </div>
</template>

<style scoped>
.links-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.header h2 {
  margin: 0;
}
.actions {
  display: flex;
  gap: 8px;
}
</style>
