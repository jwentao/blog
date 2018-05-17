import './css/manage.scss';
import { $, ajax } from './js/util';
let global = {
	idx: 0,
	num: 20,
	canLoad: false
};
let entryList = $('#entry-list');

getArticleList();
let io = new IntersectionObserver(e => {
	if (e[0].intersectionRatio <= 0	) return;
	console.log('need load', global.canLoad)
	if (global.canLoad) {
		global.idx ++;
		global.canLoad = false;
		getArticleList();
	}
});
io.observe($('#sentinels'));
// 获取文章
async function getArticleList () {
	let data = await ajax({url: '/article/get_article_list', type: 'GET', data: {
		idx: global.idx,
		num: global.num
	}});
	console.log(data)
	if (data.code === 0) {
		let html = '';
		for (let i in data.data) {
			console.log(i)
			html += `<li class="item" data-id="${data.data[i]._id}">
                <div class="title">${data.data[i].title}</div>
                <div class="modify">修改</div>
                <div class="delete">删除</div>
            </li>`
		}
		entryList.insertAdjacentHTML('beforeEnd', html);
		if ((global.idx + 1) * global.num < data.total || !data.total) {
			console.log('canload to true')
			global.canLoad = true;
		}
		// entryList.insertAdjacentHTML('beforeEnd', generateEntryList(data));
	}
}
// 删除文章
async function deleteArticle(node) {
    let data = await ajax({url: '/article/delete_article', type: 'GET', data: {
        _id: node.dataset.id
    }});
    console.log(data)
	if (data.code === 0) {
    	node.remove();
	}
}
entryList.addEventListener('click', e => {
	e.stopPropagation();
	let classList = e.target.classList;
	console.log(classList)
	if (classList.contains('delete')) {
		console.log('delete', e.target.parentNode.dataset.id);
		let parentNode = e.target.parentNode;
        deleteArticle(parentNode)

	} else if (classList.contains('modify')) {
		console.log('modify');
		location.href = './edit.html?id=' + e.target.parentNode.dataset.id;
	}
}, false);