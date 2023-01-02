<template>
	<view>
		<musichead title='搜索' />
		<scroll-view scroll-y="true" style="height:calc(100vh - 150rpx);overflow: hidden;" v-if="!isLoading">
			<view class="search" @tap="searchList=null">
				<text class="iconfont icon-sousuo" />
				<input placeholder="搜索歌曲" type="text" v-model="inputValue" />
				<view class="iconfont icon-guanbi" v-show="inputValue.length" @tap="handleClear" />
			</view>
			<view v-show="inputValue.length">
				<view class="suggest-list" v-show="suggestList&&!searchList">
					<view class="title">搜索"{{inputValue}}"</view>
					<view class="song" v-for="(item,index) in suggestList" :key="index"
						@tap="handleSearch(item.keyword)">
						<text class="iconfont icon-sousuo" />{{item.keyword}}
					</view>
				</view>
				<view class="search-list" v-show="searchList">
					<view class="song" v-for="(item,index) in searchList" :key="index" @tap="handleToDetail(item.id)">
						<view class="info">
							<view class="name">
								{{item.name}}
							</view>
							<view class="singer">
								<text v-for="(singer,index) in item.artists" :key="index" v-if="index<1">{{singer.name}}
									<text v-if="item.artists.length>1"
										style="margin-left: 5rpx;">等{{item.artists.length}}人</text></text>
								<text style="margin: 0 7rpx;">-</text>{{item.name}}
							</view>
						</view>
						<view class="iconfont icon-24gl-playCircle" />
					</view>
				</view>
			</view>
			<view v-show="!inputValue.length">
				<view class="history" v-show="history.length">
					<view class="title">
						<view>历史记录</view>
						<view class="iconfont icon-lajitong" @tap="handleClearHistory" />
					</view>
					<view class="name-list">
						<view class="name" v-for="(keywords,index) in history" :key="index"
							@tap="handleSearch(keywords)">
							{{keywords}}
						</view>
					</view>
				</view>
				<view class="hot-list">
					<view style="color: #aeadaf; font-size: 20rpx;margin: 20rpx 0;">热搜榜</view>
					<view class="song" v-for="(item,index) in hotList" :key="index" v-if="index>0">
						<view class="index">{{index}}</view>
						<view class="info">
							<view>{{item.searchWord}}
								<image style="width: 30rpx; height:30rpx;margin-left: 10rpx;" :src="item.iconUrl"
									v-if="item.iconUrl" />
							</view>
							<view class="content">{{item.content}}</view>
						</view>
						<view class="cont">{{item.score}}</view>
					</view>
				</view>
			</view>

		</scroll-view>
	</view>
</template>

<script>
	import musichead from "../../components/musichead/musichead.vue"
	import {
		hotList,
		searchList,
		suggestList
	} from "../../common/api.js"
	export default {
		components: {
			musichead
		},
		data() {
			return {
				inputValue: '',
				hotList: [],
				searchList: null,
				suggestList: null,
				history: uni.getStorageSync('history') || []
			}
		},
		computed: {
			isLoading() {
				if (JSON.stringify(this.hotList) === '[]') {
					return true
				} else {
					return false
				}
			}
		},
		watch: {
			inputValue(newVal) {
				if (newVal.length) {
					suggestList(newVal, this.getSuggestList)
				} else {
					this.searchList = null
					this.suggestList = null
				}
			}
		},
		onLoad() {
			uni.showLoading({
				title: "加载中..."
			})
			hotList(this.getHotList)
		},
		methods: {
			getHotList(hotList) {
				this.hotList = hotList
				uni.hideLoading()
			},
			getSearchList(searchList) {
				this.searchList = searchList
			},
			getSuggestList(suggestList) {
				this.suggestList = suggestList
			},
			handleSearch(keywords) {
				this.inputValue = keywords
				this.saveHistory(keywords)
				searchList(keywords, this.getSearchList)
			},
			handleClear() {
				this.inputValue = ''
			},
			handleToDetail(id) {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${id}`
				})
			},
			saveHistory(keywords) {
				let history = uni.getStorageSync('history') || []
				history = history.filter((value) => {
					return value !== keywords
				})
				history.push(keywords)
				this.history = history
				uni.setStorageSync('history', history)
			},
			handleClearHistory() {
				this.history = []
				uni.setStorageSync('history', [])
			}
		}
	}
</script>

<style scoped lang="less">
	.search {
		display: flex;
		align-items: center;
		height: 70rpx;
		width: 90%;
		padding: 0 30rpx;
		margin: 30rpx auto;
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

	.history {
		padding: 0 30rpx;
		margin-bottom: 50rpx;

		.title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 20rpx 0;
			font-size: 20rpx;
			color: #aeadaf;
		}

		.name-list {
			display: flex;
			flex-wrap: wrap;

			.name {
				height: 60rpx;
				line-height: 60rpx;
				background-color: #f7f7f7;
				border-radius: 30rpx;
				padding: 0 30rpx;
				margin: 5rpx;
				font-size: 25rpx;
			}
		}
	}

	.suggest-list {
		margin: 0 30rpx;
		padding: 0 30rpx;

		.title {
			margin: 40rpx 0;
			color: rgb(62, 136, 197);
		}

		.song {
			color: #666;
			line-height: 80rpx;

			.iconfont {
				margin-right: 20rpx;
				color: #aeadaf;
			}
		}
	}

	.search-list {
		padding: 0 30rpx;

		.song {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 0;
			border-bottom: 1rpx solid #aeadaf;

			.info {
				.name {
					color: rgb(62, 136, 197)
				}

				.singer {
					color: #aeadaf;
					font-size: 20rpx;
				}
			}

			.iconfont {
				color: #aeadaf;

				&::before {
					font-size: 60rpx;
				}
			}
		}
	}

	.hot-list {
		padding: 0 30rpx;

		.song {
			display: flex;
			align-items: center;
			padding-bottom: 40rpx;

			.index {
				width: 60rpx;
				color: rgb(210, 40, 50);
			}

			.content {
				font-size: 20rpx;
				color: #aeadaf;
			}

			.cont {
				flex: 1;
				text-align: right;
				color: #aeadaf;
				font-size: 20rpx;
			}
		}
	}
</style>
