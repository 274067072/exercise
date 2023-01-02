<template>
  <div class="dropdown">
    <div @mouseleave="hideDetails()" @click="search($event)">
      <div class="all" @mouseenter="changeIsShow">全部商品分类</div>
      <Transition>
        <ul v-show="isShow">
          <li
            class="c1"
            v-for="c1 in categoryList"
            :key="c1.categoryId"
            @mouseover="changeHoverId(c1.categoryId)"
          >
            <p
              :data-categoryname="c1.categoryName"
              :data-category1Id="c1.categoryId"
            >
              {{ c1.categoryName }}
            </p>
            <div class="details" v-show="hoverId === c1.categoryId">
              <div v-for="c2 in c1.categoryChild" :key="c2.categoryId">
                <h4
                  :data-categoryname="c2.categoryName"
                  :data-category2Id="c2.categoryId"
                >
                  {{ c2.categoryName }}
                </h4>
                <ul>
                  <li v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                    <a
                      href="javascript:;"
                      :data-categoryname="c3.categoryName"
                      :data-category3Id="c3.categoryId"
                      >{{ c3.categoryName }}</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </Transition>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import throttle from "lodash/throttle";
import combineArgu from "@/hooks/combineArgu";
export default {
  name: "Dropdown",
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const isShow = ref(true);
    const hoverId = ref(0);

    const categoryList = computed(() => store.state.dropdown.categoryList);

    onMounted(() => {
      if (route.path !== "/home" && route.path !== "/") {
        hoverId.value = 0;
        isShow.value = false;
      } else {
        isShow.value = true;
      }
    });

    function changeIsShow() {
      isShow.value = true;
    }

    const changeHoverId = throttle((id) => {
      hoverId.value = id;
    }, 50);
    function hideDetails() {
      hoverId.value = 0;
      if (route.path !== "/home" && route.path !== "/") {
        hoverId.value = 0;
        isShow.value = false;
      }
    }

    function search(e) {
      const target = e.target;
      if (target.dataset.categoryname) {
        const { categoryname, category1id, category2id, category3id } =
          target.dataset;
        let location = {};
        if (category1id) {
          location = combineArgu(route, "search", {
            categoryName: categoryname,
            category1Id: category1id,
          });
        } else if (category2id) {
          location = combineArgu(route, "search", {
            categoryName: categoryname,
            category2Id: category2id,
          });
        } else {
          location = combineArgu(route, "search", {
            categoryName: categoryname,
            category3Id: category3id,
          });
        }
        router.push(location);
      }
    }

    return {
      categoryList,
      hoverId,
      changeHoverId,
      isShow,
      hideDetails,
      search,
      changeIsShow,
    };
  },
};
</script>

<style scoped lang="less">
.v-enter-from {
  opacity: 0;
}
.v-enter-to {
  opacity: 1;
}
.v-enter-active {
  transition: all 0.2s linear;
}
.dropdown {
  position: relative;
  top: -45px;
  width: 208px;
  height: 45px;
  background-color: #b1191a;
  margin-right: 10px;
  z-index: 2;
  .all {
    width: 100%;
    height: 45px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    line-height: 45px;
    cursor: pointer;
  }
  ul {
    .c1 {
      width: 100%;
      height: 30px;
      background-color: #c81623;
      font-size: 14px;
      color: #fff;
      line-height: 30px;
      p {
        padding-left: 10px;
        cursor: pointer;
        &:hover {
          background-color: #fff;
          color: #c81623;
        }
      }
    }
  }
  .details {
    position: absolute;
    top: 45px;
    left: 100%;
    padding: 10px;
    background-color: rgb(248, 248, 248);
    width: 731px;
    height: 510px;
    border: 1px solid #999;
    border-left: none;
    div {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8px;
      &:last-of-type {
        margin: 0;
      }
      h4 {
        color: #333;
        flex: 1;
        height: 25px;
        line-height: 25px;
        cursor: pointer;
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        width: 630px;
        li {
          padding: 0 10px;
          line-height: 25px;
        }
      }
    }
  }
}
</style>
