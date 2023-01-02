<template>
	<view class="index">
		<musichead title="网易云音乐" style="background-color: #fff;color: #000;" />
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="search" @tap="handleSearch">
					<text class="iconfont icon-sousuo" />
					<input placeholder="搜索歌曲" type="text" />
				</view>
				<view v-if="isLoading">
					<skeleton avatarShape="round" avatarSize="212rpx" avatar="left" :row="3" animate :loading="isLoading">
					</skeleton>
					<skeleton avatarShape="round" avatarSize="212rpx" avatar="left" :row="3" animate :loading="isLoading">
					</skeleton>
					<skeleton avatarShape="round" avatarSize="212rpx" avatar="left" :row="3" animate :loading="isLoading">
					</skeleton>
					<skeleton avatarShape="round" avatarSize="212rpx" avatar="left" :row="3" animate :loading="isLoading">
					</skeleton>
				</view>
				<view v-for="(item,index) in topList" :key="index" class="toplist-item" v-if="index<=3"
					@tap="handleToList(item.id)" v-show="!isLoading">
					<image :src="item.coverImgUrl" class="img" />
					<view class="sing-list">
						<view v-for="(item,index) in item.tracks" :key="index">
							<view class="sing">{{index+1}}.{{item.first}}-{{item.second}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>

</template>

<script>
	import musichead from "@/components/musichead/musichead.vue"
	import skeleton from "../../components/xinyi-skeleton/skeleton.vue"
	import {
		topList
	} from "../../common/api.js"
	export default {
		components: {
			musichead,
			skeleton
		},
		data() {
			return {
				title: 'Hello',
				topList: [],
				isLoading: true
			}
		},
		onLoad() {
			topList(this.getTopList)
		},
		methods: {
			getTopList(topList) {
				this.topList = topList
				this.isLoading = false
			},
			handleToList(id) {
				uni.navigateTo({
					url: `/pages/list/list?id=${id}`
				})
			},
			handleSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: calc(100vh - 150rpx);
		overflow: hidden;

		scroll-view {
			height: 100%;

			.search {
				display: flex;
				align-items: center;
				height: 70rpx;
				width: 90%;
				padding: 0 30rpx;
				margin: 30rpx auto;
				margin-top: 70rpx;
				border-radius: 35rpx;
				background-color: #f7f7f7;

				.iconfont {
					color: #aeadaf;

					&::before {
						vertical-align: top;
					}
				}

				input {
					flex: 1;
					margin-left: 26rpx;
					font-size: 28rpx;
				}
			}

			.toplist-item {
				display: flex;
				align-items: center;
				width: 90%;
				margin: 0 auto;
				margin-top: 40rpx;
				font-size: 26rpx;

				.img {
					flex-shrink: 0;
					width: 212rpx;
					height: 212rpx;
					border-radius: 20rpx;
				}

				.sing-list {
					flex: 1;
					margin-left: 30rpx;

					.sing {
						width: 433rpx;
						line-height: 60rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
			}
		}
	}
</style>
