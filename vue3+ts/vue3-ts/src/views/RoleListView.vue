<template>
  <a-table
    class="table"
    :columns="columns"
    :data="roleList"
    :bordered="{ cell: true }"
    :loading="!roleList.length"
  >
    <template #modiffy="{ record }">
      <a-button type="outline" @click="toModdifyPermission(record)"
        >点击修改</a-button
      >
    </template></a-table
  >
  <router-view></router-view>
</template>

<script setup lang="ts">
import { reqRoleList } from "@/axios/index";
import type { Role } from "@/type/role";
import { computed, onMounted, ref } from "@vue/runtime-core";
import { useRouter } from "vue-router";

const router = useRouter();
const columns = [
  {
    title: "ID",
    dataIndex: "roleId",
  },
  {
    title: "角色名称",
    dataIndex: "roleName",
  },
  {
    title: "修改权限",
    slotName: "modiffy",
  },
];
const resRole = ref();
const roleList = computed<Role[]>(() =>
  resRole.value ? resRole.value.data.data : []
);
onMounted(() => {
  getRoleList();
});
async function getRoleList() {
  resRole.value = await reqRoleList();
}
function toModdifyPermission(record: Role) {
  const authority = JSON.stringify(record.authority);

  sessionStorage.setItem("authority", authority);
  router.push("/home/moddify");
}
</script>

<style scoped lang="less"></style>
