import './css/manage.scss';
import {$, ajax} from './js/util';
let global = {
	idx: 0,
	num: 20,
	canLoad: false
};
let entryList = $('#entry-list');
init();
async function init() {
	await auth();
	await getArticleList();
	let io = new IntersectionObserver(e => {
		if (e[0].intersectionRatio <= 0) return;
		if (global.canLoad) {
			global.idx++;
			global.canLoad = false;
			getArticleList();
		}
	});
	io.observe($('#sentinels'));
	entryList.addEventListener('click', e => {
		e.stopPropagation();
		let classList = e.target.classList;
		if (classList.contains('delete')) { // 点击删除
			let result = confirm('是否删除！');
			if(result){
				let parentNode = e.target.parentNode;
				deleteArticle(parentNode);
			}
		} else if (classList.contains('modify')) { // 点击修改
			location.href = './edit.html?id=' + e.target.parentNode.dataset.id;
		}
	}, false);
	// 注销
	$('#logout').addEventListener('click', e => {
		logout()
	}, false);
	// 新文章
	$('#new').addEventListener('click', e => {
		location.href = './edit.html';
	}, false)
}
async function logout() {
	let data = await ajax({
		url: '/user/logout', type: 'GET', data: {
			token: true
		}
	});
	location.href = './login.html';
}
// 验证token
async function auth() {
	let data = await ajax({
		url: '/user/auth', type: 'GET', data: {
			token: true
		}
	});
	if (data.code !== 0) {
		location.href = './login.html';
	}
}
// 获取文章
async function getArticleList() {
	let data = await ajax({
		url: '/article/get_article_list', type: 'GET', data: {
			idx: global.idx,
			num: global.num
		}
	});
	if (data.code === 0) {
		let html = '';
		for (let i in data.data) {
			html += `<li class="item" data-id="${data.data[i]._id}">
                <div class="title">${data.data[i].title}</div>
                <div class="modify">修改</div>
                <div class="delete">删除</div>
            </li>`
		}
		entryList.insertAdjacentHTML('beforeEnd', html);
		if ((global.idx + 1) * global.num < data.total || !data.total) {
			global.canLoad = true;
		}
		// entryList.insertAdjacentHTML('beforeEnd', generateEntryList(data));
	}
}
// 删除文章
async function deleteArticle(node) {
	let data = await ajax({
		url: '/article/delete_article', type: 'GET', data: {
			_id: node.dataset.id,
			token: true
		}
	});
	if (data.code === 0) {
		node.remove();
	}
}
