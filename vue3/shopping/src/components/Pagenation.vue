<template>
  <div class="button_container">
    <button
      class="before"
      :class="{ disabled: pageNo === startAndEnd.start }"
      @click="beforePage"
    >
      上一页
    </button>
    <button class="first" v-show="startAndEnd.start > 1" @click="jumpPage(1)">
      1
    </button>
    <button
      class="beforeOmit"
      v-show="startAndEnd.start > 2"
      @click="jumpBeforeOmit(pageNo)"
    >
      ...
    </button>
    <button
      v-for="page of startAndEnd.end"
      :key="page"
      v-show="page >= startAndEnd.start"
      :class="{ current: page === pageNo }"
      @click="jumpPage(page)"
    >
      {{ page }}
    </button>
    <button
      class="nextOmit"
      v-show="startAndEnd.end < totalPages - 1"
      @click="jumpNextOmit(pageNo)"
    >
      ...
    </button>
    <button
      class="last"
      v-show="startAndEnd.end < totalPages"
      @click="jumpPage(totalPages)"
    >
      {{ totalPages }}
    </button>
    <button
      class="next"
      :class="{ disabled: pageNo === startAndEnd.end }"
      @click="nextPage()"
    >
      下一页
    </button>
  </div>
</template>

<script>
import { computed } from "vue";
export default {
  name: "Pagenation",
  props: ["continues", "pageNo", "totalPages"],
  emits: ["changePageNo"],
  setup(props, { emit }) {
    const continues = props.continues;
    const pageNo = computed(() => props.pageNo);
    const totalPages = computed(() => props.totalPages);
    const startAndEnd = computed(() => {
      let start = 0;
      let end = 0;
      if (totalPages.value <= continues) {
        start = 1;
        end = totalPages.value;
      } else {
        start = pageNo.value - parseInt(continues / 2);
        end = pageNo.value + parseInt(continues / 2);
        if (start < 1) {
          start = 1;
          end = continues;
        } else if (end > totalPages.value) {
          start = totalPages.value - continues + 1;
          end = totalPages.value;
        }
      }
      return { start, end };
    });

    function nextPage() {
      if (pageNo.value >= totalPages.value) return;
      emit("changePageNo", pageNo.value + 1);
    }

    function beforePage() {
      if (pageNo.value <= 1) return;
      emit("changePageNo", pageNo.value - 1);
    }

    function jumpPage(id) {
      emit("changePageNo", id);
    }

    function jumpNextOmit(currentPageNo) {
      if (Number(currentPageNo) + Number(continues) >= totalPages.value) {
        emit("changePageNo", totalPages.value);
      }
      emit("changePageNo", Number(currentPageNo) + Number(continues));
    }

    function jumpBeforeOmit(currentPageNo) {
      if (currentPageNo - continues <= 1) {
        emit("changePageNo", 1);
      }
      emit("changePageNo", currentPageNo - continues);
    }
    return {
      pageNo,
      totalPages,
      startAndEnd,
      nextPage,
      beforePage,
      jumpPage,
      jumpNextOmit,
      jumpBeforeOmit,
    };
  },
};
</script>

<style scoped lang="less">
.button_container {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  button {
    height: 25px;
    padding: 0 10px;
    background-color: #efefef;
    border: 1px solid #c9c9c9;
    margin: 0 5px;
    cursor: pointer;
    white-space: nowrap;
    &:hover {
      color: rgb(69, 139, 200);
    }
  }
  .current {
    background-color: rgb(255, 181, 61);
  }
  .disabled {
    color: #999;
    &:hover {
      color: #999;
    }
  }
}
</style>
