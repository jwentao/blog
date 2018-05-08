let nav = ['首页', '分页1', '分页2', '分页3']
/*
	生成html的躯干
	options包含
 * @key  {[number]} activeIdx [对应nav数组的idx，将数组的这个元素设置为active]
 * 待扩展
 */
export let generateMainHtml = options => {
	let liList = ''
	for (let [index, item] of nav.entries()) {
		liList += '<li class="nav-item"><a href="" '
		liList += options.activeIdx === index ? 'class="active"' : ''
		liList += `>${item}</a></li>`
	}
	let head = `<header class="header">
        <div class="container">
            <a href="/" class="iconfont icon-blogger"></a>
            <span class="title">小站</span>
            <ul class="nav-list">
                <li class="main-nav-list">
                    <div class="phone-show-menu">
                        <span class="iconfont icon-sanjiao">首页</span>
                    </div>
                    <ul class="pc-show">
                        ${liList}
                    </ul>
                </li>
                <li class="search-bar">
                    <form action="" role="search" class="search-form">
                        <input type="text" placeholder="搜索" class="search-input">
                        <span class="iconfont icon-sousuo"></span>
                    </form>
                </li>
                <li class="user-bar">
                    <span class="iconfont icon-yonghu"></span>
                </li>
            </ul>
        </div>
    </header>`
	let main = `<div class="main" id="main">
        <div class="content" id="content">
        </div>
        <div class="aside" id="aside">
            <div class="banner">
                <div class="personal-info">
                    <div class="card-bar">
                        <div class="img-bar">
                            <img src="http://47.106.128.227/static/img/j.png" alt="">
                        </div>
                        <div class="text-bar">
                            <p class="name">jwentao</p>
                            <p class="job">前端开发工程师</p>
                        </div>
                    </div>
                    <div class="info-row">
                        <span class="iconfont icon-youjian"></span><a href="mailto:jin_wentao@qq.com">jin_wentao@qq.com</a>
                    </div>
                    <div class="info-row">
                        <span class="iconfont icon-github"></span><a href="https://github.com/jwentao">Github</a>
                    </div>
                    <div class="info-row">
                        <span class="iconfont icon-zuobiao"></span><a href="http://map.baidu.com/?newmap=1&s=s%26wd%3D%E6%B7%B1%E5%9C%B3%E5%B8%82%26c%3D340&from=alamap&tpl=mapcity">shenzhen</a>
                    </div>
                </div>
            </div>
        </div>
    </div>`
	return head + main
}
/*
	css选择器
	除#id外，其余都返回数组
 */
export let $ = el => {
	if (/^#/.test(el)) return document.querySelector(el)
	return document.querySelectorAll(el)
}

export let ajax = (url, option) => {
	return new Promise((resolve, rej) => {
		fetch(url, option).then(response => {
			if (response.status >= 200 && response.status < 300) {
				return resolve(response.json())
			} else {
				return rej(response)
			}
		}).catch(error => {
			return rej(error)
		})
	})
}