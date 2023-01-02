<template>
	<view class="container">
		<image v-if="!isLoading" :src="playList.coverImgUrl"
			style="position: fixed;top:0;width: 100%;height: 100vh;filter:blur(20rpx);opacity: .9;" />
		<musichead title="歌单" :style="{color:isLoading?'#000':'#fff'}" />
		<scroll-view scroll-y="true" style="height: calc(100vh - 150rpx); overflow: hidden;" v-if="!isLoading">
			<view class="header">
				<view class="playlist-info">
					<view class="img">
						<image :src="playList.coverImgUrl" />
						<view class="count">
							<view class="iconfont icon-yousanjiao" />
							<text>{{playCount}}</text>
						</view>
					</view>

					<view class="header-info">
						<view class="name">{{playList.name}}</view>
						<view class="creator">
							<image :src="playList.creator.avatarUrl" />
							<view class="creator-name">{{playList.creator.nickname}}</view>
						</view>
						<view class="info">{{playList.description}}&nbsp;&gt;</view>
					</view>
				</view>
				<!--#ifdef MP-WEIXIN-->
				<view class="share">
					<view class="iconfont icon-fenxiang" />
					<text>分享给微信好友</text>
				</view>
				<!--#endif-->
			</view>
			<view class="sing-list">
				<view class="all" @tap="handlePlayAll()">
					<view class="iconfont icon-play" />
					<text>播放全部<text
							style="margin-left:10rpx;color: #a7a5a8;font-size: 28rpx;">(共{{playList.tracks.length}}首)</text></text>
				</view>
				<view v-for="(item,index) in playList.tracks" :key="index" class="sing" @tap="handleToDetail(item.id)">
					<view class="index" style="width: 70rpx;color: #a7a5a8;">{{index+1}}</view>
					<view class="sing-info">
						<view class="name">{{item.name}}</view>
						<view class="singer">
							<image v-if="privileges[index].flag>260" src="../../static/dujia.png" mode="widthFix"
								class="icon" />
							<image v-if="privileges[index].playMaxbr===999000" src="../../static/sq.png" mode="widthFix"
								class="icon" />
							<text v-for="(singer,index) in item.ar" :key="index"
								v-if="index<1">{{singer.name}}
								<text v-if="item.ar.length>1"
									style="margin-left: 5rpx;">等{{item.ar.length}}人</text></text>
							<text style="margin: 0 7rpx;">-</text>{{item.name}}
						</view>
					</view>
					<view class="iconfont icon-24gl-playCircle" style="color: #a7a5a8; font-size: 60rpx;" />
				</view>
			</view>
		</scroll-view>

	</view>
</template>

<script>
	import musichead from "@/components/musichead/musichead.vue"
	import {
		playList
	} from "../../common/api.js"
	export default {
		components: {
			musichead
		},
		data() {
			const routes = getCurrentPages();
			const curRoute = routes[routes.length - 1].route
			return {
				playList: {},
				privileges: [],
				curRoute
			}
		},
		computed: {
			playCount() {
				return this.count(this.playList.playCount)
			},
			isLoading() {
				if (JSON.stringify(this.playList) === "{}") {
					return true
				} else {
					return false
				}
			}
		},
		onLoad(options) {
			uni.showLoading({
				title: "加载中..."
			})
			playList(options.id, this.getPlayList)
		},
		methods: {
			getPlayList(data) {
				this.playList = data.playlist
				this.privileges = data.privileges
				uni.hideLoading()
				this.$store.commit('SETPLAYLIST', data.playlist.trackIds)
			},
			handleToDetail(id) {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${id}`
				})
			},
			count(num) {
				if (num >= 10000 && num < 100000000) {
					return ((num / 10000).toFixed(1) + "万")
				} else if (num >= 100000000) {
					return ((num / 100000000).toFixed(1) + "亿")
				} else {
					return num
				}
			},
			handlePlayAll() {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${this.playList.trackIds[0].id}`
				})
			}

		}
	}
</script>

<style lang="less" scoped>
	.header {
		padding: 50rpx 0;

		.playlist-info {
			display: flex;
			width: 90%;
			margin: 0 auto;
			margin-bottom: 40rpx;

			.img {
				position: relative;

				image {
					flex-shrink: 0;
					width: 250rpx;
					height: 250rpx;
					border-radius: 20rpx;


				}

				.count {
					position: absolute;
					top: 15rpx;
					right: 10rpx;
					display: flex;
					color: #fff;
					font-size: 20rpx;
					line-height: 20rpx;

					.iconfont {
						font-size: 20rpx;
					}
				}
			}


			.header-info {
				margin-left: 40rpx;
				color: #f0f2f7;
				font-size: 35rpx;

				.creator {
					display: flex;
					align-items: center;
					margin: 20rpx 0;
					font-size: 26rpx;
					font-weight: 300;

					image {
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						margin-right: 10rpx;
					}
				}

				.info {
					font-weight: 200;
					font-size: 25rpx;
					line-height: 38rpx;
				}
			}
		}

		.share {
			display: flex;
			justify-content: center;
			width: 380rpx;
			margin: 0 auto;
			margin-bottom: 40rpx;
			background-color: rgba(0, 0, 0, 0.4);
			border-radius: 45rpx;
			color: #f0f2f7;
			font-weight: 300;
			line-height: 90rpx;
			font-size: 29rpx;

			.iconfont {
				font-size: 30rpx;
				margin-right: 10rpx;
			}
		}
	}

	.sing-list {
		border-radius: 50rpx 50rpx 0 0;
		position: relative;
		top: -40rpx;
		background-color: #fff;
		padding: 20rpx 30rpx 0;

		.all {
			display: flex;
			align-items: center;
			position: sticky;
			top: 0;
			height: 80rpx;
			background-color: #fff;
			font-size: 35rpx;
			z-index: 99;

			.iconfont {
				margin-right: 15rpx;
				font-size: 60rpx;
			}
		}

		.sing {
			display: flex;
			align-items: center;
			padding-top: 40rpx;

			&:last-of-type {
				padding-bottom: 40rpx;
			}

			.sing-info {
				flex: 1;

				.name {
					line-height: 50rpx;
					text-overflow: ellipsis;
				}

				.singer {
					display: flex;
					align-items: center;
					font-size: 20rpx;
					color: #aeadaf;
					text-overflow: ellipsis;

					.icon {
						width: 40rpx;
						margin-right: 8rpx;
					}
				}
			}
		}
	}
</style>
