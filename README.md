# 为 KamePT(NexusPHP) 打造的种子列表瀑布流视图

![gif_preview.gif](https://github.com/KesaubeEire/PT_TorrentList_Masonry/blob/main/preview/gif_preview01.gif?raw=true)

<!-- ![gif_preview.gif](https://github.com/KesaubeEire/PT_TorrentList_Masonry/blob/main/preview/gif_preview02.gif?raw=true) -->

<!-- ![gif_preview.gif](https://github.com/KesaubeEire/PT_TorrentList_Masonry/blob/main/preview/gif_preview03.gif?raw=true) -->

<!-- ![gif_preview.gif](https://github.com/KesaubeEire/PT_TorrentList_Masonry/blob/main/preview/gif_preview.gif?raw=true) -->

[github 项目地址~](https://github.com/KesaubeEire/PT_TorrentList_Masonry)

RT, 本油猴脚本(目前)专为 KamePT 打造, 让你顺畅划划划, 不必点翻页!

欢迎为项目提 [issue](https://github.com/KesaubeEire/PT_TorrentList_Masonry/issues) 以及留言配置您想适配的站点~  

相关事宜如果您在 tg 能找到我也可以直接联系我~

<!-- ![gif_preview.gif](./preview/gif_preview.gif) -->

- 其他事务
  - [x] 将 油猴脚本从成人区撤离, 改为正常
  - [x] 将 特别区作为截图示范, 添加 /special.php 的适配
- 功能列表

  - [x] 懒加载(from tg by @兔纸)
  - [x] 触摸图片预览原图(from tg by @兔纸)
  - [ ] 默认将自动翻页改为按键翻页(from tg by @兔纸)
  - [x] 瀑布流基础排版
  - [x] 滑动到底部刷新页面
  - [ ] 美化卡片内信息布局 & 样式

      - [ ] 抄鲨鱼的 UI 样式, Free 的提示什么的(from tg by @兔纸)
      - [x] 基本布局
      - [x] 点击整个卡片跳转(from tg by @风言)
         - [x] 没有完全弄成那样, 会妨碍下载和收藏, 把图片和副标题点击跳网页做了
      - [ ] 点击卡片不是打开新页面，而是在本页面打开 iframe 直接看内容，看完关掉，都不用切换页面了
      - [ ] 显示当前是否下载以及下载进度(from tg by @Charlie Swift)
      - [x] 卡片背景颜色适配主题(from tg by @LNN)
      - [x] 去掉副标题(from tg by @lslqtz)
      - [x] 右上角按钮z-index置顶(from tg by @lslqtz)

  - [ ] 将一些参数配置为可变
      - [ ] 配置 LocalStorage 记录参数捏
      - [x] 单列宽度可调整(已 api 实现, 还需要简化操作方式)
         - [x] UI 化宽度调整 -> 右上角可设置单列 200px / 300px 切换
      - [ ] 分卡片固定宽度模式和列数固定宽度模式
         - [x] 卡片固定宽度模式: 默认模式
         - [ ] 列数固定宽度模式: 默认固定列数可调, 不少于x列 (from tg by @兔纸)
      - [ ] 设置详情文字左对齐 or 居中
      - [ ] 配置可以忽略详情只剩标题图片

  - [ ] 对接原方案适配鼠标上移图片预览
  - [ ] 原 table 也随着滑动到底部自动添加数据
  - [ ] 适配所有 np 的站点? 考虑中......
      - [ ] MT 一定要适配捏

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
      - [ ] ...