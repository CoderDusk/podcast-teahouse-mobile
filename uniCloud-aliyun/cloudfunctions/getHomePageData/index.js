'use strict';
exports.main = async (event, context) => {
	let data = {}
	// 获取网站设置
	data.setting = uniCloud.database().collection('setting').get()
	// 获取播客列表
	data.podcastList = uniCloud.database().collection('podcast').get()
	// 获取链接列表
	data.linkList = uniCloud.database().collection('link').get()
	// 获取分类列表
	// data.categoryList = 
	// 获取推荐播客列表
	data.recommendPodcastList = uniCloud.database().collection('podcast').where({isRecommended:true}).get()
	
	return data
};
