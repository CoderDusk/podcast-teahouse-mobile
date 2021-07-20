function secondsToTimeString(seconds){
	const h = Math.floor(seconds / 3600)
	let m = Math.floor(seconds / 60)
	if(m<10){
		m = '0'+m
	}
	let s = Math.floor(seconds % 60)
	if(s<10){
		s = '0' + s
	}
	if(h>0){
		return `${h}:${m}:${s}`
	}else{
		return `${m}:${s}`
	}
	
	
}

export default{
	secondsToTimeString
}