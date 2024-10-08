<template>
  <!-- 主容器 -->
  <v-container
    class="px-4 px-lg-0 py-0 mt-10 mb-16"
    style="max-width: 1200px; min-height: 1200px;"
  >
    <h2 class="mb-5">
      購物車
    </h2>
    <v-row>
      <!-- 左側：商品清單 -->
      <v-col
        cols="12"
        sm="7"
        md="8"
      >
        <!-- 當購物車為空時顯示的卡片 -->
        <v-card
          v-if="items.length === 0"
          class="mb-4 cart-card d-flex justify-center align-center"
        >
          <div class="text-gray">
            購物車內尚未加入商品
          </div>
        </v-card>
        <!-- 遍歷購物車中的每個商品 -->
        <v-card
          v-for="item in items"
          :key="item._id"
          class="mb-4 cart-card py-4 ps-4 pe-5"
        >
          <v-row
            no-gutters
            class="d-flex justify-space-between"
          >
            <!-- 商品圖片 -->
            <v-col
              cols="4"
              md="2"
              class="d-flex align-center justify-center"
            >
              <v-img
                :src="item.p_id?.images?.[0]"
                elevation="0"
                height="80"
                width="80"
              />
            </v-col>
            <!-- 商品名稱、價格、顏色、尺寸和數量 -->
            <v-col
              cols="6"
              md="9"
              class="d-flex flex-column justify-center"
            >
              <!-- 商品信息行 -->
              <v-row
                no-gutters
              >
                <!-- 商品名稱和價格 -->
                <v-col
                  cols="12"
                  md
                  class="d-flex flex-column justify-center text-sm-center px-md-2"
                >
                  <div class="card-text">
                    {{ item.p_id.name ?? '未知商品' }} / {{ item.p_id.price ?? 0 }} 元
                  </div>
                </v-col>
                <!-- 顏色和尺寸 -->
                <v-col
                  cols="12"
                  md=""
                  class="d-flex align-center justify-sm-center ps-md-2"
                >
                  <div class="card-text ">
                    {{ item.colors }} / {{ item.sizes }}
                  </div>
                </v-col>
                <!-- 數量調整區域 -->
                <v-col
                  cols="12"
                  md="4"
                  class="d-flex align-sm-center justify-sm-center"
                >
                  <v-row
                    no-gutters
                    class="d-flex align-sm-center justify-sm-center"
                  >
                    <!-- 減少數量按鈕 -->
                    <v-col
                      cols="1"
                      sm="2"
                      md="4"
                      class="d-flex align-center justify-center me-3 me-md-0"
                    >
                      <v-btn
                        icon
                        size="x-small"
                        elevation="0"
                        class="quantity-btn"
                        @click="changeQuantity(item, item.quantity - 1)"
                      >
                        <v-icon
                          icon="mdi-minus"
                          size="small"
                          class="minus-btn"
                        />
                      </v-btn>
                    </v-col>
                    <!-- 數量輸入框 -->
                    <v-col
                      cols="3"
                      sm="4"
                      class="d-flex align-center me-3 me-md-0"
                    >
                      <v-text-field
                        v-model.number="item.quantity"
                        type="number"
                        min="1"
                        variant="outlined"
                        density="compact"
                        class="quantity-input"
                        @input="validateQuantity(item)"
                        @blur="handleQuantityBlur(item)"
                        @keypress.enter="handleQuantityBlur(item)"
                      />
                    </v-col>
                    <!-- 增加數量按鈕 -->
                    <v-col
                      cols="1"
                      sm="2"
                      md="4"
                      class="d-flex align-center justify-center"
                    >
                      <v-btn
                        icon
                        size="x-small"
                        elevation="0"
                        class="quantity-btn"
                        @click="changeQuantity(item, item.quantity + 1)"
                      >
                        <v-icon
                          icon="mdi-plus"
                          size="small"
                          class="plus-btn"
                        />
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <!-- 刪除商品按鈕 -->
            <v-col
              cols="1"
              md="1"
              class="d-flex align-center justify-center"
            >
              <v-btn
                icon
                class="delete-btn"
                :ripple="false"
                variant="plain"
                @click="deleteItem(item)"
              >
                <v-icon
                  icon="mdi-delete"
                  color="red-darken-3"
                  class="pb-2"
                />
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- 右側：訂單備註、總價和結帳按鈕 -->
      <v-col
        cols="12"
        sm="5"
        md="4"
      >
        <!-- 訂單備註卡片 -->
        <v-card
          class="pa-4 pb-0 cart-card mb-4"
          height="160"
        >
          <v-row>
            <v-col
              cols="12"
              class="pb-0"
            >
              <h4 class="note-title">
                訂單備註
              </h4>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-4">
              <v-textarea
                v-model="note"
                rows="2"
                variant="outlined"
                auto-grow
                base-color="#666"
                hide-details
                no-resize
                max-rows="2"
                :disabled="loading || items.length === 0"
              />
            </v-col>
          </v-row>
        </v-card>
        <!-- 總價和結帳按鈕卡片 -->
        <v-card
          class="pa-4 pb-0 cart-card "
          height="150"
        >
          <v-row class="d-flex flex-column h-100">
            <v-col class="d-flex justify-space-between">
              <h4 class="total-price-title">
                結帳金額
              </h4>
              <div class="total-price">
                ${{ totalPrice }}
              </div>
            </v-col>
            <v-col class="pb-0">
              <v-btn
                color="primary"
                class="checkout-btn"
                :disabled="loading || items.length === 0"
                @click="checkout"
              >
                結帳
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- 確認刪除對話框組件 -->
  <ConfirmDeleteDialog
    v-model="confirmDialog.open"
    :title="confirmDialog.title"
    :message="confirmDialog.message"
    cancel-size="small"
    confirm-size="small"
    @confirm="confirmAction"
    @cancel="closeConfirmDialog"
  />
