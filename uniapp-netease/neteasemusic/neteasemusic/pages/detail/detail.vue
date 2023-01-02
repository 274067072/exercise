<template>
	<view v-if="!isLoading">
		<image :src="song.al.picUrl" style="position: fixed;width: 100%;height: 100vh;filter: blur(80rpx);" />
		<musichead :title="song.name" :style="{color:isLoading?'#000':'#fff'}" />
		<scroll-view style="height: calc(100vh - 150rpx);overflow: hidden;" scroll-y="true">
			<view class="play">
				<view class="logo">
					<image src="../../static/wangyiyunyinyue.png" />
					<text>网易云音乐</text>
				</view>
				<image class="needle" src="../../static/needle.png" mode="widthFix" />
				<view :class="['disc',{'disc-pause':isPause}]" @tap="isPause=!isPause">
					<image class="song-pic" :src="song.al.picUrl" />
				</view>
				<view class="pause" v-show="isPause" @tap="isPause=!isPause">
					<view class="bg" />
					<view class="iconfont icon-play" />
				</view>
			</view>
			<view class="lyric-container" ref="container">
				<view class="lyric-list" :style="{transform:`translateY(-${(currentIndex-1)*80}rpx)`}">
					<view :class="['lyric',{'current':currentIndex===index}]" v-for="(item,index) in lyric" :key="index"
						ref="lyrics" :style="{transition:`transform ${transitionTime}s linear`}">
						{{item.lyric}}
					</view>
				</view>
			</view>
			<view style="margin: 0 30rpx;color: #fff;">
				<view style="font-size: 38rpx;">喜欢这首歌的人也在听</view>
				<view v-if="simiSongs.length" v-for="(item,index) in simiSongs" :key="index" class="sing"
					@tap="handleToDetail(item.privilege.id)">
					<image :src="item.album.picUrl"
						style="width: 80rpx;height: 80rpx; border-radius: 10rpx;margin-right: 30rpx;" />
					<view class="sing-info">
						<view class="name">{{item.name}}</view>
						<view class="singer">
							<image v-if="item.privilege.flag>260" src="../../static/dujia.png" mode="widthFix"
								class="icon" />
							<image v-if="item.privilege.playMaxbr===999000" src="../../static/sq.png" mode="widthFix"
								class="icon" />
							<text v-for="(singer,index) in item.album.artists" :key="index"
								v-if="index<1">{{singer.name}}
								<text v-if="item.album.artists.length>1"
									style="margin-left: 5rpx;">等{{item.album.artists.length}}人</text></text>
							<text style="margin: 0 7rpx;">-</text>{{item.name}}
						</view>
					</view>
					<view class="iconfont icon-24gl-playCircle" style="font-size: 60rpx;" />
				</view>
			</view>

		</scroll-view>
	</view>
</template>

