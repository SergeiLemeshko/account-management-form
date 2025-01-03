import { ref } from 'vue';
import { defineStore } from 'pinia';
import { type IAccount } from '@/lib/types';

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<IAccount[]>([]);

  const loadAccounts = () => {
    const savedAccounts = localStorage.getItem('accounts');
    accounts.value = savedAccounts ? JSON.parse(savedAccounts) : [];
  };

  const saveAccounts = () => {
    localStorage.setItem('accounts', JSON.stringify(accounts.value));
  };

  const addAccount = (account: IAccount) => {
    accounts.value.push(account);
    saveAccounts();
  };

  const removeAccount = (index: number) => {
    accounts.value = accounts.value.filter((_, i) => i !== index);
    saveAccounts();
  };

  const updateAccount = (index: number, updatedAccount: IAccount) => {
    accounts.value[index] = updatedAccount;
    saveAccounts();
  };

  return {
    accounts,
    loadAccounts,
    saveAccounts,
    addAccount,
    removeAccount,
    updateAccount,
  };
});