</template>

<script setup>
import { definePage } from 'vue-router/auto'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import { useUserStore } from '@/stores/user'
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue'

// 定義頁面元數據
definePage({
  meta: {
    title: '購物車 | VPT',
    login: true,
    admin: false
  }
})

const router = useRouter()
const user = useUserStore()
const createSnackbar = useSnackbar()

// 響應式數據
const items = computed(() => user.cart)
const loading = ref(false) // 標示是否正在載入或處理請求
const note = ref('') // 訂單備註
const confirmDialog = ref({ open: false })

// 載入購物車商品
const loadItems = () => {
  try {
    loading.value = true
    user.loadCart()
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

// 處理數量輸入框失焦事件
const handleQuantityBlur = async (item) => {
  if (!item.quantity || item.quantity < 1) {
    item.quantity = 1
  }
  await updateQuantity(item, item.quantity)
}

// 驗證輸入的數量
const validateQuantity = (item) => {
  if (isNaN(item.quantity) || item.quantity === null || item.quantity === '') {
    item.quantity = 1
  }
}

// 更改商品數量
const changeQuantity = async (item, newQuantity) => {
  if (!user.isLogin) {
    router.push('/login')
    return
  }

  if (newQuantity < 1) {
    confirmDialog.value = {
      open: true,
      title: '您確認要移除嗎？',
      message: '',
      action: () => updateQuantity(item, 0)
    }
    return
  }

  await updateQuantity(item, newQuantity)
}

// 刪除商品
const deleteItem = async (item, showConfirmation = true) => {
  if (!user.isLogin) {
    router.push('/login')
    return
  }

  const performDelete = async () => {
    await updateQuantity(item, 0)
  }

  if (showConfirmation) {
    confirmDialog.value = {
      open: true,
      title: '您確認要移除嗎？',
      message: '',
      action: performDelete
    }
  } else {
    await performDelete()
  }
}

// 確認對話框動作
const confirmAction = async () => {
  if (confirmDialog.value.action) {
    await confirmDialog.value.action()
  }
  closeConfirmDialog()
}

// 關閉確認對話框
const closeConfirmDialog = () => {
  confirmDialog.value.open = false
  confirmDialog.value.action = null
}

// 更新商品數量
const updateQuantity = async (item, newQuantity = null) => {
  if (!user.isLogin) {
    router.push('/login')
    return
  }

  const quantity = newQuantity !== null ? newQuantity : item.quantity

  try {
    await user.addCart(item.p_id._id, quantity, item.colors, item.sizes)
    // 重新加載整個購物車
    await user.loadCart()
  } catch (error) {
    handleError(error)
  }
}

// 錯誤處理
const handleError = (error) => {
  console.error(error)
  createSnackbar({
    text: error?.response?.data?.message || '發生錯誤，請稍後再試',
    snackbarProps: { color: 'red-lighten-1' }
  })
}

// 計算總價 acc累加器 0 是初始值
const totalPrice = computed(() => {
  return items.value.reduce((acc, item) => acc + (item.p_id.price * item.quantity), 0)
})

// 結帳
const checkout = async () => {
  loading.value = true
  const result = await user.checkout(note.value)
  console.log(result)

  createSnackbar({
    text: result.text,
    snackbarProps: {
      color: result.color
    }
  })

  if (result.color === 'teal-darken-1') {
    await user.loadCart() // 確保購物車數據更新
    router.push('/member/order')
  }
  loading.value = false
}

// 初始加載購物車商品
loadItems()
</script>

<style lang="scss" scoped>
@import "@/styles/settings.scss";
:deep(.v-input__details) {
  display: none;
}
.cart-card {
  padding: 24px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  box-shadow: none;
}
.delete-btn {
  color: $danger-color;
  width: 16px;
  height: 16px;
}
.quantity-btn {
  width: 14px;
  height: 14px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  // box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  padding: 0;
}
.plus-btn {
  color: $primary-color;
}
.minus-btn {
  color: $danger-color;
}

.checkout-btn {
  width: 100%;
}

.quantity-input {
  :deep(.v-field__input) {
    min-height: 20px !important;
    padding: 0 4px !important;
    font-size: 10px;
  }
  :deep(.v-field__outline) {
    --v-field-border-width: 1px !important;
  }
  :deep(.v-field__input input) {
    font-size: 12px !important;
    padding: 0 !important;
  }
}

.card-text {
  font-size: 13px;
}

.total-price-title {
    font-size: 16px;
  }
  .total-price {
    font-size: 16px;
    font-weight: 500;
  }

.note-title {
  font-size: 14px;
  font-weight: 500;
}
@include md {
  .quantity-btn {
  width: 24px;
  height: 24px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  // box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  padding: 0;
  }
  .card-text {
    font-size: 15px;
  }
  .quantity-input {
  :deep(.v-field__input) {
    min-height: 32px !important;
    padding: 0 4px !important;
    font-size: 14px;
  }
  :deep(.v-field__outline) {
    --v-field-border-width: 1px !important;
  }
  :deep(.v-field__input input) {
    font-size: 12px !important;
    padding: 0 !important;
  }
  }
  .total-price-title {
    font-size: 18px;
  }
  .total-price {
    font-size: 18px;
    font-weight: 500;
  }
  .note-title {
    font-size: 16px;
  }
}
</style>
