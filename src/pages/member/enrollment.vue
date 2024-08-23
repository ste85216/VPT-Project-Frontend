<template>
  <v-row class="mt-4">
    <!-- 頁面標題 -->
    <v-col
      cols="12"
      class="pt-0"
    >
      <v-row align="center">
        <v-col
          cols="12"
          sm=""
        >
          <h3 class="opacity-90 mb-4">
            報名紀錄
            <v-icon
              icon="mdi-information-outline"
              color="grey-darken-1"
              size="x-small"
              class="pb-1"
              @click="openInformationDialog"
            />
          </h3>
        </v-col>
        <v-spacer />
        <v-col cols="1" />
      </v-row>
    </v-col>
    <v-col class="pt-0 pb-2">
      <v-divider />
    </v-col>

    <!-- 中等屏幕及以上的報名紀錄表 -->
    <v-col
      v-if="mdAndUp"
      cols="12"
    >
      <!-- 表頭 -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-row
            class="px-4 text-center"
            style="font-size: 15px;"
          >
            <v-col cols="2">
              球場
            </v-col>
            <v-col cols="2">
              日期
            </v-col>
            <v-col cols="1">
              時段
            </v-col>
            <v-col cols="1">
              網高
            </v-col>
            <v-col cols="1">
              程度
            </v-col>
            <v-col cols="2">
              報名人數
            </v-col>
            <v-col cols="1">
              費用
            </v-col>
            <v-col cols="1">
              備註
            </v-col>
            <v-col cols="1">
              操作
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- 無報名記錄時顯示 -->
      <v-sheet
        v-if="enrollments.length === 0"
        class="opacity-80 text-center"
      >
        目前您沒有報名任何場次
      </v-sheet>

      <!-- 場次卡片列表 -->
      <v-card
        v-for="(enrollment, index) in enrollments"
        :key="enrollment._id"
        elevation="0"
        class="pa-4 py-8 post-card"
        :style="{ backgroundColor: index % 2 === 0 ? '#ECEFF1' : '#f0f0f080' }"
      >
        <v-row>
          <v-col cols="12">
            <v-row class="align-center text-center text-subtitle-2 text-blue-grey-darken-2">
              <v-col cols="2">
                {{ getVenueName(enrollment.s_id) }}
              </v-col>
              <v-col cols="2">
                {{ formatDate(enrollment.s_id?.date) }}
              </v-col>
              <v-col cols="1">
                {{ enrollment.s_id?.time || '未知時段' }}
              </v-col>
              <v-col cols="1">
                {{ enrollment.s_id?.netheight || '未知網高' }}
              </v-col>
              <v-col cols="1">
                {{ enrollment.s_id?.level || '未知程度' }}
              </v-col>
              <v-col cols="2">
                {{ formatEnrollmentCount(enrollment) }}
              </v-col>
              <v-col cols="1">
                {{ enrollment.s_id?.fee === 0 ? '免費' : `$${enrollment.s_id.fee}/人` }}
              </v-col>
              <v-col cols="1">
                {{ enrollment.s_id?.note || '無' }}
              </v-col>
              <v-col cols="1">
                <!-- 操作按鈕 -->
                <v-btn
                  size="x-small"
                  color="blue-darken-1"
                  variant="outlined"
                  @click="addToGoogleCalendar(enrollment)"
                >
                  <v-icon
                    class="pt-1"
                    icon="mdi-clock-out"
                  />
                </v-btn>
                <br>
                <v-btn
                  size="x-small"
                  color="teal-darken-1"
                  variant="outlined"
                  class="mt-2"
                  @click="openEditDialog(enrollment)"
                >
                  <v-icon
                    class="pt-1"
                    icon="mdi-pen"
                  />
                </v-btn>
                <v-btn
                  size="x-small"
                  color="red-darken-3"
                  variant="outlined"
                  class="mt-2"
                  @click="openDeleteDialog(enrollment._id)"
                >
                  <v-icon
                    class="pt-1"
                    icon="mdi-delete"
                  />
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- 中等屏幕以下的報名紀錄表 -->
    <v-col
      v-if="!mdAndUp"
      cols="12"
    >
      <!-- 表頭 -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-row
            class="px-4 text-center"
            style="font-size: 15px;"
          >
            <v-col>球場</v-col>
            <v-col>日期/時段</v-col>
            <v-col cols="3">
              操作
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- 無報名記錄時顯示 -->
      <v-sheet
        v-if="enrollments.length === 0"
        align="center"
        class="opacity-80"
      >
        目前您沒有報名任何場次
      </v-sheet>

      <!-- 場次卡片列表 -->
      <v-card
        v-for="(enrollment, index) in enrollments"
        :key="enrollment._id"
        elevation="0"
        class="pa-4 py-8 post-card"
        :style="{ backgroundColor: index % 2 === 0 ? '#ECEFF1' : '#f0f0f080' }"
      >
        <v-row>
          <v-col cols="12">
            <v-row class="align-center text-center text-subtitle-2 text-blue-grey-darken-2">
              <v-col>{{ getVenueName(enrollment.s_id) }}</v-col>
              <v-col>
                {{ formatDate(enrollment.s_id?.date) }} <br>
                {{ enrollment.s_id?.time || '未知時段' }}
              </v-col>
              <v-col cols="3">
                <!-- 操作按鈕 -->
                <v-btn
                  size="x-small"
                  color="blue-darken-1"
                  variant="outlined"
                  @click="addToGoogleCalendar(enrollment)"
                >
                  <v-icon icon="mdi-clock-out" />
                </v-btn>
                <br>
                <v-btn
                  size="x-small"
                  color="teal-darken-1"
                  variant="outlined"
                  class="mt-2"
                  @click="openEditDialog(enrollment)"
                >
                  <v-icon icon="mdi-pen" />
                </v-btn>
                <br>
                <v-btn
                  size="x-small"
                  color="red-darken-3"
                  variant="outlined"
                  class="mt-2"
                  @click="openDeleteDialog(enrollment._id)"
                >
                  <v-icon icon="mdi-delete" />
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>

  <!-- 說明對話框 -->
  <v-dialog
    v-model="informationDialog.open"
    max-width="320px"
  >
    <v-card class="px-2 py-5 rounded-lg">
      <v-card-title
        class="ps-6"
        style="font-size: 16px;"
      >
        操作說明
      </v-card-title>
      <v-card-text class="pb-0">
        <v-row
          style="font-size: 15px;"
        >
          <v-col
            cols="12"
          >
            <v-icon
              icon="mdi-clock-out"
              color="blue-darken-1"
              size="small"
            />  :  將場次加入Google 行事曆按鈕
          </v-col>
          <v-col cols="12">
            <v-icon
              icon="mdi-pen"
              color="teal-darken-1"
              size="small"
            />  :  編輯報名人數按鈕
          </v-col>
          <v-col cols="12">
            <v-icon
              icon="mdi-delete"
              color="red-darken-3"
              size="small"
            />  :  取消報名按鈕
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="teal-lighten-1"
          variant="outlined"
          size="small"
          @click="closeInformationDialog"
        >
          確認
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 編輯對話框 -->
  <v-dialog
    v-model="editDialog.open"
    max-width="320px"
  >
    <v-card class="px-2 py-5 rounded-lg">
      <v-card-title
        class="ps-6"
        style="font-size: 16px;"
      >
        編輯報名
      </v-card-title>
      <v-card-text class="pb-0">
        <!-- 中等屏幕以下顯示的額外信息 -->
        <v-row
          v-if="!mdAndUp"
          class="mb-4 md-down-dialog-text"
        >
          <v-col cols="12">
            網高: {{ editDialog.session?.netheight || '未知' }}
          </v-col>
          <v-col cols="12">
            程度: {{ editDialog.session?.level || '未知' }}
          </v-col>
          <v-col cols="12">
            價錢: {{ editDialog.session?.fee === 0 ? '免費' : `$${editDialog.session.fee}/人` }}
          </v-col>
          <v-col cols="12">
            備註: {{ editDialog.session?.note || '無' }}
          </v-col>
          <v-col cols="12">
            你已報名: {{ formatEnrollmentCount(editDialog.enrollment) }}
          </v-col>
          <v-divider class="mt-2 mb-5" />
        </v-row>
        <!-- 編輯表單 -->
        <v-text-field
          v-if="editDialog.showMale"
          v-model="editDialog.male"
          label="男生人數"
          variant="outlined"
          density="compact"
          type="number"
          min="0"
        />
        <v-text-field
          v-if="editDialog.showFemale"
          v-model="editDialog.female"
          label="女生人數"
          variant="outlined"
          density="compact"
          type="number"
          min="0"
        />
        <v-text-field
          v-if="editDialog.showNopreference"
          v-model="editDialog.nopreference"
          label="不限性別人數"
          variant="outlined"
          density="compact"
          type="number"
          min="0"
        />
      </v-card-text>
      <v-card-actions class="px-5">
        <v-spacer />
        <v-btn
          color="red-darken-1"
          variant="outlined"
          size="small"
          @click="closeEditDialog"
        >
          取消
        </v-btn>
        <v-btn
          color="teal-lighten-1"
          variant="outlined"
          size="small"
          @click="submitEdit"
        >
          確認
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 刪除確認對話框 -->
  <v-dialog
    v-model="deleteDialog.open"
    max-width="300px"
  >
    <v-card class="py-4 px-3">
      <v-card-title style="font-size: 16px;">
        取消確認
      </v-card-title>
      <v-card-text style="font-size: 15px;">
        確定要取消報名嗎？
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue-grey-darken-1"
          variant="outlined"
          size="small"
          text
          @click="closeDeleteDialog"
        >
          取消
        </v-btn>
        <v-btn
          color="red-darken-3"
          variant="outlined"
          size="small"
          text
          @click="submitDelete"
        >
          確認
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { definePage } from 'vue-router/auto'
import { useDisplay } from 'vuetify'

