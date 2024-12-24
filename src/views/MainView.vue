<template>
  <main>
    <FormList />
  </main>
</template>

<script setup lang="ts">
import { useAccountsStore } from '@/stores/accountStore';
import FormList from '../components/FormList.vue';
import { onMounted } from 'vue';

const store = useAccountsStore();

onMounted(() => {
  store.loadAccounts();
});
</script>
