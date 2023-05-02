// ==UserScript==
// @name            KamePT种子列表无限下拉瀑布流视图
// @name:en         KamePT_waterfall_torrent
// @namespace       https://github.com/KesaubeEire/PT_TorrentList_Masonry
// @version         0.2.1
// @description     KamePT种子列表无限下拉瀑布流视图(描述不能与名称相同, 乐)
// @description:en  KamePT torrent page waterfall view
// @author          Kesa
// @match           https://kamept.com/torrents.php*
// @icon            https://kamept.com/favicon.ico
// @grant           none
// @license         MIT
// ==/UserScript==

// FIXME:
// 0. 一些顶层设计 --------------------------------------------------------------------------------------
// |-- 0.1 顶层参数&对象
/** kame 域名 */
const domain = "https://kamept.com/";

/** 瀑布流对象 */
var masonry;
window.masonry = masonry;

/** 瀑布流卡片相关参数顶层对象 */
const CARD = {
  /** 瀑布流卡片宽度 */
  CARD_WIDTH: 200,

  /** 瀑布流卡片边框宽度 -> 这个2是真值, 但是边框好像是会随着分辨率和缩放变化, 给高有利大分辨率, 给低有利于小分辨率 */
  CARD_BORDER: 3,

  /** 瀑布流卡片索引 */
  CARD_INDEX: 0,
};
window.CARD_WIDTH = CARD.CARD_WIDTH;

/** 翻页相关参数顶层对象 */
const PAGE = {
  /** 翻页: 底部检测时间间隔 */
  GAP: 900,

  /** 翻页: 底部检测视点与底部距离 */
  DISTANCE: 300,

  /** 翻页: 是否为初始跳转页面 */
  IS_ORIGIN: true,

  /** 翻页: 当前页数 */
  PAGE_CURRENT: 0,

  /** 翻页: 下一页数 */
  PAGE_NEXT: 0,

  /** 翻页: 下一页的链接 */
  NEXT_URL: "",
};

/** 网站图标链接 */
const ICON = {
  /** 大小图标 */
  SIZE: '<img class="size" src="pic/trans.gif" style=" transform: translateY(-0.4px);" alt="size" title="大小">',
  /** 评论图标 */
  COMMENT:
    '<img class="comments" src="pic/trans.gif" alt="comments" title="评论数">',
  /** 上传人数图标 */
  SEEDERS:
    '<img class="seeders" src="pic/trans.gif" alt="seeders" title="种子数">',
  /** 下载人数图标 */
  LEECHERS:
    '<img class="leechers" src="pic/trans.gif" alt="leechers" title="下载数">',
  /** 已完成人数图标 */
  SNATCHED:
    '<img class="snatched" src="pic/trans.gif" alt="snatched" title="完成数">',
  /** 下载图标 */
  DOWNLOAD:
    '<img class="download" src="pic/trans.gif" style=" transform: translateY(1px);" alt="download" title="下载本种">',
  /** 未收藏图标 */
  COLLET:
    '<img class="delbookmark" src="pic/trans.gif" alt="Unbookmarked" title="收藏">',
  /** 已收藏图标 */
  COLLETED: '<img class="bookmark" src="pic/trans.gif" alt="Bookmarked">',
};

// |-- 0.1 顶层方法
/**
 * 将 种子列表dom 的信息变为 json对象列表
 * @param {DOM} torrent_list_Dom 种子列表dom
 * @returns {list} 种子列表信息的 json对象列表
 */
