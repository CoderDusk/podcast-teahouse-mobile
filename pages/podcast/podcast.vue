<template>
	<view>
		<view class="logoArea">
			<image :src="podcastInfo.logo" mode="widthFix" class="podcastLogo"></image>
			<u-button shape="circle" class="button" :class="{cancelAddingButton:isInExportList}" @click="addToExportList">
				<text v-if="isInExportList">
					已在导出列表中
				</text>
				<text v-else>
					添加到导出列表
				</text>
			</u-button>
		</view>
		<view class="podcast-title">
			{{podcastInfo.name}}
		</view>
		<view class="podcast-info">
			<view class="infoBox">
				<u-icon name="mic" color="gray" size="48"></u-icon>
				<text class="infoText">{{podcastInfo.host}}</text>
			</view>
			<view class="infoBox">
				<u-icon name="file-text" color="gray" size="48"></u-icon>
				<text class="infoText">{{podcastInfo.description}}</text>
			</view>
		</view>
		<view class="latestEpisodes" v-for="(item,index) in episodeList" :key="index">
			<view class="episode" @click="gotoEpisodePage(item)">
				<view class="left">
					<view class="logo">
						<image :src="item.itunes.image" class="episode-cover"></image>
					</view>
					<view class="info">
						<view class="title">{{item.title}}</view>
						<view class="time">
							<u-icon name="clock" color="gray" size="28"></u-icon>
							{{item.itunes.duration}}
							<text class="dot">·</text>
							{{new Date(item.isoDate).toLocaleDateString()}}
						</view>
						<view>
							
						</view>
					</view>
				</view>
				
				<view class="play-button">
					<u-icon name="play-circle-fill" color="#86C166" size="80"></u-icon>
				</view>
			</view>
		</view>
		<!-- <view class="openInAPP">
			<text>在 APP 内打开</text>
		</view>
		
		<view class="app">
			<a :href="`podcast://${podcastInfo.rssLink}`">
				<u-icon class="appLogo" name="../../static/apple-podcast.svg" size="90"></u-icon>
			</a>
			<a :href="`pktc://subscribe/${podcastInfo.rssLink}`">
				<u-icon class="appLogo" name="../../static/pocket-cast.png" size="90"></u-icon>
			</a>
			<a :href="`moonfm://subscribe?url=${podcastInfo.rssLink}`">
				<u-icon class="appLogo" name="../../static/moonfm.png" size="90"></u-icon>
			</a>
			<a :href="podcastInfo.xiaoyuzhouLink" v-if="podcastInfo.xiaoyuzhouLink">
				<u-icon class="appLogo" name="../../static/xiaoyuzhou.png" size="90"></u-icon>
			</a>			
		</view> -->
		<pageFooter></pageFooter>
	</view>
</template>

<script>
	// const x2js = require('x2js')
	const Parser = require('rss-parser')
	const parser = new Parser()
	// import Parser from 'rss-parser';
	
	export default {
		data() {
			return {
				podcastInfo:{
					logo:''
				},
				isInExportList:false,
				episodeList:[]
			}
		},
		methods: {
			addToExportList(){
				if(this.isInExportList){
					let exportList =  uni.getStorageSync('exportList')
					let index = exportList.indexOf(this.podcastInfo._id)
					exportList.splice(index,1)
					uni.setStorageSync('exportList', exportList);
					this.isInExportList = false
				}else{
					let exportList =  uni.getStorageSync('exportList')
					if(exportList == ''){
						exportList = []
					}
					exportList.push(this.podcastInfo._id)
					exportList =  Array.from(new Set(exportList))
					uni.setStorageSync('exportList', exportList);
					this.isInExportList = true
				}
			},
			async getEpisodeList(){
				this.parserURL()
				let result =  await parser.parseURL(this.podcastInfo.rssLink)
				this.episodeList = result.items
				this.episodeList.forEach((item,index,array)=>{
					// console.log(new Date(item.isoDate).toLocaleDateString())
				})
				// console.log(this.episodeList)
			},
			parserURL(){
				if(this.podcastInfo.rssLink.indexOf('http') < 0){
					this.podcastInfo.rssLink = 'http://' + this.podcastInfo.rssLink
				}
			},
			gotoEpisodePage(episode){
				getApp().globalData.currentEpisode = episode
				uni.navigateTo({
					url:'../player/player'
				})
			}
		},
		onLoad(options){
			if(options.id == undefined || options.id.trim() === ''){
				uni.switchTab({
					url:'../index/index'
				})
				return
			}
			uniCloud.callFunction({
				name:'getPodcast',
				data:{
					id:options.id
				}
			}).then(res=>{
				if(res.success && res.result.affectedDocs === 0){
					this.$u.toast('没有找到相关播客，请稍后重试')
					uni.switchTab({
						url:'../index/index'
					})
					return
				}
				this.podcastInfo = res.result.data[0]
				this.getEpisodeList()
			})
			let exportList =  uni.getStorageSync('exportList')
			if(exportList.indexOf(options.id) !== -1){
				this.isInExportList = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		padding: 40rpx;
	}

	.logoArea {
		display: flex;
		padding-right: 0;

		.podcastLogo {
			width: 250rpx;
			border-radius: 7px;
		}

		.button {
			align-self: flex-end;
			background-color: $tea-color;
			color: white;
		}
		
		.cancelAddingButton{
			background-color: #F4F4F5;
			color: black;
		}
	}
	
	.podcast-title {
		margin-top: 30rpx;
		font-size: 50rpx;
		font-weight: bold;
	}

	.podcast-info {
		border: 1px solid gray;
		border-radius: 5px;
		margin-top: 20rpx;
		font-size: 35rpx;
		padding: 20rpx;
		

		.infoBox {
			display: flex;
			padding-bottom: 10px;
			.u-icon{
				align-self: flex-start;
			}
			text{
				padding-left: 20rpx;
			}
		}
	}
	
	.latestEpisodes{
		margin-top: 10px;
		.episode{
			// background-color: pink;
			display: flex;
			justify-content: space-between;
			// align-items: center;
			border-bottom: 1px solid gray;
			padding:10px 0;
			// margin-top: 20rpx;
			
			.left{
				display: flex;
			}
			
			.episode-cover{
				width: 150rpx;
				height: 150rpx;
				border-radius: 10px;
			}
			
			.info{
				padding-left: 10px;
				.title{
					font-size:32rpx;
					font-weight: bold;
				}
				.time{
					color:gray;
					.dot{
						padding: 0 4px;
					}
				}
			}
			
			.play-button{
				margin-left: 7px;
			}
			
			// .episodeInfo{
			// 	.updateTime{
			// 		color: gray;
			// 	}
			// 	.episodeTitle{
			// 		font-size: 35rpx;
			// 		width: 550rpx;
			// 	}
			// 	.duration{
			// 		color: gray;
			// 	}
			// }
			// .playButton{
			// 	border: 2px solid $tea-color;
			// 	border-radius: 50%;
			// 	width: 70rpx;
			// 	height: 70rpx;
			// 	display: flex;
			// 	justify-content: center;
			// 	align-items: center;
			// 	color: $tea-color;
			// }
		}
	}
	
	.openInAPP{
		// color: red;
		font-size:36rpx;
		font-weight: bold;
		padding-top: 20px;
	}
	
	.app{
		display: flex;
		justify-content: space-around;
		margin-top: 50rpx;
		
		.appLogo{
			border-radius: 50%;
		}
	}
</style>
