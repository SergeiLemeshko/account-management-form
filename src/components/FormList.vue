<template>
  <div class="forms">
    <section class="forms__header">
      <h3>{{ CONTENT_IN_FORM_LIST.accounts }}</h3>
      <Button
        type="primary"
        @click="addAccount"
      >
        <template #icon>
          <PlusOutlined />
        </template>
      </Button>
    </section>
    <template v-if="store.accounts.length">
      <section class="forms__hints">
        <QuestionCircleOutlined style="font-size: 16px; color: #066ecf" />
        <p>{{ CONTENT_IN_FORM_LIST.hint }}</p>
      </section>
      <section class="forms__headlines">
        <span>{{ CONTENT_IN_FORM_LIST.labels }}</span>
        <span>{{ CONTENT_IN_FORM_LIST.type }}</span>
        <span>{{ CONTENT_IN_FORM_LIST.login }}</span>
        <span>{{ CONTENT_IN_FORM_LIST.password }}</span>
      </section>
    </template>

    <div
      v-for="(item, index) in accounts"
      :key="item.id"
    >
      <FormItem
        :account="item"
        :index="index"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FormItem from './FormItem.vue';
import { Button } from 'ant-design-vue';
import { CONTENT_IN_FORM_LIST } from '../lib/config';
import { useAccountsStore } from '@/stores/accountStore';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';

const store = useAccountsStore();

const accounts = computed(() => store.accounts);

const addAccount = () => {
  store.addAccount({
    id: Date.now(),
    labelArray: [{ text: '' }],
    type: '',
    login: '',
    password: null,
  });
};
</script>

<style scoped lang="scss">
.forms {
  display: flex;
  flex-direction: column;
  margin-top: 50px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 20px;

    h3 {
      margin-right: 15px;
      color: rgb(34, 61, 85);
    }
  }

  &__hints {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    background-color: rgb(219, 237, 247);
    max-width: 645px;
    height: 20px;
    padding-left: 10px;
    color: rgb(82, 81, 80);

    p {
      margin-left: 5px;
    }
  }

  &__headlines {
    display: flex;
    max-width: 800px;
    margin-bottom: 12px;

    span {
      flex: 1;
      text-align: start;
      color: rgb(141, 141, 141);
    }
  }
}
</style>