function TORRENT_LIST_TO_JSON(torrent_list_Dom) {
  // 获取表格中的所有行
  const rows = torrent_list_Dom.querySelectorAll("tr");
  // const rows = div.querySelectorAll('tr');

  // 种子信息 -> 存储所有行数据的数组
  const data = [];

  // index
  // let index = 0;

  // 遍历每一行并提取数据
  rows.forEach((row) => {
    // 获取种子分类
    const categoryImg = row.querySelector("td:nth-child(1) > a > img");
    const category = categoryImg ? categoryImg.alt : "";
    // 若没有分类则退出
    if (!category) return;

    // 加index
    const torrentIndex = CARD.CARD_INDEX++;

    // 获取种子名称
    const torrentNameLink = row.querySelector(".torrentname a");
    const torrentName = torrentNameLink
      ? torrentNameLink.textContent.trim()
      : "";

    // 获取种子详情链接
    const torrentLink = torrentNameLink.href;
    // console.log(torrentLink);

    // 获取种子id
    const pattern = /id=(\d+)&hit/;
    const match = torrentLink.match(pattern);
    const torrentId = match ? parseInt(match[1]) : null;

    // 获取预览图片链接
    let picLink = row
      .querySelector(".torrentname img")
      .getAttribute("data-src");
    // -- 没有加域名前缀的加上
    if (!picLink.includes("http")) picLink = domain + picLink;

    // 获取置顶信息
    const place_at_the_top = row.querySelector(".torrentname img.sticky");
    const pattMsg = place_at_the_top ? place_at_the_top.title : "";

    // 获取下载链接
    const downloadLink = `${domain}download.php?id=${torrentId}`;

    // 获取收藏链接
    const collectLink = `javascript: bookmark(${torrentId},${torrentIndex});`;
    // 获取收藏状态
    const collectDOM = row.querySelector(".torrentname a[id^='bookmark']");
    const collectState = collectDOM.children[0].alt;
    console.log(collectState);

    // 获取免费折扣类型
    const freeTypeImg = row.querySelector('img[class^="pro_"]');
    // console.log(freeTypeImg);
    // console.log(freeTypeImg.alt);
    const freeType = freeTypeImg ? freeTypeImg.alt : "";

    // 获取免费剩余时间
    const freeRemainingTimeSpan = row.querySelector("font");
    const freeRemainingTime = freeRemainingTimeSpan
      ? freeRemainingTimeSpan.innerText
      : "";

    // 获取标签
    const tagSpans = row.querySelectorAll(".torrentname span");
    // const raw_tags = row.querySelector(".torrentname");
    const tagsDOM = Array.from(tagSpans);
    let tags = tagSpans ? tagsDOM.map((span) => span.textContent.trim()) : [];

    // console.log(index);
    // console.log(torrentName);
    // console.log(tags);

    if (freeType != "") {
      // console.log(tags[0]);
      tags.shift();
      tagsDOM.shift();
    }
    const raw_tags = tagsDOM.map((el) => el.outerHTML).join("");
    // console.log(raw_tags);

    // 获取描述
    const descriptionCell = row.querySelector(".torrentname td:nth-child(2)");

    const str = descriptionCell.innerHTML;
    let desResult;
    // -- 前处理
    if (str.lastIndexOf("</span>") > str.lastIndexOf("<br>")) {
      desResult = str.substring(str.lastIndexOf("</span>") + 7); // 加 7 是为了去掉 "</span>" 的长度
    } else {
      desResult = str.substring(str.lastIndexOf("<br>") + 4); // 加 7 是为了去掉 "</span>" 的长度
    }
    // -- 后处理
    desResult = desResult.split("<div")[0];
    const description = desResult ? desResult.trim() : "";

    // 获取评论数量
    const commentsLink = row.querySelector("td.rowfollow:nth-child(3) a");
    // console.log(commentsLink.innerHTML);
    const comments = commentsLink ? parseInt(commentsLink.textContent) : 0;

    // 获取上传日期
    const uploadDateSpan = row.querySelector("td:nth-child(4) span");
    const uploadDate = uploadDateSpan ? uploadDateSpan.title : "";

    // 获取文件大小
    const sizeCell = row.querySelector("td:nth-child(5)");
    const size = sizeCell ? sizeCell.textContent.trim() : "";

    // 获取做种人数
    const seedersLink = row.querySelector("td:nth-child(6) a");
    const seeders = seedersLink ? parseInt(seedersLink.textContent) : 0;

    // 获取下载人数
    const leechersCell = row.querySelector("td:nth-child(7)");
    const leechers = leechersCell ? parseInt(leechersCell.textContent) : 0;

    // 获取完成下载数
    const snatchedLink = row.querySelector("td:nth-child(8) a");
    const snatched = snatchedLink ? parseInt(snatchedLink.textContent) : 0;

    // 将当前行的数据格式化为 JSON 对象
    const rowData = {
      torrentIndex,
      category,
      torrent_name: torrentName,
      torrentLink,
      torrentId,
      picLink,
      pattMsg,
      downloadLink,
      collectLink,
      collectState,
      free_type: freeType,
      free_remaining_time: freeRemainingTime,
      raw_tags,
      tags,
      description,
      comments,
      upload_date: uploadDate,
      size,
      seeders,
      leechers,
      snatched,
    };

    // 将当前行的 JSON 对象添加到数组中
    data.push(rowData);
  });
  return data;
}

