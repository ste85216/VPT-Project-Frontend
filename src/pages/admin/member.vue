<template>
  <!-- 主容器 -->
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="text-center">
          會員管理
        </h2>
      </v-col>
      <!-- 新增會員按鈕和搜索欄 -->
      <v-col
        cols="12"
        class="d-flex pa-0 ps-4 pe-4 mt-5"
      >
        <v-btn
          class="custom-btn"
          @click="openDialog(null)"
        >
          新增會員
        </v-btn>
        <v-spacer />
        <v-text-field
          v-model="tableSearch"
          label="搜尋"
          append-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          max-width="240"
          @click-append="tableLoadItems(true)"
          @keydown.enter="tableLoadItems(true)"
        />
      </v-col>
      <!-- 會員數據表格 -->
      <v-col cols="12">
        <v-data-table-server
          v-model:items-per-page="tableItemsPerPage"
          v-model:sort-by="tableSortBy"
          v-model:page="tablePage"
          :items-per-page-options="[10, 20 ,50]"
          :items="tableItems"
          :headers="tableHeaders"
          :loading="tableLoading"
          :items-length="tableItemsLength"
          :search="tableSearch"
          hover
          @update:items-per-page="tableLoadItems(false)"
          @update:sort-by="tableLoadItems(false)"
          @update:page="tableLoadItems(false)"
        >
          <template #top />
          <template #[`item.action`]="{ item }">
            <v-btn
              class="edit-btn"
              icon="mdi-pencil"
              variant="plain"
              @click="openDialog(item)"
            />
          </template>
        </v-data-table-server>
      </v-col>
    </v-row>
  </v-container>

  <!-- 新增/編輯會員對話框 -->
  <v-dialog
    v-model="dialog.open"
    persistent
    width="440"
  >
    <v-form
      :disabled="isSubmitting"
      @submit.prevent="submit"
    >
      <v-card class="rounded-xl pa-4 pt-6">
        <v-card-title style="font-size: 18px;">
          {{ dialog.id ? '會員資料編輯' : '新增會員' }}
        </v-card-title>
        <v-card-text class="mt-3 pa-3">
          <!-- 表單字段 -->
          <v-text-field
            v-model="account.value.value"
            :error-messages="account.errorMessage.value"
            label="帳號"
            variant="outlined"
            density="compact"
            min-length="4"
            maxlength="20"
            clearable
          />
          <v-text-field
            v-model="name.value.value"
            :error-messages="name.errorMessage.value"
            class="mt-2"
            label="姓名"
            type="text"
            variant="outlined"
            density="compact"
            min-length="4"
            maxlength="20"
            clearable
          />
          <v-text-field
            v-model="nickname.value.value"
            :error-messages="nickname.errorMessage.value"
            class="mt-2"
            label="暱稱"
            type="text"
            variant="outlined"
            density="compact"
            clearable
          />
          <v-text-field
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            class="mt-2"
            label="email"
            type="email"
            variant="outlined"
            density="compact"
            min-length="4"
            maxlength="20"
            clearable
          />
          <v-text-field
            v-model="phone.value.value"
            :error-messages="phone.errorMessage.value"
            class="mt-2"
            label="手機號碼"
            type="text"
            variant="outlined"
            density="compact"
            min-length="10"
            maxlength="10"
            clearable
          />
          <v-text-field
            v-model="birthday.value.value"
            :error-messages="birthday.errorMessage.value"
            class="mt-2"
            label="生日"
            type="date"
            variant="outlined"
            density="compact"
            min-length="4"
            maxlength="20"
            clearable
          />
          <v-text-field
            v-if="!dialog.id"
            v-model="password.value.value"
            :error-messages="password.errorMessage.value"
            class="mt-2"
            label="密碼"
            variant="outlined"
            density="compact"
            min-length="4"
            maxlength="20"
            clearable
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="dialog.id"
            color="red"
            :loading="isSubmitting"
            @click="openConfirmDialog"
          >
            刪除
          </v-btn>
          <v-spacer />
          <v-btn
            color="red"
            :loading="isSubmitting"
            @click="closeDialog"
          >
            取消
          </v-btn>
          <v-btn
            color="green"
            type="submit"
            :loading="isSubmitting"
          >
            送出
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

  <!-- 確認刪除對話框 -->
  <v-dialog
    v-model="confirmDialog.open"
    max-width="320"
  >
    <v-card class="px-4 py-3">
      <v-card-title
        class="headline"
        style="font-size: 18px;"
      >
        確認刪除
      </v-card-title>
      <v-card-text class="mt-3 pa-4">
        您確定要刪除此會員嗎？此操作無法撤銷。
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="green darken-1"
          text
          @click="closeConfirmDialog"
        >
          取消
        </v-btn>
        <v-btn
          color="red darken-1"
          text
          @click="deleteProduct"
        >
          刪除
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
// 引入所需的函數和組件
import validator from 'validator'
import { definePage } from 'vue-router/auto'
import { ref } from 'vue'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

// 定義頁面元數據
definePage({
  meta: {
    title: '商品管理 | VPT',
    login: true,
    admin: true
  }
})

// 初始化API和Snackbar
const { apiAuth } = useApi()
const { api } = useApi()
const createSnackbar = useSnackbar()

// 響應式變量
const showPassword = ref(false)
const isEditing = ref(false)

// 對話框狀態管理
const dialog = ref({
  open: false,
  id: ''
})

const confirmDialog = ref({
  open: false
})

