let baseUrl = 'http://localhost';
let nav = ['首页', '分页1', '分页2', '分页3'];
let extend = (dst, obj) => {
	for (let i in obj) {
		if (obj.hasOwnProperty(i)) {
			dst[i] = obj[i];
		}
	}
};
let showdown = require('showdown');
let showdownhighlight = require('showdown-highlight');

/*
 生成html的躯干
 options包含
 * @key  {[number]} activeIdx [对应nav数组的idx，将数组的这个元素设置为active]
 * @needBanner 是否生成banner，默认为true
 * 待扩展
 */
export let generateMainHtml = options => {
	let liList = '';
	for (let [index, item] of nav.entries()) {
		liList += '<li class="nav-item"><a href="" ';
		liList += options.activeIdx === index ? 'class="active"' : '';
		liList += ` data-index=${index}>${item}</a></li>`
	}
	let needBanner = options.needBanner === undefined ? true : options.needBanner;
	let head = `<header class="header">
        <div class="container">
            <a href="/" class="iconfont icon-blogger"></a>
            <span class="title">小站</span>
            <ul class="nav-list">
                <li class="main-nav-list">
                    <div class="phone-show-menu">
                        <span class="iconfont icon-sanjiao">首页</span>
                    </div>
                    <ul class="pc-show" id="pc-show">
                        ${liList}
                    </ul>
                </li>
                <li class="search-bar">
                    <form action="" role="search" class="search-form">
                        <input type="text" placeholder="搜索" class="search-input" id="search-input">
                        <span class="iconfont icon-sousuo" id="search-btn"></span>
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
        <ul class="entry-list" id="entry-list"></ul>
        <div class="no-result">
		<p class="text">列表为空</p>
		</div>
        </div><div class="sentinels" id="sentinels"></div>`
			if (needBanner) {
				main += `<div class="aside" id="aside">
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
        </div>`
			}
	main += `</div>`;
	return head + main
};

export let generateEntryList = data => {
	let html = ``
	for (let i in data.data) {
		let item = data.data[i];
		let tagArr = data.data[i].tag.split(',');
		let tagHtml = ''
		for (let tagIdx in tagArr) {
			tagHtml += `<li class="meta-item">${tagArr[tagIdx]}</li>`
		}
		html += `<li class="item" data-id="${item._id}">
								<div class="content-box">
									<div class="meta-row">
										<ul class="meta-list">
											${tagHtml}
										</ul>
									</div>
									<div class="title-row">
										<p class="title">${item.title}</p>
									</div>
									<div class="time-row">
										<p class="time">${transTime(item.time)}</p>
									</div>
								</div>
								</li>`
	}
	return html;
}
/**
 * markdown转html
 * @param markdownStr markdown语法的字符串
 * @return html
 */
export let generateErrorHtml = () => {
	let html = `<div class="err-main"><div class="container">
        <!--<p class="iconfont icon-icon-test1"></p>-->
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon-test1"></use>
        </svg>

        <div class="back-box">
            <a href="./index.html" class="back-index">回到首页</a>
        </div>
    </div></div>`;
	return html;
}
/*
 css选择器
 除#id外，其余都返回数组
 */
export let $ = el => {
	if (/^#/.test(el)) return document.querySelector(el)
	return document.querySelectorAll(el)
}

/*
 封装了一个ajax请求，只支持get和post
 options包括url,type(默认为get),data,后面两个可以为空
 */
export let ajax = function (options) {
	if (options.data.token) {
		if (localStorage.getItem('accesstoken')) {
			options.data.token = localStorage.getItem('accesstoken')
		} else {
			location.href = './login.html';
			return;
		}
	}
	return new Promise((resolve, reject) => {
		let opt = {
			url: '',
			type: 'get',
			data: {}
		};
		extend(opt, options);
		if (opt.url) {
			let xhr = XMLHttpRequest
				? new XMLHttpRequest()
				: new ActiveXObject('Microsoft.XMLHTTP');
			let data = opt.data,
				url = baseUrl + opt.url,
				type = opt.type.toUpperCase(),
				dataArr = [];
			for (let k in data) {
				dataArr.push(k + '=' + data[k]);
			}
			if (type === 'GET') {
				url = url + '?' + dataArr.join('&');
				xhr.open(type, url.replace(/\?$/g, ''), true);
				xhr.send();
			}
			if (type === 'POST') {
				xhr.open(type, url, true);
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				xhr.send(dataArr.join('&'));
			}
			xhr.onload = function () {
				if (xhr.status === 200 || xhr.status === 304) {
					let res;
					res = xhr.responseText;
					if (typeof res === 'string') {
						res = JSON.parse(res);
						return resolve(res)
					}
				} else {
						return reject(res)
				}
			};
		}
	})
};

/**
 * markdown转html
 * @param markdownStr markdown语法的字符串
 * @return html
 */
export let markdown2html = markdownStr => {
	// 创建shoudown对象
	let converter = new showdown.Converter({
		extensions: [showdownhighlight]
	});
	let text = converter.makeHtml(markdownStr)
	// showdown解析四个空格开头的代码块，会出现hljs字符，这里先暴力替换掉
	text = text.replace(/>hljs/g, '>')
	// 序列化h1的id
	let idx = 0
	text = text.replace(/(<h[1-6][\S|\s]+?id=["|'])([\w|\-]*)(['|"])/g, function (a, b, c, d) {
		return b + 'heading-' + idx++ + d
	})
	return text
};
// 解析参数
export let getQueryValue = (key) => {
	let match=location.search.match(new RegExp(key+'=([^&]*)'));
	return match&&match[1]||'';
}
/**
 * 导入svg图标
 * @param
 * @return html
 */
export let importSvg = () => {
	let script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', baseUrl + '/static/js/iconfont.js');
	if (document.querySelector('head')) document.querySelector('head').appendChild(script);
	else document.documentElement.appendChild(script);
};
// 转换时间
function transTime(time) {
	if (typeof time !== "number") {
		time = Number(time);
	}
	let date = new Date(time);
	return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
}