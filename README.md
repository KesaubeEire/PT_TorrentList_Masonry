# 为 PT站点 打造的种子列表瀑布流视图 (现支持 Kame & MT & 猫站)

![gif_preview.gif](https://github.com/KesaubeEire/PT_TorrentList_Masonry/blob/main/preview/gif_preview.gif?raw=true)

预览视频:  

https://user-images.githubusercontent.com/20382002/236703818-427840b9-aaee-4133-9185-59244245cb7b.mov

<!-- https://raw.githubusercontent.com/KesaubeEire/PT_TorrentList_Masonry/main/preview/_input.mov -->
<!-- https://github.com/KesaubeEire/PT_TorrentList_Masonry/blob/main/preview/_input.mov?raw=true -->

[github 项目地址~](https://github.com/KesaubeEire/PT_TorrentList_Masonry)

RT, 本油猴脚本(目前)专为 PT 打造, 让你顺畅划划划, 一页爽逛种子超时!

欢迎为项目提 [issue](https://github.com/KesaubeEire/PT_TorrentList_Masonry/issues) 以及留言配置您想适配的站点~  

相关事宜如果您在 tg 能找到我也可以直接联系我~

<!-- ![gif_preview.gif](./preview/gif_preview.gif) -->

## 使用说明

0. 建议使用Chrome浏览器, 火狐等其他浏览器可能存在不知名问题(from tg by 天 胖)
1. 本脚本功能:
   1. 支持在已适配的站点将种子列表变为瀑布流视图  
   1. 在右上角的按钮区域可以设置各种配置(暂未适配记忆设置的功能, 很快会出)  
      1. 可以显示原种子表格
      1. 可以切换卡片宽度
      1. 可以改变加载方式: 以点击页尾的按钮或者直接自动底部检测
      1. 可以在布局混乱的时候手动整理布局(暂时没有做完全自动整理)
   1. 鼠标放在图片上可以预览大图
   1. <span style="color: red"><b>点击列和列之间的间隙也可以整理布局! 不需要鼠标移到右上角了!!!</b></span>
   1. 懒加载: 对电脑性能和服务器负担都比较小~
2. 推荐设置:
   1. 如果PT站点是 NexusPHP 架构, 推荐将主题改为 Blue Gene  
      (一般更改主题方式: 控制面板->网站设定->界面风格)
   1. 某些站点限制网页刷新频率, 所以默认翻页是要点按钮的,   
      可以右上手动改为自动检测翻页, 请理解~
## TODO LIST

- 其他事务
  - [x] 将 油猴脚本从成人区撤离, 改为正常
  - [x] 将 特别区作为截图示范, 添加 /special.php 的适配
  - [ ] TODO: 在 readme.md 中把架构图画出来以防屎山(from tg by @兔纸)
- 功能列表

  - [x] 懒加载(from tg by @兔纸)
      - [x] 懒加载完成后新图片出来之际整理瀑布流
      - [x] 修复了一些小的懒加载不出图的小 bug
  - [x] 触摸图片预览原图(from tg by @兔纸)
      - [x] 修正右边图片的预览位置
         - [x] <s>抄[某pixiv油猴脚本](https://github.com/Ocrosoft/PixivPreviewer)的实现(from tg by @兔纸)</s> 失败了, 有点复杂
         - [x] 自己改了改, 基本修正了
         - TODO: [ ] 想到了更好的四空间(四叉树)改造法, 之后改上去
  - [x] 默认将自动翻页改为按键翻页(from tg by @兔纸)
      - [x] <s>抄 NGA 的方式下拉到底后触点下一页(from tg by @兔纸)</s> 不太好用捏
  - [x] 瀑布流基础排版
  - [x] 滑动到底部刷新页面
  - [x] 美化卡片内信息布局 & 样式

      - [x] <s>抄鲨鱼的 UI 样式, Free 的提示什么的(from tg by @兔纸)</s> 用原样了捏
      - [x] 基本布局
      - [x] 点击整个卡片跳转(from tg by @风言)
         - [x] 没有完全弄成那样, 会妨碍下载和收藏, 把图片和副标题点击跳网页做了
      - [ ] TODO: 点击卡片不是打开新页面，而是在本页面打开 iframe 直接看内容，看完关掉，都不用切换页面了
      - [ ] TODO: 显示当前是否下载以及下载进度(from tg by @Charlie Swift)
      - [x] 卡片背景颜色适配主题(from tg by @LNN)
      - [x] 去掉副标题(from tg by @lslqtz)
      - [x] 右上角按钮z-index置顶(from tg by @lslqtz)
      - [x] 标签样式改为 div 的多行 flex(from tg by @bacz)

  - [ ] 将一些参数配置为可变
      - [ ] 配置 LocalStorage 记录参数捏
      - [x] 单列宽度可调整(已 api 实现, 还需要简化操作方式)
         - [x] UI 化宽度调整 -> 右上角可设置单列 200px / 300px 切换
      - [ ] 分卡片固定宽度模式和列数固定宽度模式
         - [x] 卡片固定宽度模式: 默认模式
         - [ ] 列数固定宽度模式: 默认固定列数可调, 不少于x列 (from tg by @兔纸)
      - [ ] 设置详情文字左对齐 or 居中
      - [ ] NOTE: 配置可以忽略详情只剩标题图片的简略模式
      - [ ] 配置按钮区域可拖动
         - [ ] 排序区按钮(from tg by 天 胖)
         - [ ] 卡片宽度 & 间距宽度 调整
         - [ ] 简洁模式 & 详细模式 切换
         - [ ] 跟随预览 & 中间预览 切换(from tg by 天 胖)


  - [ ] 原 table 也随着滑动到底部自动添加数据
  - [ ] 适配所有 np 的站点? 考虑中......
      - [x] MT 已适配

  - [ ] 花样小bug

      - [x] 下载按钮 href
      - [x] 改为宽列后, 新增的卡片仍然按照原先的列宽生成卡片
      - [x] 当下拉页没有新内容时控制台优雅报错 
      - [x] 缩放小于 95% 时右侧有空隙 -> 不清楚真实的4K屏幕会不会有影响, 只能先这样设置边框为 3px
      - [x] 点击收藏后刷新页面 or 直接更新收藏图标
         - [ ] UI 提示
      - [x] 标题过长的话半透明背景可能会导致文字与图片重叠 (from tg by @bacz)
      - [x] 测试网站地址漏了 (from tg by @bacz)
      - [x] 收藏按钮样式调整 (from tg by @bacz)
      - [x] 图片链接多此一举了, 直接搬原链即可 (from tg by @Kyaru)
      - [x] 预览大图片的bug基本修完, 可继续改进
      - [x] 集成 Masonry.js 到项目, 非常感谢胖哥!!!(from tg by 天 胖)
      - [ ] 让下载和收藏都变成隐藏按钮: 现在下载还不是隐藏按钮
      - [ ] ...

  - [ ] 站点状态对齐
      - [x] KamePT.js: 最新 (卡片顶部种类样式待更新)
      - [x] MTeam.js: 最新
      - [x] PTer.js: 最新
      
  - [ ] github & 油猴介绍 数据脱敏 (from tg by 天 胖)
      - [ ] 去除匹配站点的域名展示
      - [ ] 去除匹配站点的原始匹配
      


<details>
    <summary><s>记录一些小小的暴论(嘻嘻本人不要打我)</s></summary>
    <p>1. 违反用户直觉的都是垃圾程序 by兔纸(2023/05/08 18:39)</p>
</details>