// 使用 Vuetify 的響應式功能
const { mdAndUp } = useDisplay()

// 初始化 API 和 Snackbar
const { api, apiAuth } = useApi()
const createSnackbar = useSnackbar()

// 儲存報名記錄的響應式引用
const enrollments = ref([])

const informationDialog = ref({
  open: false
})

// 編輯對話框的狀態
const editDialog = ref({
  open: false,
  id: null,
  male: 0,
  female: 0,
  nopreference: 0
})

// 刪除對話框的狀態
const deleteDialog = ref({
  open: false,
  id: null
})

// 獲取場地名稱
const getVenueName = (s_id) => {
  if (!s_id || !s_id.v_id) return '未知場地'
  return s_id.v_id.name || '未知場地'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知日期'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW')
}

// 加載報名記錄
const loadEnrollments = async () => {
  try {
    const { data } = await apiAuth.get('/enrollment')
    if (Array.isArray(data.result)) {
      enrollments.value = data.result
    } else {
      console.error('Unexpected data format:', data)
      throw new Error('資料格式錯誤')
    }
  } catch (error) {
    console.error('Error loading enrollments:', error)
    createSnackbar({
      text: error?.response?.data?.message || error.message || '無法加載報名資料',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

// 格式化報名人數
const formatEnrollmentCount = (enrollment) => {
  const parts = []
  if (enrollment.male > 0) parts.push(`男${enrollment.male}人`)
  if (enrollment.female > 0) parts.push(`女${enrollment.female}人`)
  if (enrollment.nopreference > 0) parts.push(`不限${enrollment.nopreference}人`)
  return parts.join(' ')
}

// 打開說明對話框
const openInformationDialog = (information) => {
  informationDialog.value = {
    open: true
  }
}

const closeInformationDialog = () => {
  informationDialog.value.open = false
}

// 打開編輯對話框
const openEditDialog = (enrollment) => {
  editDialog.value = {
    open: true,
    id: enrollment._id,
    male: enrollment.male || 0,
    female: enrollment.female || 0,
    nopreference: enrollment.nopreference || 0,
    originalMale: enrollment.male || 0,
    originalFemale: enrollment.female || 0,
    originalNopreference: enrollment.nopreference || 0,
    session: enrollment.s_id,
    showMale: enrollment.s_id.male > 0,
    showFemale: enrollment.s_id.female > 0,
    showNopreference: enrollment.s_id.nopreference > 0,
    enrollment
  }
}

// 關閉編輯對話框
const closeEditDialog = () => {
  editDialog.value.open = false
}

// 提交編輯
const submitEdit = async () => {
  try {
    const newMale = editDialog.value.showMale ? parseInt(editDialog.value.male) : 0
    const newFemale = editDialog.value.showFemale ? parseInt(editDialog.value.female) : 0
    const newNopreference = editDialog.value.showNopreference ? parseInt(editDialog.value.nopreference) : 0
    const oldMale = editDialog.value.originalMale
    const oldFemale = editDialog.value.originalFemale
    const oldNopreference = editDialog.value.originalNopreference
    const session = editDialog.value.session

    // 計算人數變化
    const maleDiff = newMale - oldMale
    const femaleDiff = newFemale - oldFemale
    const nopreferenceDiff = newNopreference - oldNopreference

    // 檢查是否超過可用名額
    if (session.nopreference > 0) {
      if (maleDiff + femaleDiff + nopreferenceDiff > session.nopreference) {
        throw new Error(`超過可用名額。當前剩餘 ${session.nopreference} 個名額。`)
      }
    } else {
      if (maleDiff > session.male || femaleDiff > session.female) {
        throw new Error(`超過可用名額。當前剩餘男 ${session.male} 名，女 ${session.female} 名。`)
      }
    }

    // 準備更新數據
    const updateData = {}
    if (editDialog.value.showMale) updateData.male = newMale
    if (editDialog.value.showFemale) updateData.female = newFemale
    if (editDialog.value.showNopreference) updateData.nopreference = newNopreference

    // 發送更新請求
    await apiAuth.patch(`/enrollment/${editDialog.value.id}`, updateData)
    createSnackbar({
      text: '報名更新成功',
      snackbarProps: { color: 'teal-darken-1' }
    })
    closeEditDialog()
    loadEnrollments()
  } catch (error) {
    createSnackbar({
      text: error?.message || '更新失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

// 打開刪除確認對話框
const openDeleteDialog = (id) => {
  deleteDialog.value = {
    open: true,
    id
  }
}

// 關閉刪除確認對話框
const closeDeleteDialog = () => {
  deleteDialog.value.open = false
}

// 加載場次數據
const loadSessions = async () => {
  try {
    const { data } = await api.get('/session')
    if (Array.isArray(data.result)) {
      console.log('Sessions reloaded:', data.result)
    } else {
      console.error('Unexpected data format:', data)
    }
  } catch (error) {
    console.error('Error loading sessions:', error)
    createSnackbar({
      text: error?.response?.data?.message || '無法加載場次資料',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

// 提交刪除請求
const submitDelete = async () => {
  try {
    const response = await apiAuth.delete(`/enrollment/${deleteDialog.value.id}`)
    console.log('Delete response:', response.data)
    createSnackbar({
      text: '報名刪除成功',
      snackbarProps: { color: 'teal-darken-1' }
    })
    closeDeleteDialog()
    await loadEnrollments()
    // 重新加載場次數據
    await loadSessions()
  } catch (error) {
    console.error('Delete error:', error)
    createSnackbar({
      text: error?.response?.data?.message || error.message || '刪除失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

// 添加到 Google 日曆
const addToGoogleCalendar = (enrollment) => {
  const session = enrollment.s_id
  const venue = getVenueName(session)

  // 創建事件開始和結束時間
  const [startTime, endTime] = session.time.split('-')
  const startDate = new Date(session.date)
  startDate.setHours(parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]))
  const endDate = new Date(session.date)
  endDate.setHours(parseInt(endTime.split(':')[0]), parseInt(endTime.split(':')[1]))

  // 創建事件描述
  const description = `網高: ${session.netheight}\n程度: ${session.level}\n費用: ${session.fee}/人\n備註: ${session.note || '無'}`

  // 生成 Google 日曆 URL
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`排球場次 - ${venue}`)}&dates=${startDate.toISOString().replace(/-|:|\.\d\d\d/g, '')}/${endDate.toISOString().replace(/-|:|\.\d\d\d/g, '')}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(venue)}`

  // 在新視窗中開啟 URL
  window.open(calendarUrl, '_blank')
}

// 組件掛載時加載數據
onMounted(() => {
  loadEnrollments()
})

// 定義頁面元數據
definePage({
  meta: {
    title: '報名紀錄 | VPT',
    login: true,
    admin: false
  }
})
</script>

<style lang="scss" scoped>
.post-card {
  background-color: #f5f5f5;
  border-top: 2px solid #d5d5d5;
  border-radius: 0;
}
.md-down-dialog-text {
  font-size: 14px;
}
</style>

<route lang="yaml">
meta:
  layout: member
</route>
