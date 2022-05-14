const baseUrl = 'http://shop.hxlnw.com.cn/api/'

const request = (url = '', datas = {}, type = 'POST',
	header = {
		'content-type': 'application/json',
	}) => {

	// console.log(type)
    let currentRoutes = getCurrentPages(); // 获取当前打开过的页面路由数组
    let currentRoute = currentRoutes[currentRoutes.length - 1].route //获取当前页面路由
    let currentParam = currentRoute.substr(currentRoute.lastIndexOf("/") + 1,5)
     if(currentParam != 'login'){
		 datas.token = uni.getStorageSync('token')
	 }
	return new Promise((resolve, reject) => {
		uni.request({
			method: type,
			url: baseUrl + url,
			data: datas, 
			header: header,
			dataType: 'json',
		}).then((response) => {
			setTimeout(function() {
				uni.hideLoading();
			}, 200);
			let [error, res] = response;
			resolve(res.data);
		}).catch(error => {
			let [err, res] = error;
			reject(err)
		})
	});
}
export default request
