<template>
  <div class="home-container">
    <el-card class="shorten-card">
      <h2>创建短链</h2>

      <el-form :model="shortenForm" label-width="120px">
        <el-form-item label="原链接">
          <el-input v-model="shortenForm.url" placeholder="请输入完整链接" />
        </el-form-item>

        <el-form-item label="自定义短码（可选）">
          <el-input v-model="shortenForm.custom_code" placeholder="如 myblog" />
        </el-form-item>

        <el-form-item label="过期天数（可选）">
          <el-input-number v-model="shortenForm.expire_days" :min="1" :max="365" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleShorten">
            生成短链
          </el-button>
        </el-form-item>

        <el-form-item v-if="shortUrl">
          <el-tag type="success" effect="dark">
            短链生成成功：{{ shortUrl }}
          </el-tag>
          <el-button type="primary" size="small" @click="copyShortUrl">
            复制
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="links-link">
      <el-link type="primary" @click="goMyLinks">查看我的短链 →</el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { shorten } from '@/api'

const router = useRouter()
const loading = ref(false)
const shortUrl = ref('')

const shortenForm = reactive({
  url: '',
  custom_code: '',
  expire_days: 30
})

const handleShorten = async () => {
  if (!shortenForm.url) {
    ElMessage.error('请输入原链接')
    return
  }

  loading.value = true
  try {
    const res = await shorten(shortenForm)
    shortUrl.value = res.short_url
    ElMessage.success('短链生成成功！')
  } catch (error) {
    ElMessage.error('生成失败')
  } finally {
    loading.value = false
  }
}

const copyShortUrl = () => {
  navigator.clipboard.writeText(shortUrl.value)
  ElMessage.success('已复制到剪贴板')
}

const goMyLinks = () => {
  router.push('/my-links')
}
</script>

<style scoped>
.home-container {
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.shorten-card {
  margin-bottom: 20px;
}

.links-link {
  text-align: center;
}
</style>