/**
 * 将种子列表信息渲染为卡片放入瀑布流
 * @param {DOM} waterfallNode 瀑布流容器dom
 * @param {list} torrent_json 种子列表信息的 json对象列表
 * @param {boolean} isFirst 是否是第一次渲染, 默认为是, 新增渲染要写 false
 */
function RENDER_TORRENT_JSON_IN_MASONRY(
  waterfallNode,
  torrent_json,
  isFirst = true
) {
  const cardTemplate = (data) => {
    const {
      torrentIndex,
      category,
      torrent_name: torrentName,
      torrentLink,
      torrentId,
      picLink,
      pattMsg,
      downloadLink,
      collectLink,
      collectState,
      free_type: freeType,
      free_remaining_time: freeRemainingTime,
      raw_tags,
      tags,
      description,
      comments,
      upload_date: uploadDate,
      size,
      seeders,
      leechers,
      snatched,
    } = data;

    return `
<!-- 分区类别 -->
<div class="card-category">
  ${category}
</div>

<!-- 标题 & 跳转详情链接 -->    
<div class="card-title">
  <a class="two-lines" src="${torrentLink}" href="${torrentLink}" target="_blank">
    <strong>${torrentName}</strong>
  </a>
</div>
<div class="card-body">
  <div class="card-image">
    <img class="card-image--img" src="${picLink}" alt="${torrentName}" />
    <div class="card-index">
      ${torrentIndex + 1}
    </div>  
  </div>

  <!-- 副标题 -->
  ${
    description
      ? `<div class="card-description"><strong>副标题:</strong> ${description}</div>`
      : ""
  }
  

  <!-- 标签 Tags -->
  <div class="card-line cl-tags">
    ${raw_tags}
    <!-- <strong>Tags:</strong> ${tags.join(", ")} -->
  </div>

  <div class="card-alter">
    <!-- 免费类型 & 免费剩余时间 -->
    ${
      freeType
        ? `
          <div 
            class="${freeType}" 
            style="color:${freeType == "Free" ? "blue" : "green"}">
            <strong>${freeType}:</strong> ${freeRemainingTime}
          </div>
          `
        : ""
    }
    <!-- 置顶等级 -->
    ${pattMsg ? `<div><strong>置顶等级:</strong> ${pattMsg}</div>` : ""}
  </div>

  <div class="card-details">  
    <div class="card-line">
      <!-- 大小 -->
      <div class="cl-center">
        ${ICON.SIZE}&nbsp;${size}
      </div> 

      <!-- 下载 -->
      &nbsp;&nbsp;
      <div class="cl-center">
        ${ICON.DOWNLOAD}&nbsp;
        <strong><a src="${downloadLink}" href="${downloadLink}">下载</a></strong>
      </div>

      <!-- 收藏 -->
      &nbsp;&nbsp;
      <div class="cl-center">
        <button class="btnCollet cl-center" id="tI_${torrentIndex}" onclick='COLLET_AND_ICON_CHANGE("${collectLink}", "tI_${torrentIndex}")'>
        ${collectState == "Unbookmarked" ? ICON.COLLET : ICON.COLLETED}
        &nbsp;收藏
        </button>
      </div>
    </div>
    
    <!-- 种子id, 默认不显示 -->
    <!--<div class="card-line"><strong>Torrent ID:</strong> ${torrentId}</div> -->
    
    <!-- 上传时间 -->
    <div class="card-line"><strong>上传时间:</strong> ${uploadDate}</div>
    
    <div class="card-line">
      ${ICON.COMMENT}&nbsp;<strong>${comments}</strong>&nbsp;&nbsp;
      ${ICON.SEEDERS}&nbsp;<strong>${seeders}</strong>&nbsp;&nbsp;
      ${ICON.LEECHERS}&nbsp;<strong>${leechers}</strong>&nbsp;&nbsp;
      ${ICON.SNATCHED}&nbsp;<strong>${snatched}</strong>
    </div>    
  </div>
</div>

    `;
  };

  for (const rowData of torrent_json) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = cardTemplate(rowData);

    // 生成新的时候再改一次图片宽度
    card.style.width = `${CARD.CARD_WIDTH}px`;
    // z-index 逐渐变小, 使得展开标题时本卡片的内容可以不被下面的卡片遮挡
    card.style.zIndex = 10000 - rowData.torrentIndex;

    //  |--|-- 3.1.1 渲染完成图片后调整构图
    const card_img = card.querySelector(".card-image--img");
    card_img.onload = function () {
      // 加载完图片后重新布局 Masonry
      if (masonry) {
        // TODO: 这里可以写个防抖优化性能
        // TODO: 人好像自带防抖的, 哈哈......
        masonry.layout();
      }

      // // TODO:加载完图片添加鼠标触摸预览
      // var imgEle,
      //   selector = "img.preview",
      //   imgPosition;
      // jQuery("body")
      //   .on("mouseover", selector, function (e) {
      //     imgEle = jQuery(card_img);
      //     // previewEle = jQuery('<img style="display: none;position:absolute;">').appendTo(imgEle.parent())
      //     imgPosition = getImgPosition(e, imgEle);
      //     let position = getPosition(e, imgPosition);
      //     let src = imgEle.attr("src");
      //     if (src) {
      //       previewEle.attr("src", src).css(position).fadeIn("fast");
      //     }
      //   })
      //   .on("mouseout", selector, function (e) {
      //     // previewEle.remove()
      //     // previewEle = null
      //     previewEle.hide();
      //   })
      //   .on("mousemove", selector, function (e) {
      //     let position = getPosition(e, imgPosition);
      //     previewEle.css(position);
      //   });
    };

    //  |--|-- 3.1.2 插入生成的元素
    //  |--|--|-- 3.1.2.1 第一次默认生成
    waterfallNode.appendChild(card);

    //  |--|--|-- 3.1.2.2 非第一次生成
    if (!isFirst) {
      // console.log("not first ----------------------------");
      // console.log(card);
      masonry.appended(card);
    }
  }
}

