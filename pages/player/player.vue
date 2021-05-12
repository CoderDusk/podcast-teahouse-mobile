<template>
	<view class="main">
		<!-- <view class="cover-area">
			<image :src="episodeInfo.itunes.image" class="episode-cover"></image>
		</view> -->
		<image :src="episodeInfo.itunes.image" class="episode-cover"></image>
		<view class="episode-title">{{episodeInfo.title}}</view>
		<view class="episode-host">{{episodeInfo.itunes.author}}</view>
		<view class="progress-bar">
			<u-slider v-model="progress" active-color="#86C166" @end="sliderMovingEnd"></u-slider>
		</view>
		<view class="time-info">
			<view class="spent-time">{{player.spentTime}}</view>
			<view class="total-time">{{episodeInfo.itunes.duration}}</view>
		</view>
		<view class="play-control-button">
			<u-action-sheet :list="playRateList" v-model="showPlayRateSheet" @click="choosePlayRate"></u-action-sheet>
			<text @click="showPlayRateSheet = true">1.0x</text>
			<u-icon name="rewind-left" color="black" size="50"></u-icon>
			
			<block v-if="!player.isPaused">
				<u-icon name="pause" color="#86C166" size="96" @click="pause()"></u-icon>
			</block>
			<block v-else>
				<u-icon name="play-right-fill" color="#86C166" size="96" @click="play()"></u-icon>
			</block>
			<u-icon name="rewind-right" color="black" size="50"></u-icon>
			<u-icon name="order" color="black" size="50"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				episodeInfo:{},
				progress:0,
				player:{
				},
				showPlayRateSheet:false,
				playRateList:[
					{text:'0.5'},
					// {text:'0.75'},
					{text:'1.0'},
					// {text:'1.25'},
					{text:'1.5'},
					{text:'2'},
				],
			}
		},
		methods: {
			// 创建音频播放对象
			createAudioObject(){
				this.player = uni.createInnerAudioContext()
				this.player.spentTime = '00:00'
				this.player.isPaused = true
				this.player.src = this.episodeInfo.guid
				// this.player.autoplay = true
				this.player.onCanplay(()=>{
					this.player.totalTime = this.player.duration
					// this.player.play()
				})
				this.watchAudioProgress()
			},
			// 监听音频播放过程
			watchAudioProgress(){
				this.player.onTimeUpdate(()=>{
					this.player.spentTime = this.tools.secondsToTimeString(Math.floor(this.player.currentTime))
					this.progress = (this.player.currentTime / this.player.totalTime )*100

				})
			},
			// 监听进度条被拖拽的事件
			sliderMovingEnd(){
				this.player.currentTime = this.player.totalTime * (this.progress / 100)
			},
			pause(){
				this.player.pause()
				this.player.isPaused = true
			},
			play(){
				this.player.play()
				this.player.isPaused = false
			},
			choosePlayRate(index){
				// console.log(this.playRateList[index].text)
			}
		},
		created(){
			// this.episodeInfo = getApp().globalData.currentEpisode
			// uni.setStorageSync('currentEpisode',this.episodeInfo)
			this.episodeInfo = uni.getStorageSync('currentEpisode')
			console.log(this.episodeInfo)
			this.createAudioObject()
		}
	}
</script>

<style>
	page{
		width: 100%;
		height: 100%;
/* 		background-color: pink; */
	}
</style>

<style lang="scss" scoped>
	.main{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.episode-cover{
		width:550rpx;
		height:550rpx;
		border-radius: 10px;
		margin-top: 30px;
	}
	
	.episode-title{
		font-size: 36rpx;
		font-weight: bold;
		margin-top: 15px;
	}
	
	.episode-host{
		color: $tea-color;
		font-weight: bold;
		margin-top: 7px;
	}
	
	.progress-bar{
		width: 80%;
		margin-top: 15px;
	}
	
	.time-info{
		display: flex;
		flex-direction: row;
		width: 80%;
		justify-content: space-between;
		margin-top: 5px;
		font-weight: bold;
	}
	
	.play-control-button{
		margin-top: 15px;
		display: flex;
		flex-direction: row;
		width: 90%;
		justify-content: space-around;
		align-items: center;
		font-weight: bold;
	}
</style>
