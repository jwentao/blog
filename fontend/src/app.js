import './css/index.scss'
// import 'babel-polyfill'
import { $, ajax, generateMainHtml, generateEntryList } from './js/util';
$('body')[0].innerHTML = generateMainHtml({activeIdx: 0});

$('#search-btn').addEventListener('click', e => {
	let input = $('#search-input').value;
	console.log(input)
	location.href = './search.html?title=' + input;
}, false);

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
	}});
	console.log(data)
	if (data.code === 0) {
		let html = generateEntryList(data);
		$('#content').innerHTML = generateEntryList(data);
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