/**
 * 整合上面两个函数: 将种子列表转为瀑布流
 * @param {DOM} torrent_list_Dom 种子列表dom
 * @param {DOM} waterfallNode 瀑布流容器dom
 * @param {boolean} isFirst 是否是第一次渲染, 默认为是, 新增渲染要写 false
 */
function PUT_TORRENT_INTO_MASONRY(
  torrent_list_Dom,
  waterfallNode,
  isFirst = true
) {
  /** 种子列表信息的 json对象列表 */
  const data = TORRENT_LIST_TO_JSON(torrent_list_Dom);

  // DEBUG:打印获得的数据
  console.log(`渲染行数: ${data.length}`);
  // console.log(data);

  // 将种子列表信息渲染为卡片放入瀑布流
  RENDER_TORRENT_JSON_IN_MASONRY(waterfallNode, data, isFirst);
}

/**
 * 根据容器宽度和卡片宽度动态调整卡片间隔 gutter
 * @param {DOM} containerDom 容器dom
 * @param {number} card_width 卡片宽度
 */
function GET_CARD_GUTTER(containerDom, card_width) {
  // 获取容器宽度
  const _width = containerDom.clientWidth;

  // 获取一个合适的 gutter
  const card_real_width = card_width + CARD.CARD_BORDER;
  const columns = Math.floor(_width / card_real_width);
  const gutter = (_width - columns * card_real_width) / (columns - 1);
  // console.log(`列数:${columns} 间隔:${gutter}`);
  // console.log(
  //   `容器宽:${_width} 列宽:${masonry ? masonry.columnWidth : "对象"}`
  // );

  return Math.floor(gutter);
}

