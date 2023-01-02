<template>
  <a-tree
    v-if="treeData.length"
    :checkable="true"
    :check-strictly="true"
    :default-checked-keys="checkedKeys"
    :fieldNames="{
      key: 'roleId',
      title: 'name',
      children: 'roleList',
    }"
    :data="treeData"
  />
</template>

<script setup lang="ts">
import { reqAuthorityList } from "@/axios/index";
import { computed, onMounted, ref } from "@vue/runtime-core";
const checkedKeys = ref<number[]>(
  JSON.parse(sessionStorage.getItem("authority") as string)
);
console.log("checkedKeys", checkedKeys);

const res = ref();
const treeData = computed(() => (res.value ? res.value.data.data : []));

onMounted(() => {
  getAuthorityList();
});
async function getAuthorityList() {
  res.value = await reqAuthorityList();
  console.log(res.value);
}
</script>

<style scoped lang="less"></style>
