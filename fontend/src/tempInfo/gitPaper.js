// 模拟数据用

export let gitPaper = `<h1 id="idx-0">1. git简介</h1>
<p>在实际开发中，会使用git作为版本控制工具来完成团队协作。因此，对基本的git操作指令进行总结是十分有必要的，本文对一些术语或者理论基础，不重新码字，可以<a href="https://link.juejin.im?target=https%3A%2F%2Fwww.liaoxuefeng.com%2Fwiki%2F0013739516305929606dd18361248578c67b8067c8c017b000">参考廖雪峰老师的博文</a>，本文只对命令做归纳总结。</p>
<p>git的通用操作流程如下图（来源于网络）</p>
<p><img src="https://user-gold-cdn.xitu.io/2018/4/25/162fcc0987bf1c0a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" alt="git操作通用流程" /></p>
<p>主要涉及到四个关键点：</p>
<ol>
<li>工作区：本地电脑存放项目文件的地方，比如learnGitProject文件夹；</li>
<li>暂存区（Index/Stage）：在使用git管理项目文件的时候，其本地的项目文件会多出一个.git的文件夹，将这个.git文件夹称之为版本库。其中.git文件夹中包含了两个部分，一个是暂存区（Index或者Stage）,顾名思义就是暂时存放文件的地方，通常使用add命令将工作区的文件添加到暂存区里；</li>
<li>本地仓库：.git文件夹里还包括git自动创建的master分支，并且将HEAD指针指向master分支。使用commit命令可以将暂存区中的文件添加到本地仓库中；</li>
<li>远程仓库：不是在本地仓库中，项目代码在远程git服务器上，比如项目放在github上，就是一个远程仓库，通常使用clone命令将远程仓库拷贝到本地仓库中，开发后推送到远程仓库中即可；</li>
</ol>
<p>更细节的来看：</p>
<p><img src="https://user-gold-cdn.xitu.io/2018/4/25/162fcc0e7e711dc7?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" alt="git几个核心区域间的关系" /></p>
<p>日常开发时代码实际上放置在工作区中，也就是本地的XXX.java这些文件，通过add等这些命令将代码文教提交给暂存区（Index/Stage），也就意味着代码全权交给了git进行管理，之后通过commit等命令将暂存区提交给master分支上，也就是意味打了一个版本，也可以说代码提交到了本地仓库中。另外，团队协作过程中自然而然还涉及到与远程仓库的交互。</p>
<p>因此，经过这样的分析，git命令可以分为这样的逻辑进行理解和记忆：</p>
<ol>
<li><p>git管理配置的命令；</p>
<p><strong>几个核心存储区的交互命令：</strong></p></li>
<li><p>工作区与暂存区的交互；</p></li>
<li><p>暂存区与本地仓库（分支）上的交互；</p></li>
<li><p>本地仓库与远程仓库的交互。</p></li>
</ol>
<h1 id="idx-1">2. git配置命令</h1>
<blockquote>
  <p>查询配置信息</p>
</blockquote>
<ol>
<li>列出当前配置：<code>git config --list</code>;</li>
<li>列出repository配置：<code>git config --local --list</code>;</li>
<li>列出全局配置：<code>git config --global --list</code>;</li>
<li>列出系统配置：<code>git config --system --list</code>;</li>
</ol>
<blockquote>
  <p>第一次使用git，配置用户信息</p>
</blockquote>
<ol>
<li>配置用户名：<code>git config --global user.name "your name"</code>;</li>
<li>配置用户邮箱：<code>git config --global user.email "youremail@github.com"</code>;</li>
</ol>
<blockquote>
  <p>其他配置</p>
</blockquote>
<ol>
<li>配置解决冲突时使用哪种差异分析工具，比如要使用vimdiff：<code>git config --global merge.tool vimdiff</code>;</li>
<li>配置git命令输出为彩色的：<code>git config --global color.ui auto</code>;</li>
<li>配置git使用的文本编辑器：<code>git config --global core.editor vi</code>;</li>
</ol>
<h1 id="idx-2">3. 工作区上的操作命令</h1>
<blockquote>
  <p>新建仓库</p>
</blockquote>
<ol>
<li>将工作区中的项目文件使用git进行管理，即创建一个新的本地仓库：<code>git init</code>；</li>
<li>从远程git仓库复制项目：<code>git clone &amp;lt;url&amp;gt;</code>，如：git clone git://github.com/wasd/example.git;克隆项目时如果想定义新的项目名，可以在clone命令后指定新的项目名：<code>git clone git://github.com/wasd/example.git mygit</code>；</li>
</ol>
<blockquote>
  <p>提交</p>
</blockquote>
<ol>
<li>提交工作区所有文件到暂存区：<code>git add .</code></li>
<li>提交工作区中指定文件到暂存区：<code>git add &amp;lt;file1&amp;gt; &amp;lt;file2&amp;gt; ...</code>;</li>
<li>提交工作区中某个文件夹中所有文件到暂存区：<code>git add [dir]</code>;</li>
</ol>
<blockquote>
  <p>撤销</p>
</blockquote>
<ol>
<li>删除工作区文件，并且也从暂存区也删除对应文件的记录：<code>git rm &amp;lt;file1&amp;gt; &amp;lt;file2&amp;gt;</code>;</li>
<li>从暂存区中删除文件，但是工作区依然还有该文件:<code>git rm --cached &amp;lt;file&amp;gt;</code>;</li>
<li>取消暂存区已经暂存的文件：<code>git reset HEAD &amp;lt;file&amp;gt;...</code>;</li>
<li>撤销上一次对文件的操作：<code>git checkout --&amp;lt;file&amp;gt;</code>。要确定上一次对文件的修改不再需要，如果想保留上一次的修改以备以后继续工作，可以使用stashing和分支来处理；</li>
<li>隐藏当前变更，以便能够切换分支：<code>git stash</code>；</li>
<li>查看当前所有的储藏：<code>git stash list</code>；</li>
<li>应用最新的储藏：<code>git stash apply</code>，如果想应用更早的储藏：<code>git stash apply stash@{2}</code>；重新应用被暂存的变更，需要加上<code>--index</code>参数：<code>git stash apply --index</code>;</li>
<li>使用apply命令只是应用储藏，而内容仍然还在栈上，需要移除指定的储藏：<code>git stash drop stash{0}</code>;如果使用pop命令不仅可以重新应用储藏，还可以立刻从堆栈中清除：<code>git stash pop</code>;</li>
<li>在某些情况下，你可能想应用储藏的修改，在进行了一些其他的修改后，又要取消之前所应用储藏的修改。Git没有提供类似于 stash unapply 的命令，但是可以通过取消该储藏的补丁达到同样的效果：<code>git stash show -p stash@{0} | git apply -R</code>；同样的，如果你沒有指定具体的某个储藏，Git 会选择最近的储藏：<code>git stash show -p | git apply -R</code>；</li>
</ol>
<blockquote>
  <p>更新文件</p>
</blockquote>
<ol>
<li>重命名文件，并将已改名文件提交到暂存区：<code>git mv [file-original] [file-renamed]</code>;</li>
</ol>
<blockquote>
  <p>查新信息</p>
</blockquote>
<ol>
<li>查询当前工作区所有文件的状态：<code>git status</code>;</li>
<li>比较工作区中当前文件和暂存区之间的差异，也就是修改之后还没有暂存的内容：git diff；指定文件在工作区和暂存区上差异比较：<code>git diff &amp;lt;file-name&amp;gt;</code>;</li>
</ol>
<h1 id="idx-3">4. 暂存区上的操作命令</h1>
<blockquote>
  <p>提交文件到版本库</p>
</blockquote>
<ol>
<li>将暂存区中的文件提交到本地仓库中，即打上新版本：<code>git commit -m "commit_info"</code>;</li>
<li>将所有已经使用git管理过的文件暂存后一并提交，跳过add到暂存区的过程：<code>git commit -a -m "commit_info"</code>;</li>
<li>提交文件时，发现漏掉几个文件，或者注释写错了，可以撤销上一次提交：<code>git commit --amend</code>;</li>
</ol>
<blockquote>
  <p>查看信息</p>
</blockquote>
<ol>
<li>比较暂存区与上一版本的差异：<code>git diff --cached</code>;</li>
<li>指定文件在暂存区和本地仓库的不同：<code>git diff &amp;lt;file-name&amp;gt; --cached</code>;</li>
<li>查看提交历史：git log；参数<code>-p</code>展开每次提交的内容差异，用<code>-2</code>显示最近的两次更新，如<code>git log -p -2</code>;</li>
</ol>
<blockquote>
  <p>打标签</p>
</blockquote>
<p>Git 使用的标签有两种类型：<strong>轻量级的（lightweight）和含附注的（annotated）</strong>。轻量级标签就像是个不会变化的分支，实际上它就是个指向特定提交对象的引用。而含附注标签，实际上是存储在仓库中的一个独立对象，它有自身的校验和信息，包含着标签的名字，电子邮件地址和日期，以及标签说明，标签本身也允许使用 GNU Privacy Guard (GPG) 来签署或验证。一般我们都建议使用含附注型的标签，以便保留相关信息；当然，如果只是临时性加注标签，或者不需要旁注额外信息，用轻量级标签也没问题。</p>
<ol>
<li>列出现在所有的标签：<code>git tag</code>;</li>
<li>使用特定的搜索模式列出符合条件的标签，例如只对1.4.2系列的版本感兴趣：<code>git tag -l "v1.4.2.*"</code>;</li>
<li>创建一个含附注类型的标签，需要加<code>-a</code>参数，如<code>git tag -a v1.4 -m "my version 1.4"</code>;</li>
<li>使用git show命令查看相应标签的版本信息，并连同显示打标签时的提交对象：<code>git show v1.4</code>;</li>
<li>如果有自己的私钥，可以使用GPG来签署标签，只需要在命令中使用<code>-s</code>参数：<code>git tag -s v1.5 -m "my signed 1.5 tag"</code>;</li>
<li>验证已签署的标签：git tag -v ，如<code>git tag -v v1.5</code>;</li>
<li>创建一个轻量级标签的话，就直接使用git tag命令即可，连<code>-a</code>,<code>-s</code>以及<code>-m</code>选项都不需要，直接给出标签名字即可，如<code>git tag v1.5</code>;</li>
<li>将标签推送到远程仓库中：git push origin ，如<code>git push origin v1.5</code>；</li>
<li>将本地所有的标签全部推送到远程仓库中：<code>git push origin --tags</code>;</li>
</ol>
<blockquote>
  <p>分支管理</p>
</blockquote>
<ol>
<li>创建分支：<code>git branch &amp;lt;branch-name&amp;gt;</code>，如<code>git branch testing</code>；</li>
<li>从当前所处的分支切换到其他分支：<code>git checkout &amp;lt;branch-name&amp;gt;</code>，如<code>git checkout testing</code>；</li>
<li>新建并切换到新建分支上：<code>git checkout -b &amp;lt;branch-name&amp;gt;</code>;</li>
<li>删除分支：<code>git branch -d &amp;lt;branch-name&amp;gt;</code>；</li>
<li>将当前分支与指定分支进行合并：<code>git merge &amp;lt;branch-name&amp;gt;</code>;</li>
<li>显示本地仓库的所有分支：<code>git branch</code>;</li>
<li>查看各个分支最后一个提交对象的信息：<code>git branch -v</code>;</li>
<li>查看哪些分支已经合并到当前分支：<code>git branch --merged</code>;</li>
<li>查看当前哪些分支还没有合并到当前分支：<code>git branch --no-merged</code>;</li>
<li>把远程分支合并到当前分支：<code>git merge &amp;lt;remote-name&amp;gt;/&amp;lt;branch-name&amp;gt;</code>，如<code>git merge origin/serverfix</code>；如果是单线的历史分支不存在任何需要解决的分歧，只是简单的将HEAD指针前移，所以这种合并过程可以称为快进（Fast forward），而如果是历史分支是分叉的，会以当前分叉的两个分支作为两个祖先，创建新的提交对象；如果在合并分支时，遇到合并冲突需要人工解决后，再才能提交；</li>
<li>在远程分支的基础上创建新的本地分支<code>：git checkout -b &amp;lt;branch-name&amp;gt; &amp;lt;remote-name&amp;gt;/&amp;lt;branch-name&amp;gt;</code>，如<code>git checkout -b serverfix origin/serverfix</code>;</li>
<li>从远程分支checkout出来的本地分支，称之为跟踪分支。在跟踪分支上向远程分支上推送内容：<code>git push</code>。该命令会自动判断应该向远程仓库中的哪个分支推送数据；在跟踪分支上合并远程分支：<code>git pull</code>；</li>
<li>将一个分支里提交的改变移到基底分支上重放一遍：<code>git rebase &amp;lt;rebase-branch&amp;gt; &amp;lt;branch-name&amp;gt;</code>，如<code>git rebase master server</code>，将特性分支server提交的改变在基底分支master上重演一遍；使用rebase操作最大的好处是像在单个分支上操作的，提交的修改历史也是一根线；如果想把基于一个特性分支上的另一个特性分支变基到其他分支上，可以使用<code>--onto</code>操作：<code>git rebase --onto &amp;lt;rebase-branch&amp;gt; &amp;lt;feature branch&amp;gt; &amp;lt;sub-feature-branch&amp;gt;</code>，如<code>git rebase --onto master server client</code>；使用rebase操作应该遵循的原则是：<strong>一旦分支中的提交对象发布到公共仓库，就千万不要对该分支进行rebase操作</strong>；</li>
</ol>
<h1 id="idx-4">5.本地仓库上的操作</h1>
<ol>
<li>查看本地仓库关联的远程仓库：<code>git remote</code>；在克隆完每个远程仓库后，远程仓库默认为<code>origin</code>;加上<code>-v</code>的参数后，会显示远程仓库的<code>url</code>地址；</li>
<li>添加远程仓库，一般会取一个简短的别名：<code>git remote add [remote-name] [url]</code>，比如：<code>git remote add example git://github.com/example/example.git</code>;</li>
<li>从远程仓库中抓取本地仓库中没有的更新：<code>git fetch [remote-name]</code>，如<code>git fetch origin</code>;使用fetch只是将远端数据拉到本地仓库，并不自动合并到当前工作分支，只能人工合并。如果设置了某个分支关联到远程仓库的某个分支的话，可以使用<code>git pull</code>来拉去远程分支的数据，然后将远端分支自动合并到本地仓库中的当前分支；</li>
<li>将本地仓库某分支推送到远程仓库上：<code>git push [remote-name] [branch-name]</code>，如<code>git push origin master</code>；如果想将本地分支推送到远程仓库的不同名分支：<code>git push &amp;lt;remote-name&amp;gt; &amp;lt;local-branch&amp;gt;:&amp;lt;remote-branch&amp;gt;</code>，如<code>git push origin serverfix:awesomebranch</code>;如果想删除远程分支：<code>git push [romote-name] :&amp;lt;remote-branch&amp;gt;</code>，如<code>git push origin :serverfix</code>。这里省略了本地分支，也就相当于将空白内容推送给远程分支，就等于删掉了远程分支。</li>
<li>查看远程仓库的详细信息：<code>git remote show origin</code>；</li>
<li>修改某个远程仓库在本地的简称：<code>git remote rename [old-name] [new-name]</code>，如<code>git remote rename origin org</code>；</li>
<li>移除远程仓库：<code>git remote rm [remote-name]</code>；</li>
</ol>
<h1 id="idx-5">6. 忽略文件.gitignore</h1>
<p>一般我们总会有些文件无需纳入 Git 的管理，也不希望它们总出现在未跟踪文件列表。通常都是些自动生成的文件，比如日志文件，或者编译过程中创建的临时文件等。我们可以创建一个名为 .gitignore 的文件，列出要忽略的文件模式。如下例：</p>
<pre><code> <span class="hljs-comment"># 此为注释 – 将被 Git 忽略</span>
<span class="hljs-comment"># 忽略所有 .a 结尾的文件</span>
*.a
<span class="hljs-comment"># 但 lib.a 除外</span>
!<span class="hljs-class"><span class="hljs-keyword">lib</span>.<span class="hljs-title">a</span></span>
<span class="hljs-comment"># 仅仅忽略项目根目录下的 TODO 文件，不包括 subdir/TODO</span>
/TODO
<span class="hljs-comment"># 忽略 build/ 目录下的所有文件</span>
build/
<span class="hljs-comment"># 会忽略 doc/notes.txt 但不包括 doc/server/arch.txt</span>
doc/*.txt
<span class="hljs-comment"># 忽略 doc/ 目录下所有扩展名为 txt 的文件</span>
doc/**<span class="hljs-regexp">/*.txt
</span></code></pre>
<blockquote>
  <p>参考资料</p>
</blockquote>
<p><a href="https://link.juejin.im?target=https%3A%2F%2Fgit-scm.com%2Fbook%2Fzh%2Fv1%2F%25E8%25B5%25B7%25E6%25AD%25A5-%25E5%2585%25B3%25E4%25BA%258E%25E7%2589%2588%25E6%259C%25AC%25E6%258E%25A7%25E5%2588%25B6">非常详细准确的git学习资料</a>；</p>
<p><a href="https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2Fflyhigher139%2FGit-Cheat-Sheet%23%25E9%2585%258D%25E7%25BD%25AE">git-cheat-sheet中文版</a></p>
<p><a href="https://link.juejin.im?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2015%2F12%2Fgit-cheat-sheet.html">命令总结，资料一般，不够详细，作参考</a></p>
<p><a href="https://link.juejin.im?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2015%2F12%2Fgit-cheat-sheet.html">常用命令很全</a></p>
<blockquote>
  <p><a href="https://juejin.im/post/5ae072906fb9a07a9e4ce596#heading-4">原文链接https://juejin.im/post/5ae072906fb9a07a9e4ce596#heading-4</a></p>
</blockquote>`