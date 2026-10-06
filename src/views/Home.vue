<template>
  <div class="home-container">
    <div class="hero">
      <h1 class="title">🔗 短链生成器</h1>
      <p class="subtitle">把长链接变短，简洁高效</p>
    </div>

    <el-card class="shorten-card" shadow="hover">
      <el-form :model="shortenForm" @submit.prevent="handleShorten">
        <el-form-item>
          <el-input
            v-model="shortenForm.url"
            placeholder="粘贴你的长链接，例如 https://example.com/very/long/path"
            size="large"
            clearable
            :prefix-icon="Link"
            @keyup.enter="handleShorten"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="submit-btn"
            @click="handleShorten"
          >
            生成短链
          </el-button>
        </el-form-item>
      </el-form>

      <div v-if="result" class="result-box">
        <div class="result-label">生成成功</div>
        <div class="result-url">
          <a :href="result.short_url" target="_blank" rel="noopener">{{ result.short_url }}</a>
        </div>
        <div class="result-actions">
          <el-button type="primary" size="small" @click="copyUrl">
            <el-icon><DocumentCopy /></el-icon>
            复制
          </el-button>
          <el-button size="small" @click="reset">再生成一个</el-button>
        </div>
      </div>
    </el-card>

    <p class="tip">
      仅支持 http / https 链接，内网地址将被拦截。每个 IP 限流 10 QPS。
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Link, DocumentCopy } from '@element-plus/icons-vue'
import { shorten, type ShortenResponse } from '@/api'

const loading = ref(false)
const result = ref<ShortenResponse | null>(null)

const shortenForm = reactive({
  url: '',
})

const handleShorten = async () => {
  const url = shortenForm.url.trim()
  if (!url) {
    ElMessage.warning('请输入链接')
    return
  }

  loading.value = true
  result.value = null
  try {
    const res = await shorten({ url })
    result.value = res
    ElMessage.success('短链生成成功！')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '生成失败')
  } finally {
    loading.value = false
  }
}

const copyUrl = () => {
  if (!result.value) return
  navigator.clipboard.writeText(result.value.short_url)
  ElMessage.success('已复制到剪贴板')
}

const reset = () => {
  shortenForm.url = ''
  result.value = null
}
</script>

<style scoped>
.home-container {
  max-width: 640px;
  margin: 0 auto;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 32px;
  margin: 0 0 8px;
  color: #409eff;
}

.subtitle {
  margin: 0;
  color: #909399;
  font-size: 15px;
}

.shorten-card {
  width: 100%;
  border-radius: 12px;
}

.submit-btn {
  width: 100%;
}

.result-box {
  margin-top: 8px;
  padding: 16px;
  background: #f0f9eb;
  border-radius: 8px;
  border: 1px solid #e1f3d8;
}

.result-label {
  font-size: 13px;
  color: #67c23a;
  font-weight: 600;
  margin-bottom: 8px;
}

.result-url {
  font-size: 18px;
  font-weight: 600;
  word-break: break-all;
  margin-bottom: 12px;
}

.result-url a {
  color: #409eff;
  text-decoration: none;
}
.result-url a:hover {
  text-decoration: underline;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.tip {
  margin-top: 24px;
  font-size: 13px;
  color: #909399;
  text-align: center;
}

@media (max-width: 600px) {
  .home-container {
    padding: 40px 16px;
  }
  .title {
    font-size: 26px;
  }
}
</style>