<script>
	import {
		songDetail,
		lyric,
		songUrl,
		simiSong
	} from "../../common/api.js"
	import musichead from "@/components/musichead/musichead.vue"
	import {
		nextTick
	} from "vue"
	export default {
		components: {
			musichead
		},
		data() {
			return {
				song: {},
				lyric: [],
				url: "",
				simiSongs: [],
				isPause: true,
				bgAudioManager: null,
				currentIndex: null,
				transitionTime: null,
				timeInt: null
			}
		},
		computed: {
			isLoading() {
				if (JSON.stringify(this.song) === "{}" || JSON.stringify(this.lyric) === "[]" || this
					.url.length == 0 || JSON.stringify(this.simiSongs) === "[]") {
					return true
				} else {
					uni.hideLoading()
					this.bindBgAudioManager(this.song, this.url)
					return false
				}
			}
		},
		watch: {
			isPause(newVal) {
				newVal === true ? this.bgAudioManager?.pause() : this.bgAudioManager?.play()
			},
			currentIndex(newVal) {
				if (newVal) {
					this.$nextTick(() => {
						const containerWidth = this.$refs.container.$el.offsetWidth
						const currentWidth = this.$refs.lyrics[newVal].$el.offsetWidth
						const x = (currentWidth - containerWidth) >= 0 ? currentWidth - containerWidth : 0
						if (newVal >= this.lyric.length - 1) {
							this.transitionTime = (this.bgAudioManager.duration - this.lyric[newVal].time) / 2
						} else {
							this.transitionTime = (this.lyric[newVal + 1].time - this.lyric[newVal].time) / 2
						}
						this.$refs.lyrics[newVal].$el.style.transform = `translateX(-${x}px)`
					})
				}
			}
		},
		onLoad(options) {
			uni.showLoading({
				title: "加载中..."
			})
			songDetail(options.id, this.getDetail)
			lyric(options.id, this.getLyric)
			songUrl(options.id, this.getUrl)
			simiSong(options.id, this.getSimiSong)
			this.$store.commit('SETCURRENTID', options.id)
		},
		onUnload() {
			clearInterval(this.timeInt)
		},
		onHide() {
			this.init()
		},
		methods: {
			getDetail(song) {
				this.song = song
			},
			getLyric(lyric) {
				let result = []
				const reg = /\[(.+)\](.+)/g
				lyric.replace(reg, ($0, $1, $2) => {
					result.push({
						time: this.formatTimeToSec($1),
						lyric: $2
					})
				})
				this.lyric = result
			},
			getUrl(songUrl) {
				this.url = songUrl.url
			},
			getSimiSong(songs) {
				this.simiSongs = songs
			},
			formatTimeToSec(time) {
				const timeArr = time.split(":")
				const newTime = parseInt(timeArr[0]) * 60 + parseFloat(timeArr[1])
				return newTime
			},
			createAudio(song, url) {
				// #ifdef MP-WEIXIN
				const bgAudioManager = uni.getBackgroundAudioManager();
				bgAudioManager.title = song.name;
				bgAudioManager.singer = song.ar.name;
				bgAudioManager.coverImgUrl = song.al.picUrl;
				// #endif

				// #ifdef H5
				const bgAudioManager = uni.createInnerAudioContext();
				// #endif
				bgAudioManager.src = url;
				this.$store.commit('SETBGM', bgAudioManager)
				this.bgAudioManager = bgAudioManager

			},
			bindBgAudioManager(song, url) {
				const bgm = this.$store.state.bgm
				if (bgm?.src === url) {
					this.bgAudioManager = bgm
				} else {
					bgm?.stop()
					this.createAudio(song, url)
				}
				this.isPause = false
				this.getCurrentIndex()
			},
			getCurrentIndex() {
				const timeInt = setInterval(() => {
					const duration = this.bgAudioManager.duration
					const currentTime = this.bgAudioManager.currentTime
					if (currentTime >= this.lyric[this.lyric.length - 1].time) {
						this.currentIndex = this.lyric.length - 1
						if (currentTime === duration) {
							this.init()
							this.playNext()
						}
						return
					}
					this.lyric.forEach((item, index) => {
						if (currentTime >= item.time && currentTime < this.lyric[index + 1].time) {
							this.currentIndex = index
						}
					})
				}, 500)

				this.timeInt = timeInt
			},
			playNext() {
				const playlist = this.$store.state.playlist
				const currentId = this.$store.state.currentId

				playlist.forEach((item, index) => {
					if (item.id == currentId) {
						if (index === playlist.length - 1) {
							uni.navigateTo({
								url: `/pages/detail/detail?id=${playlist[0].id}`
							})
						} else {
							uni.navigateTo({
								url: `/pages/detail/detail?id=${playlist[index+1].id}`
							})
						}
					}
				})
			},
			handleToDetail(id) {
				// this.init()
				uni.redirectTo({
					url: `/pages/detail/detail?id=${id}`
				})
			},
			init() {
				clearInterval(this.timeInt)
				this.song = {}
				this.lyric = []
				this.url = ""
				this.simiSongs = []
				this.isPause = true
				this.bgAudioManager = null
				this.currentIndex = null
				this.transitionTime = null
				this.timeInt = null
			}
		}
	}
</script>

<style scoped lang="less">
	.play {
		position: relative;
		padding-top: 214rpx;

		.logo {
			display: flex;
			align-items: center;
			position: absolute;
			top: 30rpx;
			left: 30rpx;
			color: #fff;

			image {
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
				margin-right: 10rpx;
			}
		}

		.needle {
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50rpx);
			width: 240rpx;
			z-index: 99;
		}

		@keyframes play {
			0% {
				transform: rotate(0);
			}

			100% {
				transform: rotate(360deg);
			}
		}

		.disc-pause {
			animation-play-state: paused !important;
		}

		.disc {
			position: relative;
			display: block;
			width: 580rpx;
			height: 580rpx;
			background: url("../../static/disc.png") no-repeat center;
			background-size: contain;
			margin: 0 auto;
			overflow: hidden;
			animation: play 10s linear 0s infinite forwards;

			.song-pic {
				display: block;
				width: 360rpx;
				height: 360rpx;
				margin: 110rpx auto;
				border-radius: 50%;
			}
		}

		.pause {
			.iconfont {
				position: absolute;
				top: 504rpx;
				left: 50%;
				transform: translate(-50%, -50%);
				color: #fff;
				font-size: 120rpx;
			}

			.bg {
				position: absolute;
				top: 504rpx;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 105rpx;
				height: 105rpx;
				background-color: rgba(0, 0, 0, .4);
				border-radius: 50%;
			}
		}


	}

	.lyric-container {
		height: 240rpx;
		overflow: hidden;
		margin: 100rpx 70rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 35rpx;
		color: rgba(255, 255, 255, 0.3);

		.lyric-list {
			transition: all .4s ease;

			.lyric {
				display: block;
				white-space: nowrap;
			}

			.current {
				display: inline-block !important;
				color: #fff;
			}
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
				font-size: 22rpx;
				color: #a7a5a8;
				text-overflow: ellipsis;

				.icon {
					width: 40rpx;
					margin-right: 8rpx;
				}
			}
		}
	}
</style>