// 打開編輯/新增會員對話框
const openDialog = (item) => {
  if (item) {
    isEditing.value = true
    dialog.value.id = item._id
    account.value.value = item.account
    name.value.value = item.name
    nickname.value.value = item.nickname
    email.value.value = item.email
    phone.value.value = item.phone
    birthday.value.value = item.birthday ? formatDate(item.birthday) : ''
  } else {
    isEditing.value = false
    dialog.value.id = ''
    resetForm()
  }
  dialog.value.open = true
}
// 格式化日期
const formatDate = (datestring) => {
  const date = new Date(datestring)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 關閉對話框
const closeDialog = () => {
  dialog.value.open = false
  resetForm()
}

// 打開確認刪除對話框
const openConfirmDialog = () => {
  confirmDialog.value.open = true
}

// 關閉確認刪除對話框
const closeConfirmDialog = () => {
  confirmDialog.value.open = false
}

// 定義表單驗證架構
const schema = yup.object({
  account: yup
    .string()
    .required('請輸入帳號')
    .min(4, '帳號至少需輸入8個字')
    .max(20, '帳號長度不得超過20個字')
    .test(
      'isAlphanumeric', '帳號只能輸入英數字',
      (value) => {
        return validator.isAlphanumeric(value)
      }
    ),
  password: yup
    .string()
    .when('$isEditing', {
      is: false,
      then: () => yup.string().required('請輸入密碼').min(8, '密碼至少需輸入8個字'),
      otherwise: () => yup.string().notRequired()
    }),
  name: yup
    .string()
    .required('請輸入姓名'),
  nickname: yup
    .string().nullable(),
  email: yup
    .string()
    .required('請輸入信箱')
    .test(
      'isEmail', '請輸入正確的信箱格式',
      (value) => {
        return validator.isEmail(value)
      }
    ),
  phone: yup
    .string()
    .required('請輸入手機號碼')
    .min(10, '請輸入10碼手機號碼')
    .test(
      'isMobilePhone', '請輸入正確的手機號碼格式',
      (value) => {
        return validator.isMobilePhone(value)
      }
    ),
  birthday: yup
    .string()
    .required('請輸入生日')
    .test(
      'isDate', '請輸入正確的日期格式',
      (value) => {
        return validator.isDate(value)
      }
    )
}).test('$isEditing', '', () => true)

// 使用 vee-validate 的 useForm 和 useField 函數
const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    account: '',
    name: '',
    nickname: '',
    email: '',
    phone: '',
    birthday: '',
    password: ''
  },
  validateOnMount: false
})

const account = useField('account')
const password = useField('password')
const name = useField('name')
const nickname = useField('nickname')
const email = useField('email')
const phone = useField('phone')
const birthday = useField('birthday')

// 提交表單
const submit = handleSubmit(async (values) => {
  try {
    const payload = {
      account: values.account.toLowerCase(),
      name: values.name,
      nickname: values.nickname,
      email: values.email,
      phone: values.phone,
      birthday: values.birthday ? new Date(values.birthday).toISOString() : undefined
    }

    if (!isEditing.value) {
      payload.password = values.password
      await api.post('/user', payload)
    } else {
      await apiAuth.patch('/user/' + dialog.value.id, payload)
    }

    createSnackbar({
      text: isEditing.value ? '編輯成功' : '新增成功',
      snackbarProps: {
        color: 'teal-darken-1'
      }
    })
    closeDialog()
    tableLoadItems(true)
  } catch (error) {
    console.error('Error in submit function', error)
    console.error('Error response:', error.response)
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red-lighten-1'
      }
    })
  }
})

// 數據表格相關變量
const tableItemsPerPage = ref(10)
const tableSortBy = ref([
  { key: 'createdAt', order: 'desc' }
])
const tablePage = ref(1)
const tableItems = ref([])
const tableHeaders = [
  { title: '帳號', align: 'left', sortable: false, key: 'account' },
  { title: '姓名', align: 'left', sortable: true, key: 'name' },
  { title: '暱稱', align: 'left', sortable: true, key: 'nickname' },
  { title: 'email', align: 'left', sortable: true, key: 'email' },
  { title: '手機', align: 'left', sortable: true, key: 'phone' },
  { title: '操作', align: 'left', sortable: false, key: 'action' }
]
const tableLoading = ref(true)
const tableItemsLength = ref(0)
const tableSearch = ref('')

// 加載表格數據
const tableLoadItems = async (reset) => {
  if (reset) tablePage.value = 1
  tableLoading.value = true
  try {
    const { data } = await apiAuth.get('/user/all', {
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0]?.key || 'createdAt',
        sortOrder: tableSortBy.value[0]?.order || 'desc',
        search: tableSearch.value,
        role: 0
      }
    })
    tableItems.value.splice(0, tableItems.value.length, ...data.result.data)
    tableItemsLength.value = data.result.memberTotal
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red-lighten-1'
      }
    })
  }
  tableLoading.value = false
}

// 初始加載表格數據
tableLoadItems()

// 刪除會員
const deleteProduct = async () => {
  if (!dialog.value.id) return

  try {
    isSubmitting.value = true
    await apiAuth.delete(`/user/${dialog.value.id}`)

    createSnackbar({
      text: '刪除成功',
      snackbarProps: {
        color: 'teal-darken-1'
      }
    })
    closeDialog()
    closeConfirmDialog()
    tableLoadItems(true)
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red-lighten-1'
      }
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
  @import '/src/styles/settings.scss';
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
