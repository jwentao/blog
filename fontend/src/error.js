import './css/error.scss';
import {$, generateMainHtml, importSvg, generateErrorHtml } from './js/util'
$('body')[0].innerHTML = generateMainHtml({activeIdx: -1, needBanner: false});
$('#main').insertAdjacentHTML('afterEnd', generateErrorHtml())
importSvg()