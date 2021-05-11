'use strict';
exports.main = async (event, context) => {
	let data = {}
	// 获取网站设置
	data.setting = (await uniCloud.database().collection('setting').get()).data[0]
	// 获取播客列表
	data.podcastList = (await uniCloud.database().collection('podcast').orderBy('sort','desc').get()).data
	// 获取链接列表
	data.linkList = (await uniCloud.database().collection('link').orderBy('sort','desc').get()).data
	// 获取推荐播客列表
	data.recommendPodcastList = (await uniCloud.database().collection('podcast').where({
		isRecommended: true
	}).orderBy('sort','desc').get()).data
	// 获取播客分类列表
	let podcastCategoryList = (await uniCloud.database().collection('category').where({
		type: 'podcast'
	}).orderBy('sort','desc').get()).data
	data.podcastCategoryList = podcastCategoryList
	// 获取链接分类列表
	let linkCategoryList = (await uniCloud.database().collection('category').where({
		type: 'link'
	}).orderBy('sort','desc').get()).data
	data.linkCategoryList = linkCategoryList
	
	data.categoryList = podcastCategoryList.concat(linkCategoryList)

	return data
};
