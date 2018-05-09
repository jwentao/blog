import './css/index.scss'
// import 'babel-polyfill'
import { $, ajax, generateMainHtml } from './js/util'
$('body')[0].innerHTML = generateMainHtml({activeIdx: 0})
$('.phone-show-menu')[0].addEventListener('click', e => {
	console.log(e)
	let showEl = $('.pc-show')[0]
	showEl.classList.toggle('show')
}, false)

getArticleList()


async function getArticleList () {
	let data = await ajax({url: '/article/get_article_list', type: 'GET', data: {
		idx: 0,
		num: 10
	}})
	console.log(data)
	if (data.code === 0) {
		let html = `<ul class="entry-list" id="entry-list">`
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
		$('#content').innerHTML = html;
		$('#entry-list').addEventListener('click', e => {
			e.stopPropagation();
			let node = findParentDataSet(e.target, 'id');
			let id;
			if (node) {
				id = node.dataset.id;
				location.href = `./detail.html?id=${id}`;
			}
			console.log(id)
		}, false);
	}
}

function findParentDataSet(node, dataSet) {
	if(node.dataset[dataSet]) {
		return node
	} else if (node.parentNode) {
		return findParentDataSet(node.parentNode, dataSet)
	} else {
		return false
	}
}

function transTime(time) {
	if (typeof time !== "number") {
		time = Number(time);
	}
	let date = new Date(time);
	return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
}