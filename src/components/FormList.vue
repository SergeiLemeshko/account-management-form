<template>
  <div class="form-list">
    <h3>Учётные записи</h3>
    <button @click="addAccount">+</button>
    <div v-for="(item, index) in accounts" :key="index">
      <FormItem :account="item" :index="index" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FormItem from './FormItem.vue'
import { useAccountsStore } from '@/stores/accountStore'

const store = useAccountsStore()
const accounts = computed(() => store.accounts)

const addAccount = () => {
  store.addAccount({
    labelArray: [{ text: '' }],
    type: '',
    login: '',
    password: null,
  })
}
</script>

<style scoped>
.form-list {
  display: flex;
  flex-direction: column;
}
</style>
