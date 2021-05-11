<template>
	<view>
		<view class="loading" v-if="loading">
			<u-loading mode="flower" size="96"></u-loading>
			<view>正在加载中，请稍后</view>
		</view>
		<view v-else>
			<view style="text-align: center;">
				<image class="siteLogo" :src="data.setting.logo"></image>
			</view>
			
			<scroll-view scroll-x="true" class="category-links">
				<view v-for="(item,index) in data.categoryList" :key="index" class="category-links">
					<a :href="`#${item.name}`" class="category-link">
						<u-button plain type="success" shape="circle">{{item.name}}</u-button>
					</a>
				</view>
			</scroll-view>
			<u-divider fontSize="36" border-color="gray" color="#999999">推荐播客</u-divider>
			<view v-for="(item,index) in data.recommendPodcastList" :key="item._id">
			
				<view class="podcast">
					<view class="left">
						<view class="logo" @click="gotoPodcastPage(item._id)">
							<image :src="item.logo" mode="widthFix"></image>
						</view>
						<view class="info" @click="gotoPodcastPage(item._id)">
							<view class="title">
								{{item.name}}
							</view>
							<view class="description">
								{{item.description}}
							</view>
						</view>
					</view>
			
					<view class="button">
						<u-icon name="close-circle" color="red" size="70" v-if="exportList.indexOf(item._id) !== -1"
							@click="removeFromExportList(item._id)"></u-icon>
						<u-icon name="plus-circle" color="#86C166" size="70" v-else @click="addToExportList(item._id)">
						</u-icon>
					</view>
			
				</view>
			</view>
			<view v-for="(item,index) in data.podcastCategoryList" :key="item._id">
				<u-divider fontSize="36" border-color="gray" color="#999999" :id="`${item.name}`">{{item.name}}</u-divider>
				<view class="podcast" v-for="podcast in data.podcastList" v-if="podcast.categoryID == item._id"
					:key="podcast._id">
					<view class="left">
						<view class="logo" @click="gotoPodcastPage(podcast._id)">
							<image :src="podcast.logo" mode="widthFix"></image>
						</view>
						<view class="info" @click="gotoPodcastPage(podcast._id)">
							<view class="title">
								{{podcast.name}}
							</view>
							<view class="description">
								{{podcast.description}}
							</view>
						</view>
					</view>
			
					<view class="button">
						<u-icon name="close-circle" color="red" size="70" v-if="exportList.indexOf(podcast._id) !== -1"
							@click="removeFromExportList(podcast._id)"></u-icon>
						<u-icon name="plus-circle" color="#86C166" size="70" v-else @click="addToExportList(podcast._id)">
						</u-icon>
					</view>
				</view>
			</view>
			<view v-for="(item,index) in data.linkCategoryList" :key="item._id">
				<u-divider fontSize="36" border-color="gray" color="#999999" :id="`${item.name}`">{{item.name}}</u-divider>
				<view class="podcast link" v-for="link in data.linkList" v-if="link.categoryID == item._id" :key="link._id"
					@click="gotoLinkPage(link._id)">
					<view class="left">
						<view class="logo">
							<image :src="link.logo" mode="widthFix"></image>
						</view>
					</view>
			
					<view class="info">
						<view class="title">
							{{link.name}}
						</view>
						<view class="description">
							{{link.description}}
						</view>
					</view>
				</view>
			</view>
			<pageFooter></pageFooter>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				// 要导出的节目列表
				exportList: [],
				// 首页需要加载得网络资源
				data: {
					setting:{},
				},
				// 是否正在加载
				loading:true
			}
		},

		methods: {
			getHomePageData() {
				uniCloud.callFunction({
					name: 'getHomePageData'
				}).then(res => {
					if (res.success === true) {
						this.loading = false
						this.data = res.result
					} else {
						this.$u.toast('数据获取失败，请稍后重试')
					}
				})
			},
			gotoPodcastPage(id) {
				uni.navigateTo({
					url: '../podcast/podcast?id=' + id
				})
			},
			gotoLinkPage(id) {
				uni.navigateTo({
					url: '../link/link?id=' + id
				})
			},
			addToExportList(id) {
				this.exportList.push(id)
				this.exportList = Array.from(new Set(this.exportList))
				uni.setStorageSync('exportList', this.exportList)
			},
			removeFromExportList(id) {
				let index = this.exportList.indexOf(id)
				this.exportList.splice(index, 1)
				uni.setStorageSync('exportList', this.exportList)
			},
		},
		created() {
			// this.getHomePageData()
		},
		onLoad() {
			this.getHomePageData()
			
			this.exportList = uni.getStorageSync('exportList')
			if (this.exportList == '') {
				this.exportList = []
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		font-size: 35rpx;
	}
	
	.loading{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 200px;
		
		view { 
			color:gray;
			padding-top: 20px;
		}
	}

	.siteLogo {
		text-align: center;
		margin: 20px;
		border-radius: 20px;
		width: 350rpx;
		height: 350rpx;

	}

	.podcast {
		display: flex;
		padding-top: 30rpx;
		justify-content: space-between;

		.left {
			display: flex;

			.logo {
				padding: 0 30rpx;

				image {
					width: 150rpx;
					border-radius: 7px;
				}
			}

			.info {
				.title {
					font-size: 40rpx;
				}

				.description {
					padding-top: 10rpx;
					font-size: 30rpx;

					overflow: hidden;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 3;
				}
			}
		}



		.button {
			align-self: center;
			margin-right: 20rpx;
		}
	}

	.link {
		justify-content: start;
	}



	.category-links {
		display: inline-flex;
		white-space: nowrap;

		.category-link {
			text-decoration: none;
			margin: 0 20rpx;
			display: inline-flex;
		}
	}

	.u-divider {
		margin-top: 20px !important;
	}
</style>
