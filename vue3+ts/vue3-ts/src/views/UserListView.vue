<template>
  <a-table
    class="table"
    :columns="columns"
    :data="userList"
    :bordered="{ cell: true }"
    :loading="!userList.length"
  >
    <template #role="{ record }">
      <span v-for="(role, index) in record.role" :key="index"
        >{{ role.roleName }}<br
      /></span>
    </template>
    <template
      #userName-filter="{
        filterValue,
        setFilterValue,
        handleFilterConfirm,
        handleFilterReset,
      }"
    >
      <div class="custom-filter">
        <a-space direction="vertical">
          <a-input
            :model-value="filterValue[0]"
            @input="(value) => setFilterValue([value])"
          />
          <div class="custom-filter-footer">
            <a-button @click="handleFilterConfirm">确认</a-button>
            <a-button @click="handleFilterReset">重置</a-button>
          </div>
        </a-space>
      </div>
    </template>
    <template
      #role-filter="{
        filterValue,
        setFilterValue,
        handleFilterConfirm,
        handleFilterReset,
      }"
    >
      <div class="custom-filter">
        <a-space direction="vertical">
          <a-input
            :model-value="filterValue[0]"
            @input="(value) => setFilterValue([value])"
          />
          <div class="custom-filter-footer">
            <a-button @click="handleFilterConfirm">确认</a-button>
            <a-button @click="handleFilterReset">重置</a-button>
          </div>
        </a-space>
      </div>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { reqUserList } from "@/axios/index";
import { computed, onMounted, ref, h } from "@vue/runtime-core";
import { IconSearch } from "@arco-design/web-vue/es/icon";
import type { User } from "@/type/user";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "姓名",
    dataIndex: "userName",
    filterable: {
      filter: (value: string, record: User) => {
        return record.userName.includes(value);
      },
      slotName: "userName-filter",
      icon: () => h(IconSearch),
    },
  },
  {
    title: "角色",
    slotName: "role",
    filterable: {
      filter: (value: string, record: User) => {
        let flag = false;
        record.role.forEach((role) => {
          if (role.roleName.includes(value)) {
            flag = true;
          }
        });
        return flag;
      },
      slotName: "role-filter",
      icon: () => h(IconSearch),
    },
  },
];
const resUser = ref();
const userList = computed<User[]>(() =>
  resUser.value ? resUser.value.data.data : []
);
onMounted(() => {
  getUserList();
});
async function getUserList() {
  resUser.value = await reqUserList();
  console.log("resUser", resUser);
}
</script>

<style scoped lang="less">
.custom-filter {
  padding: 20px;
  background: var(--color-bg-5);
  border: 1px solid var(--color-neutral-3);
  border-radius: var(--border-radius-medium);
  box-shadow: 0 2px 5px rgb(0 0 0 / 10%);
}

.custom-filter-footer {
  display: flex;
  justify-content: space-between;
}
</style>
