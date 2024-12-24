<template>
  <div class="form-item">
    <Form
      novalidate
      layout="inline"
    >
      <AntForm layout="inline">
        <FormItem
          label="Метки"
          v-bind="labelFieldProps"
        >
          <Input
            name="labels"
            :value="labelFieldValue"
            :maxlength="50"
            placeholder="Labels"
            @input="addingValuesFromInput('labels', $event.target.value)"
            @blur="updateLabels"
          />
        </FormItem>
        <FormItem
          label="Тип записи"
          v-bind="typeFieldProps"
          required
        >
          <Select
            v-model:value="typeFieldValue"
            allow-clear
            placeholder="Выберите значение"
            :options="typeOptions"
            hide-tooltip
            @change="updateType"
          />
        </FormItem>
        <FormItem
          label="Логин"
          required
          v-bind="loginFieldProps"
        >
          <Input
            name="login"
            :value="loginFieldValue"
            :maxlength="100"
            placeholder="Login"
            @input="addingValuesFromInput('login', $event.target.value)"
            @blur="updateLogin"
          />
        </FormItem>
        <FormItem
          v-if="typeFieldValue === 'Локальная' || typeFieldValue === ''"
          label="Пароль"
          required
          v-bind="passwordFieldProps"
        >
          <Input
            name="password"
            :value="passwordFieldValue"
            :maxlength="100"
            placeholder="Password"
            @input="addingValuesFromInput('password', $event.target.value)"
            @blur="updatePassword"
          />
        </FormItem>
        <Button @click="removeAccount">Удалить</Button>
      </AntForm>
    </Form>
  </div>
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { antConfig } from '@/lib/antConfig';
import { defineProps, computed } from 'vue';
import { useForm, Form } from 'vee-validate';
import { useAccountsStore } from '@/stores/accountStore';
import type { IAccount, IAccountForm, TypeRecord } from '@/lib/types';
import type { DefaultOptionType, SelectValue } from 'ant-design-vue/es/select';
import { Input, FormItem, Form as AntForm, Select, Button } from 'ant-design-vue';

const props = defineProps<{
  index: number;
  account: IAccount;
}>();

const store = useAccountsStore();
const account = computed(() => store.accounts[props.index]);

interface IOption extends DefaultOptionType {
  value: TypeRecord;
}

const typeOptions: IOption[] = [
  { value: 'LDAP', label: 'LDAP', title: '' },
  { value: 'Локальная', label: 'Локальная', title: '' },
];

const updateLogin = () => {
  store.updateAccount(props.index, {
    ...account.value,
    login: loginFieldValue.value as string,
  });
};

const updatePassword = () => {
  if (typeFieldValue.value === 'LDAP') {
    // Устанавливаем пароль в null, если выбран LDAP
    store.updateAccount(props.index, {
      ...account.value,
      password: null,
    });
  } else {
    store.updateAccount(props.index, {
      ...account.value,
      password: passwordFieldValue.value as string,
    });
  }
};

const updateType = (value: SelectValue) => {
  // Проверяем, что значение — это строка
  if (typeof value === 'string') {
    store.updateAccount(props.index, {
      ...account.value,
      type: value,
    });
    updatePassword();
  }
};

const updateLabels = () => {
  // Получаем массив меток из значения поля ввода
  const labelArray = String(labelFieldValue.value)
    .split(';')
    .map((label) => {
      const trimmedLabel = label.trim();
      return trimmedLabel ? { text: trimmedLabel } : null;
    })
    .filter(Boolean); // Убираем пустые значения

  // Добавляем ';' в конце каждой метки, если его нет
  const updatedLabelArray = labelArray.map((item) => {
    return {
      text: item?.text.endsWith(';') ? item.text : item?.text + ';',
    };
  });

  // Обновляем значение labelFieldValue, чтобы отобразить изменения в инпуте
  labelFieldValue.value = updatedLabelArray.map((item) => item.text).join(' ');

  store.updateAccount(props.index, {
    ...account.value,
    labelArray: updatedLabelArray,
  });
};

const removeAccount = () => {
  store.removeAccount(props.index);
};

// Для отображения меток в инпуте, так как inputу нужна строка, а не массив
const labelsData = computed(() => {
  // Если labelArray пустой, вернуть пустую строку
  if (!props.account.labelArray || props.account.labelArray.length === 0) {
    return '';
  }

  // Проверка каждого элемента и добавление ';' только если его нет
  return props.account.labelArray
    .map((item) => {
      const text = item.text.trim();
      return text.endsWith(';') ? text : `${text}`;
    })
    .join(' ');
});

const validationSchema = yup.object({
  login: yup.string().required(),
  password: yup.string().required(),
  type: yup.string().required(),
});

const initialValues = computed<IAccountForm>(() => {
  return {
    login: props.account.login || '',
    password: props.account.password || '',
    labels: labelsData.value,
    type: props.account.type,
  };
});

const { defineField } = useForm({
  validationSchema: validationSchema,
  initialValues: initialValues.value,
});

const [loginFieldValue, loginFieldProps] = defineField('login', antConfig);
const [passwordFieldValue, passwordFieldProps] = defineField('password', antConfig);
const [labelFieldValue, labelFieldProps] = defineField('labels', antConfig);
const [typeFieldValue, typeFieldProps] = defineField<'type', string>('type', antConfig);

const addingValuesFromInput = (field: string, value: string = '') => {
  if (field === 'login') {
    loginFieldValue.value = value;
  } else if (field === 'password') {
    passwordFieldValue.value = value;
  } else if (field === 'labels') {
    let labelsValue = value;
    // Удаляем пробелы в начале строки
    labelsValue = labelsValue.replace(/^\s+/, '');
    // Удаляем лишние пробелы после ';' и добавляем один пробел
    labelsValue = labelsValue.replace(/;\s+/g, '; ');
    // Удаляем все пробелы, которые не идут после ';'
    labelsValue = labelsValue.replace(/(?<!;)\s+/g, '');
    // Не допускаем ввода других символов после ';'
    labelsValue = labelsValue.replace(/;[^;\s]+/g, ';');
    labelFieldValue.value = labelsValue;
  }
};
</script>

<style scoped>
.form-item {
  margin-bottom: 1rem;
}
</style>

<!-- валидацияю селекта также сделал, так как в задании указано: "для текстовых - потеря фокуса, для селекта - изменение значения, 
происходит валидация обязательных полей", соответственно прихожу к выводу, что для селекта она нужна -->
