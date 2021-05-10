'use strict';
exports.main = async (event, context) => {
	let data = {}
	// 获取网站设置
	data.setting = await uniCloud.database().collection('setting').get()
	data.setting = data.setting.data[0]
	// 获取播客列表
	data.podcastList = uniCloud.database().collection('podcast').get()
	// 获取链接列表
	data.linkList = uniCloud.database().collection('link').get()
	// 获取推荐播客列表
	data.recommendPodcastList = uniCloud.database().collection('podcast').where({isRecommended:true}).get()
	// 获取播客分类列表
	let categoryDB = uniCloud.database().collection('category')
	data.podcastCategoryList = categoryDB.get()
	// 获取链接分类列表
	data.linkCategoryList = categoryDB.where({type:'link'})
	
	return data
	// let setting = uniCloud.database().collection('setting').get()
	// return setting
};
