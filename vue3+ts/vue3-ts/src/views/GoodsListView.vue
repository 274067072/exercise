<template>
  <a-table
    class="table"
    :columns="columns"
    :data="data"
    :bordered="{ cell: true }"
    :loading="!data.length"
  >
    <template
      #title-filter="{
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
      #introduce-filter="{
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
import { reqGoodsList } from "@/axios/index";
import { computed, onMounted, ref, h } from "@vue/runtime-core";
import { IconSearch } from "@arco-design/web-vue/es/icon";
import type { Goods } from "@/type/goods";
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    width: 70,
  },
  {
    title: "商品名",
    dataIndex: "title",
    width: 120,
    filterable: {
      filter: (value: string, record: Goods) => {
        return record.title.includes(value);
      },
      slotName: "title-filter",
      icon: () => h(IconSearch),
    },
  },
  {
    title: "商品信息",
    dataIndex: "introduce",
    filterable: {
      filter: (value: string, record: Goods) => {
        return record.introduce.includes(value);
      },
      slotName: "introduce-filter",
      icon: () => h(IconSearch),
    },
  },
];
let res = ref();
const data = computed<Goods[]>(() => (res.value ? res.value.data.data : []));
onMounted(() => {
  getGoodsList();
});
async function getGoodsList() {
  try {
    res.value = await reqGoodsList();
  } catch (error) {
    alert(error);
  }
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
