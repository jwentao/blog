import './css/search.scss';
// import 'babel-polyfill'
import { $, ajax, generateMainHtml, generateEntryList } from './js/util';
$('body')[0].innerHTML = generateMainHtml({activeIdx: 0});
searchByTitle(getQueryValue('title'));
async function searchByTitle (title) {
	let data = await ajax({url: '/article/search_by_title', type: 'GET', data: {
		idx: 0,
		num: 10,
		title: title
	}});
	console.log(data)
	if (data.code === 0 && data.data.length > 0) {
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
	} else {
		$('#content').innerHTML = `<div class="no-result">
            <p class="text">列表为空</p>
        </div>`
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

function getQueryValue(key){
	let match=location.search.match(new RegExp(key+'=([^&]*)'));
	return match&&match[1]||'';
}