/**
 * 动态调整卡片宽度
 * @param {number} targetWidth
 * @param {DOM} containerDom 容器dom
 * @param {object} masonry 瀑布流对象
 */
function CHANGE_CARD_WIDTH(targetWidth, containerDom, masonry) {
  // 改变卡片宽度
  for (const card of containerDom.childNodes) {
    // console.log(CARD.CARD_WIDTH);
    card.style.width = `${targetWidth}px`;
  }

  // 调整卡片间隔 gutter
  masonry.options.gutter = GET_CARD_GUTTER(containerDom, targetWidth);

  // 重新布局瀑布流
  masonry.layout();
}

/**
 * 执行收藏动作并对制定卡片切换图标
 * @param {string} jsCodeLink js的收藏代码
 * @param {string} card_id 种子卡片id
 */
function COLLET_AND_ICON_CHANGE(jsCodeLink, card_id) {
  // console.log(jsCodeLink, card_id);
  try {
    // 收藏链接
    window.location.href = jsCodeLink;

    // 操作相应的收藏图片
    const btn = document.querySelector(`button#${card_id}`);
    const img = btn.children[0];
    img.className = img.className == "delbookmark" ? "bookmark" : "delbookmark";
    // console.log(btn);
  } catch (error) {
    // GUI 通知一下捏
    console.error(error);
  }
}
window.COLLET_AND_ICON_CHANGE = COLLET_AND_ICON_CHANGE;

/**
 * 防抖函数
 * @param {function} func 操作函数
 * @param {number} delay 延迟
 * @returns
 */
function debounce(func, delay) {
  var timer;
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
}

