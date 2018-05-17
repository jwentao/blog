import './css/search.scss';
// import 'babel-polyfill'
import { $, ajax, generateMainHtml, generateEntryList, getQueryValue } from './js/util';
let global = {
	idx: 0,
	num: 10,
	titleKeyWord: '',
	canLoad: false
};

$('body')[0].innerHTML = generateMainHtml({activeIdx: 0});
global.titleKeyWord = $('#search-input').value = getQueryValue('title');
searchByTitle();

$('#entry-list').addEventListener('click', e => {
	e.stopPropagation();
	console.log('click')
	let node = findParentDataSet(e.target, 'id');
	let id;
	if (node) {
		id = node.dataset.id;
		location.href = `./detail.html?id=${id}`;
	}
}, false);

$('#search-btn').addEventListener('click', e => {
    let input = $('#search-input');
	history.replaceState({}, input.value, './search.html?title=' + input.value);
    global.titleKeyWord = input.value;
    global.idx = 0;
	$('#entry-list').innerHTML = '';
    searchByTitle();
}, false);

let io = new IntersectionObserver(e => {
	if (e[0].intersectionRatio <= 0	) return;
	console.log('need load', global.canLoad)
	if (global.canLoad) {
		global.idx ++;
		searchByTitle();
	}
});
io.observe($('#sentinels'));

async function searchByTitle () {
	let data = await ajax({url: '/article/search_by_title', type: 'GET', data: {
		idx: global.idx,
		num: global.num,
		title:  global.titleKeyWord
	}});
	console.log(data);
	if (data.code === 0 && data.data.length > 0) {
		$('.no-result')[0].style.display = 'none';
		$('#entry-list').insertAdjacentHTML('beforeEnd', generateEntryList(data));

		if ((global.idx + 1) * global.num < data.total || !data.total) {
			console.log('canload to true')
			global.canLoad = true;
		}
	} else if (data.total === 0) {
		$('.no-result')[0].style.display = 'block';
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

