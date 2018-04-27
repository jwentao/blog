import './css/detail.scss'
import {gitPaper} from './tempInfo/gitPaper'
import {$, generateMainHtml} from './js/util'

$('body')[0].innerHTML = generateMainHtml({activeIdx: -1})


// 从本地拿模拟的数据出来
let title = 'git基本操作，一篇文章就够了'
$('#content').innerHTML = `<div class="article-box"><h1 class="article-title">${title}</h1>
													 <div id="article-body" class="markdown-body">${gitPaper}</div></div>`
let h1List = Array.from($('#article-body').querySelectorAll('h1'))
console.log(h1List)
let liHtml = ''
for (let i in h1List) {
	console.log(h1List[i])
	liHtml += `<li class="item"><a href="#${h1List[i].id}">${h1List[i].innerText}</a></li>`
}
let catalog = `<div class="catalog-box">
								<nav class="article-catalog">
									<div class="catalog-title">${title}</div>
									<div class="catalog-body">
										<ul id="catalog-list" >
											${liHtml}
										</ul>
									</div>
								</nav>
							</div>`
$('#aside').insertAdjacentHTML('beforeEnd', catalog)
//
$('#catalog-list').addEventListener('click', e => {
	console.log(e.target.attributes)
}, false)