(function () {
  "use strict";
  // FIXME:
  // 1. 隐藏原种子列表并进行前置操作 --------------------------------------------------------------------------------------
  // 表格节点
  const tableNode = document.querySelector("table.torrents");

  // 表格父节点
  const parentNode = tableNode.parentNode;

  // 删除原有视图
  // parentNode.removeChild(tableNode);

  // 隐藏原有视图
  tableNode.style.display = "none";

  // 放置瀑布流的节点
  const waterfallNode = document.createElement("div");

  // 添加class
  waterfallNode.classList.add("waterfall");

  // 将瀑布流节点放置在表格节点上面
  parentNode.insertBefore(waterfallNode, tableNode.nextSibling);

  // 生成按钮 -> 可以随时显示原来的表格
  const btnViewOrigin = document.getElementById("btnViewOrigin");
  // 创建一个按钮元素
  const toggleBtn = document.createElement("button");
  toggleBtn.classList.add("debug");
  toggleBtn.setAttribute("id", "toggle_oldTable");
  toggleBtn.innerText = "显示原种子表格";

  // 为按钮添加事件监听器
  toggleBtn.addEventListener("click", function () {
    if (tableNode.style.display === "none") {
      tableNode.style.display = "block";
      toggleBtn.innerText = "隐藏原种子表格";
    } else {
      tableNode.style.display = "none";
      toggleBtn.innerText = "显示原种子表格";
    }
  });
  // 将按钮插入到文档中
  document.body.appendChild(toggleBtn);

  // 生成按钮 -> Masonry 重新排列
  const btnReLayout = document.getElementById("btnReLayout");
  // 创建一个按钮元素
  const reLayoutBtn = document.createElement("button");
  reLayoutBtn.classList.add("debug");
  reLayoutBtn.setAttribute("id", "btnReLayout");
  reLayoutBtn.innerText = "单列宽度切换(200/300)";

  // 为按钮添加事件监听器
  reLayoutBtn.addEventListener("click", function () {
    if (masonry) {
      masonry.layout();
    }

    // 动态调整卡片宽度
    CARD.CARD_WIDTH = CARD.CARD_WIDTH == 200 ? 300 : 200;
    CHANGE_CARD_WIDTH(CARD.CARD_WIDTH, waterfallNode, masonry);
    masonry.layout();

    // // 改变卡片宽度
    // for (const card of waterfallNode.childNodes) {
    //   console.log(CARD.CARD_WIDTH);
    //   card.style.width = `${CARD.CARD_WIDTH}px`;
    // }

    // // 调整卡片间隔 gutter
    // masonry.options.gutter = GET_CARD_GUTTER(waterfallNode, CARD.CARD_WIDTH);

    // // 重新布局瀑布流
    // masonry.layout();
  });
  // 将按钮插入到文档中
  document.body.appendChild(reLayoutBtn);

  // FIXME:
  // 2. 将种子列表信息搞下来 html -> json 对象 --------------------------------------------------------------------------------------
  // 获取表格 Dom
  const table = document.querySelector("table.torrents");

  // /** 种子列表信息的 json对象列表 */
  // const data = TORRENT_LIST_TO_JSON(table);

  // // FIXME:
  // // 3. 开整瀑布流 --------------------------------------------------------------------------------------
  // // -- 3.1 搞定卡片模板
  // // 将种子列表信息渲染为卡片放入瀑布流
  // RENDER_TORRENT_JSON_IN_MASONRY(waterfallNode, data);

  // -----------
  // 一步到位整合上面步骤: 将种子列表转为瀑布流
  PUT_TORRENT_INTO_MASONRY(table, waterfallNode);

  // -- 3.2 调整 css
  // 使用中的css
  const css = `

/* 瀑布流主容器 */
div.waterfall{
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  border-radius: 20px;
  height: 100%;

  /* margin: 0 auto; */
  margin: 20px auto;
}

/* 调试按键统一样式 */
button.debug {
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 4px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}  

/* 调试按键1: 显示隐藏原种子列表 */
button#toggle_oldTable {
  top: 10px;
}

/* 调试按键2: Masonry 重新排列 */
button#btnReLayout {
  top: 40px;
}  

/* 卡片 */
.card {
  width: ${CARD.CARD_WIDTH}px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: white;
  /* box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); */
  /* margin: 10px; */
  margin: 6px 0;
  padding-bottom: 2px;
}

/* 卡片行默认样式 */
.card-line{
  margin-bottom: 1px;

  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

/* 卡片标题: 默认两行 */
.two-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  transition: color 0.3s;
}

/* 卡片标题: hover时变为正常 */
.two-lines:hover {
  -webkit-line-clamp: 100;
}

/* 卡片信息: flex 居中 */
.cl-center{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

/* 卡片信息行: 标签行 */
.cl-tags{
  display: flex;
  justify-content: left;
  align-items: center;
  
  transform: translateX(4px);
}

/* 卡片简介总容器 */
.card-details{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

/* 卡片图像div */
.card-image {
  height: 100%;
  position: relative;
  margin-bottom: 2px;
}

/* 卡片图像div -> img标签 */
.card-image img {
  width: 100%;
  object-fit: cover;
}

/* 卡片可选信息 */
.card-alter{
  text-align: center;
}

/* 卡片索引 */
.card-index{
  position: absolute;
  top: 0;
  left: 0;
  padding-right: 9px;
  padding-left: 2px;
  margin: 0;
  height: 20px;
  line-height: 16px;
  font-size: 16px;

  background-color: rgba(0,0,0,0.7);
  color: yellow;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;

  display: flex;
  align-items: center;
}

/* 卡片索引 */
.btnCollet{
  padding: 1px 2px;
}
`;

  // 注释中的css
  const css_commented = `

`;

  // -- 3.3 引入 Masonry 库

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // 创建script标签
  var script = document.createElement("script");
  // 设置script标签的src属性为Masonry库的地址
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js";
  // 将script标签添加到head标签中
  document.getElementsByTagName("head")[0].appendChild(script);

  //    -- 3.3.1 初始化 Masonry 参数
  script.onload = function () {
    // 初始化瀑布流布局
    masonry = new Masonry(waterfallNode, {
      itemSelector: ".card",
      columnWidth: ".card",
      gutter: GET_CARD_GUTTER(waterfallNode, CARD.CARD_WIDTH),
    });

    // console.log(masonry);

    //    -- 3.3.2 监听窗口大小变化事件
    window.addEventListener("resize", function () {
      // 调整卡片间隔 gutter
      masonry.options.gutter = GET_CARD_GUTTER(waterfallNode, CARD.CARD_WIDTH);

      // 重新布局瀑布流
      masonry.layout();
    });

    // 重新布局瀑布流
    masonry.layout();

    // 绑定 Masonry 对象到 window
    window.masonry = masonry;
  };

  // FIXME:
  // 4. 底部检测 & 加载下一页 --------------------------------------------------------------------------------------
  // |-- 4.1 检测是否到了底部

  /** 延迟加载事件变量名 */
  let debounceLoad;

  window.addEventListener("scroll", function () {
    const scrollHeight = document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop + clientHeight >= scrollHeight - PAGE.DISTANCE) {
      debounceLoad();
    }
  });

  // |-- 4.2 加载下一页
  debounceLoad = debounce(function () {
    console.log("到页面底部啦!!! Scrolled to bottom!");
    // |--|-- 4.2.1 获取下一页的链接
    // 使用 URLSearchParams 对象获取当前网页的查询参数
    const urlSearchParams = new URLSearchParams(window.location.search);

    // 获取名为 "page" 的参数的值 -> 初始为页面值, 更新为更新值
    PAGE.PAGE_CURRENT = PAGE.IS_ORIGIN
      ? urlSearchParams.get("page")
      : PAGE.PAGE_CURRENT;

    // 如果 "page" 参数不存在，则将页数设为 0，否则打印当前页数
    if (!PAGE.PAGE_CURRENT) {
      console.log(
        `网页链接没有page参数, 无法跳转下一页, 生成PAGE.PAGE_CURRENT为0`
      );
      PAGE.PAGE_CURRENT = 0;
    } else {
      console.log("当前页数: " + PAGE.PAGE_CURRENT);
    }

    // 将页数加 1，并设置为新的 "page" 参数的值
    PAGE.PAGE_NEXT = parseInt(PAGE.PAGE_CURRENT) + 1;
    urlSearchParams.set("page", PAGE.PAGE_NEXT);

    // 生成新的链接，包括原网页的域名、路径和新的查询参数
    PAGE.NEXT_URL =
      window.location.origin +
      window.location.pathname +
      "?" +
      urlSearchParams.toString();

    // 打印新的链接
    console.log("New URL:", PAGE.NEXT_URL);

    // TODO: 搞个 list 放入所有生成的新链接, 如果新链接存在就不 fetch 新数据

    // |--|-- 4.2.2 加载下一页 html 获取 json 信息对象
    fetch(PAGE.NEXT_URL)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const table = doc.querySelector("table.torrents");
        // console.log(table);

        // |--|-- 4.2.3 渲染 下一页信息 并 加到 waterfallNode 里面来
        PUT_TORRENT_INTO_MASONRY(table, waterfallNode, false);

        // 生成新的时候再改一次图片宽度
        CHANGE_CARD_WIDTH(CARD.CARD_WIDTH, waterfallNode, masonry);

        // 页数更新, 在上面几行更新会导致没有下一页的情况下仍然触发
        PAGE.IS_ORIGIN = false;
        PAGE.PAGE_CURRENT = PAGE.PAGE_NEXT;
      })
      .catch((error) => {
        // console.error(error);
        console.warn("获取不到下页信息, 可能到头了");
        console.warn(error);
      });
  }, PAGE.DISTANCE);
})();
