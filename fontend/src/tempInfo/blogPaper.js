export let blogPaper = `<p>此教程会教你从0到1搭建一个完整的博客，包括前端展示页、后台管理系统、后端接口及接口文档、服务端部署整个完整流程。这个博客十分简单，功能远少于我们所用的博客。但是学会了整个流程，再在此基础上扩展就会很容易了。</p>
<p>所以此教程适合新手小白，高手请绕道，浪费你的时间。</p>
<p>（<strong>关于项目源码以及线上地址请参考文章结尾</strong>）</p>
<h4 id="heading-0">概述</h4>
<p>搭建自己的博客，一方面是想了解博客搭建和部署整个过程，另一方面自己想学习过程中一些东西想沉淀下来，所以就想到写博客。写博客过程中，我会发现有些知识点其实还没完全搞清楚，这样会促使我深入学习。总而言之，写博客会形成一个良性循环。</p>
<p>其实整个博客搭建去年就完成了，项目都跑在我的服务器上，但是我的个人文章还没有放在上面，等功能完善了再上吧。当时准备写这篇文章，只不过当时公司项目忙，给忘了。现在想起来就把这篇文章完成了。</p>
<p>再次说明，本人是前端码农，对于服务端部署，后端接口什么的基本不懂，所有的东西都是现学现用，跟专业的后端和运维差太远，只是让项目能正常跑起来。关于后端以及部署的安全性和稳定性方面都没有涉及，所以项目仅供参考。</p>
<h4 id="heading-1">前端项目</h4>
<p>当时做前端项目时准备用vue-cli来搭建的，但是了解到处都说服务端渲染，而我主要使用vue较多。所以为了尝试一下vue ssr，就有了现在这个项目。查了一下vue ssr，主要有官方版本和nuxt两个用的比较多些，看了一下发现nuxt节省了各种配置，上手更快，所以就用nuxt踩了一下坑。</p>
<p>当时刚推出nuxt1.0版本，官方文档也还比较详细。搭建完成后丢到服务器运行，发现页面打开速度确实比较快，基本是秒开。由于nuxt1.0当时要求node是8.0以上版本，低于8.0会报错，所以我用nvm来管理node版本，注意clone我的项目后安装依赖一定要在node 8.0以上版本下安装。</p>
<p>这个项目很简单，就只有文章列表页和文章详情页，再就是简单的兼容了下移动端。由于很简单就不展开说了，关于nuxt使用还是推荐多看官方教程。</p>
<h4 id="heading-2">后台管理项目</h4>
<p>前端后台管理项目是基于vue-cli完成的，关于vue-cli的使用网上的教程非常多，不做叙述。ajax请求用的axios库， ui使用的element-ui。主要页面有</p>
<ul>
<li>注册、登录</li>
<li>新建文章</li>
<li>编辑文章</li>
<li>新建分类</li>
<li>编辑分类</li>
<li>删除文章</li>
<li>删除分类</li>
<li>换肤等功能</li>
</ul>
<p>该项目搭建时有点早，clone我的项目后安装依赖后项目能正常跑起来，当时会有一些warning，因为有些npm包被废弃了，推荐新的包什么的。</p>
<h4 id="heading-3">后端接口以及接口文档</h4>
<p>后端项目采用的是express和mongolass，后端node项目主要参考cnode社区一个大佬的一步一步学习node的项目。后端项目的接口主要对应前端管理页面那些接口。</p>
<p>接口文档是用的 swagger来编写的，使用swagger-editor来编写配置文件，将其转换为json，将配置文件放入到swagger-ui文件中，放到服务器部署就行了。</p>
<p>运行本项目除了clone该项目的代码安装依赖外，还要在本地电脑安装mongodb，并且成功启动mongodb服务。本项目才能正常启动。</p>
<h4 id="heading-4">接口文档编写</h4>
<blockquote>
  <p>准备：下载swagger-ui和swagger-edit。(参考我的github readme)</p>
</blockquote>
<p><strong>本地运行swagger-editor</strong></p>
<p>1、启动swagger-editor：</p>
<p>在本项目下执行http-server swagger-editor -p8989。在浏览器中打开localhost:8989即可打开swagger-editor。</p>
<p><strong>注意：要全局安装http-server。默认端口号为8080。</strong></p>
<p>2、编辑swagger-editor：</p>
<p>在editor中编辑代码，左边是编辑区，右边是视觉效果。编辑好后导出json文件。关于文档的编写这里不展开讲解，可以参考这篇文章<a href="https://link.juejin.im?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F21353795">传送门</a>，文章写得很详细。</p>
<p>3、部署接口文档：</p>
<p>在项目根目录下新建swagger文件夹，将下载的swagger-ui文件中dist目录下的所有文件复制到public文件夹下。将2步骤导出的json文件也放入swagger文件夹下。修改swagger下index.html文件中 url = "http://petstore.swagger.io/v2/swagger.json"，将其改为swagger.json。在index.js中加上静态模块：</p>
<pre><code> app.<span class="hljs-keyword">use</span>(<span class="hljs-string">'/swagger'</span>, express.<span class="hljs-keyword">static</span>(<span class="hljs-string">'./swagger'</span>));
</code></pre>
<p>用node启动index.js，如果端口号为3000，在浏览器中打开 http://localhost:3000/swagger即可查看接口文档。</p>
<p><strong>接口文档连接服务器，实时获取接口数据：</strong></p>
<p>swagger.json中有个host字段，要想接口文档能调通地址，需此host地址与浏览器中请求的地址一模一样。本地开服务ip可以是：</p>
<p>1、本机内网ip地址：如192.168.0.217:3000 (你本机的ip地址),</p>
<p>2、本机本地服务地址：127.0.0.1:3000,</p>
<p>3、本机本地服务简写：localhost:3000</p>
<h4 id="heading-5">服务器部署</h4>
<p>再就是服务器部署，我买的服务器是阿里云服务器，装的系统是centos7.3。为了项目正常运行，在服务器上装了，ftp、git、node、nginx、mongodb。当时安装部署遇到不少问题，关于每一个安装部署我都有详细教程，有兴趣的可以去看看。</p>
<p><a href="https://link.juejin.im?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2F7258a75798c4">node项目部署——阿里云centos部署ftp</a></p>
<p><a href="https://link.juejin.im?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2F7aad651bdbb4">node项目部署——阿里云cento部署node和nginx</a></p>
<p><a href="https://link.juejin.im?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2Fd7713fbd3e5d">node项目部署——阿里云centos部署git服务</a></p>
<p><a href="https://link.juejin.im?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2Fb5fd46aaec43">node项目部署——阿里云centos部署mongodb</a></p>
<h4 id="heading-6">重点说明</h4>
<p>本项目想正常跑起来步骤：</p>
<p>1、clone 我博客项目前端、后台管理、后端项目到本地</p>
<p>2、分别安装各自依赖。</p>
<p>3、本地电脑安装mongodb，最好注册为服务。（推荐Robomongo可视化管理mongodb）（node安装就不说了）</p>
<p>4、先启动mongodb服务，再启动后端项目。（此时在浏览器可以打开接口文档了）</p>
<p>5、依次启动后台管理项目、前端项目。</p>
<p>6、项目都成功启动了，但是没有数据，可以通过后台管理系统添加文章和分类。（也可以手动通过robomongo添加文章到mongodb）</p>
<p>7、此时应该能正常看到文章了。</p>
<h4 id="heading-7">最后附上项目链接地址，欢迎star ^_^</h4>
<p><a href="https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2Fkeenjaan%2Fblog">博客前端项目</a></p>
<p><a href="https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2Fkeenjaan%2Fblog-admin">博客后台管理页面</a></p>
<p><a href="https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2Fkeenjaan%2Fblog-api">博客接口以及接口文档</a></p>
<p><strong>线上部署地址:</strong></p>
<p><a href="https://link.juejin.im?target=http%3A%2F%2Fwww.keenjaan.cn%2Fswagger%2F">线上接口文档</a></p>
<p><a href="https://link.juejin.im?target=http%3A%2F%2Fssr.keenjaan.cn%2F">线上前端页面</a></p>
<p>管理项目地址就不放出了，api接口只提供查看文章等读取功能，不提供注册、添加文章等写入功能。</p>
<p>差不多就这些了，撤了。。。。</p>`