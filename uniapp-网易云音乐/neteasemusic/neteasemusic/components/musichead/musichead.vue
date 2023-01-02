<template>
	<view class="head">
		<view class="icon" v-if="!isHome"
			:style="{backgroundColor:isSearch?'':'rgba(0,0,0,.4)',border:isSearch?'2rpx solid #000':'none'}">
			<view class="iconfont icon-zuojiantou" @tap="handleToBack" />
			<text>|</text>
			<view class="iconfont icon-shouye" @tap="handleToHome" />
		</view>
		<view>{{title}}</view>
	</view>
</template>

<script>
	export default {
		name: "musichead",
		props: ['title'],
		data() {
			const routes = getCurrentPages();
			const curRoute = routes[routes.length - 1].route
			const isHome = curRoute === "pages/index/index" ? true : false
			const isSearch = curRoute === "pages/search/search" ? true : false
			return {
				isHome,
				isSearch,
				routes,
				curRoute
			};
		},
		methods: {
			handleToBack() {
				if (this.curRoute.includes('detail')) {
					this.routes.forEach((item, index) => {
						if (item.route.includes('detail') && !this.routes[index - 1].route.includes('detail')) {
							const step = this.routes.length - index
							uni.navigateBack({
								delta: step
							})
						}
					})
				} else {
					uni.navigateBack()
				}
			},
			handleToHome() {
				uni.navigateTo({
					url: "/pages/index/index"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.head {
		position: relative;
		height: 150rpx;
		text-align: center;
		line-height: 150rpx;

		.icon {
			position: absolute;
			left: 16rpx;
			top: 50%;
			transform: translateY(-30rpx);
			display: flex;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 30rpx;

			.iconfont {
				padding: 0 25rpx;
			}
		}
	}
</style>
