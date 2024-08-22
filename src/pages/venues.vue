<!-- 模板部分 -->
<template>
  <v-container
    class="mt-8 mb-12"
    style="max-width: 1200px;"
    fluid
  >
    <!-- 標題 -->
    <h2>球場資訊</h2>

    <!-- 選擇地區和搜索欄 -->
    <v-row class="mt-4">
      <div
        class="ps-4"
        style="color: #333; font-size: 16px; font-weight: 500;"
      >
        地區 :
      </div>
    </v-row>
    <v-row>
      <!-- 地區選擇下拉選單 -->
      <v-col
        cols="5"
        md="3"
      >
        <v-select
          v-model="selectedCity"
          :items="cities"
          variant="outlined"
          density="compact"
          :clearable="!!selectedCity"
          @update:model-value="onCityChange"
          @click:clear="clearCity"
        />
      </v-col>
      <v-spacer />
      <!-- 搜索輸入框 -->
      <v-col
        cols="5"
        md="3"
      >
        <v-text-field
          v-model="searchQuery"
          label="搜尋"
          append-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          @input="debounceSearch"
          @click:clear="clearSearch"
        />
      </v-col>
    </v-row>

    <!-- 載入中顯示 -->
    <v-row
      v-if="isLoading"
      justify="center"
      align="center"
      style="height: 200px;"
    >
      <v-col
        cols="12"
        class="text-center"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
      </v-col>
    </v-row>

    <!-- 球場列表顯示 -->
    <template v-else>
      <!-- 有球場時顯示球場卡片 -->
      <v-row
        v-if="venues.length > 0"
        class="mb-4 "
      >
        <v-col
          v-for="venue in venues"
          :key="venue._id"
          cols="12"
          md="6"
        >
          <VenueCard v-bind="venue" />
        </v-col>
      </v-row>
      <!-- 沒有球場時顯示提示訊息 -->
      <v-row v-else>
        <v-col
          cols="12"
          class="text-center"
        >
          <p>沒有找到相關球場</p>
        </v-col>
      </v-row>
      <!-- 分頁控制 -->
      <v-row v-if="pages > 1">
        <v-col cols="12">
          <v-pagination
            v-model="page"
            :length="pages"
            rounded="circle"
            density="compact"
            next-icon="mdi-menu-right"
            prev-icon="mdi-menu-left"
            :total-visible="8"
            color="teal-darken-1"
            @update:model-value="onPageChange"
          />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
// 引入所需的函數和組件
import { definePage } from 'vue-router/auto'
import { ref, watch } from 'vue'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import VenueCard from '@/components/VenueCard.vue'

// 定義頁面元數據
definePage({
  meta: {
    title: '球場資訊 | VPT'
  }
})

// 初始化API和Snackbar
const { api } = useApi()
const createSnackbar = useSnackbar()

// 定義響應式變量
const searchQuery = ref('')
const selectedCity = ref('')
const venues = ref([])
const isLoading = ref(true)

const page = ref(1)
const pages = ref(1)
const ITEMS_PER_PAGE = 10

// 定義城市列表
const cities = [
  '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
  '基隆市', '新竹市', '嘉義市', '新竹縣', '苗栗縣', '彰化縣',
  '南投縣', '雲林縣', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
  '台東縣', '澎湖縣', '金門縣', '連江縣'
]

// 加載球場數據的函數
const loadVenues = async () => {
  isLoading.value = true
  try {
    const { data } = await api.get('/venue', {
      params: {
        itemsPerPage: ITEMS_PER_PAGE,
        page: page.value,
        search: searchQuery.value,
        city: selectedCity.value
      }
    })
    pages.value = Math.ceil(data.result.total / ITEMS_PER_PAGE)
    venues.value = data.result.data
  } catch (error) {
    console.error('載入球場資訊時發生錯誤:', error)
    createSnackbar({
      text: error?.response?.data?.message || '載入球場資訊時發生錯誤',
      snackbarProps: {
        color: 'red-lighten-1'
      }
    })
    venues.value = []
    pages.value = 1
  } finally {
    isLoading.value = false
  }
}

// 延遲搜索函數
const debounceSearch = (() => {
  let timer
  return () => {
    isLoading.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      page.value = 1
      loadVenues()
    }, 300)
  }
})()

// 清除搜索函數
const clearSearch = () => {
  searchQuery.value = ''
  page.value = 1
  loadVenues()
}

// 城市選擇變化處理函數
const onCityChange = () => {
  page.value = 1
  loadVenues()
}

// 清除城市選擇函數
const clearCity = () => {
  selectedCity.value = ''
  page.value = 1
  loadVenues()
}

// 頁面變化處理函數
const onPageChange = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  loadVenues()
}

// 監聽搜索查詢變化
watch(searchQuery, (newValue) => {
  if (newValue === '') {
    page.value = 1
    loadVenues()
  }
})

// 監聽選擇城市變化
watch(selectedCity, (newValue) => {
  if (newValue === null) {
    page.value = 1
    loadVenues()
  }
})

// 初始加載
loadVenues()
</script>
