// ==UserScript==
// @name            KamePT种子列表无限下拉瀑布流视图
// @name:en         KamePT_waterfall_torrent
// @namespace       https://github.com/KesaubeEire/PT_TorrentList_Masonry
// @version         0.4.3
// @author          Kesa
// @description     KamePT种子列表无限下拉瀑布流视图(描述不能与名称相同, 乐)
// @description:en  KamePT torrent page waterfall view.
// @license         MIT
// @icon            https://kamept.com/favicon.ico
// @match           https://kamept.com/*
// @match           https://kp.m-team.cc/*
// @exclude         */offers.php*
// @exclude         */index.php*
// @exclude         */forums.php*
// @exclude         */viewrequests.php*
// @grant           none
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG$1 = {
    torrentListTable: "table.torrents",
    TORRENT_LIST_TO_JSON: TORRENT_LIST_TO_JSON$2,
    RENDER_TORRENT_JSON_IN_MASONRY: RENDER_TORRENT_JSON_IN_MASONRY$2,
    /**如果站点有自定义的icon, 可以用自定义的 */
    ICON: {}
  };
  function TORRENT_LIST_TO_JSON$2(torrent_list_Dom, CARD2) {
    const rows = torrent_list_Dom.querySelectorAll("tr");
    const data = [];
    rows.forEach((row) => {
      const categoryImg = row.querySelector("td:nth-child(1) > a > img");
      const category = categoryImg ? categoryImg.alt : "";
      if (!category)
        return;
      const torrentIndex = CARD2.CARD_INDEX++;
      const torrentNameLink = row.querySelector(".torrentname a");
      const torrentName = torrentNameLink ? torrentNameLink.textContent.trim() : "";
      const torrentLink = torrentNameLink.href;
      const pattern = /id=(\d+)&hit/;
      const match = torrentLink.match(pattern);
      const torrentId = match ? parseInt(match[1]) : null;
      const picLink = row.querySelector(".torrentname img").getAttribute("data-src");
      const place_at_the_top = row.querySelector(".torrentname img.sticky");
      const pattMsg = place_at_the_top ? place_at_the_top.title : "";
      const downloadLink = `download.php?id=${torrentId}`;
      const collectLink = `javascript: bookmark(${torrentId},${torrentIndex});`;
      const collectDOM = row.querySelector(".torrentname a[id^='bookmark']");
      const collectState = collectDOM.children[0].alt;
      const freeTypeImg = row.querySelector('img[class^="pro_"]');
      const freeType = freeTypeImg ? "_" + freeTypeImg.alt.replace(/\s+/g, "") : "";
      const freeRemainingTimeSpan = row.querySelector("font");
      const freeRemainingTime = freeRemainingTimeSpan ? freeRemainingTimeSpan.innerText : "";
      const tagSpans = row.querySelectorAll(".torrentname span");
      const tagsDOM = Array.from(tagSpans);
      let tags = tagSpans ? tagsDOM.map((span) => span.textContent.trim()) : [];
      if (freeType != "") {
        tags.shift();
        tagsDOM.shift();
      }
      const raw_tags = tagsDOM.map((el) => el.outerHTML).join("");
      const desCell = row.querySelector(".torrentname td:nth-child(2)");
      const length = desCell.childNodes.length - 1;
      const desDom = desCell.childNodes[length];
      const description = desDom.nodeName == "#text" ? desDom.textContent.trim() : "";
      const commentsLink = row.querySelector("td.rowfollow:nth-child(3) a");
      const comments = commentsLink ? parseInt(commentsLink.textContent) : 0;
      const uploadDateSpan = row.querySelector("td:nth-child(4) span");
      const uploadDate = uploadDateSpan ? uploadDateSpan.title : "";
      const sizeCell = row.querySelector("td:nth-child(5)");
      const size = sizeCell ? sizeCell.textContent.trim() : "";
      const seedersLink = row.querySelector("td:nth-child(6) a");
      const seeders = seedersLink ? parseInt(seedersLink.textContent) : 0;
      const leechersCell = row.querySelector("td:nth-child(7)");
      const leechers = leechersCell ? parseInt(leechersCell.textContent) : 0;
      const snatchedLink = row.querySelector("td:nth-child(8) a");
      const snatched = snatchedLink ? parseInt(snatchedLink.textContent) : 0;
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
        snatched
      };
      data.push(rowData);
    });
    return data;
  }
  function RENDER_TORRENT_JSON_IN_MASONRY$2(waterfallNode, torrent_json, isFirst = true, masonry2, CARD2, ICON2 = CONFIG$1.ICON) {
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
        snatched
      } = data;
      return `
<!-- 分区类别 -->
<div class="card-holder">
<div class="card-category">
  ${category}
</div>

<!-- 标题 & 跳转详情链接 -->    
<div class="card-title">
  <a class="two-lines" src="${torrentLink}" href="${torrentLink}" target="_blank">
    <b>${torrentName}</b>
  </a>
</div>
<div class="card-body">
  <div class="card-image" onclick="window.open('${torrentLink}')">
    <img class="card-image--img nexus-lazy-load_Kesa" src="pic/misc/spinner.svg" data-src="${picLink}"  alt="${torrentName}" />
    <div class="card-index">
      ${torrentIndex + 1}
    </div>  
  </div>

  <div class="card-alter">
    <!-- 免费类型 & 免费剩余时间 -->
    ${freeType ? `
          <div class="free_flag ${freeType}">
            <b>${freeType}: ${freeRemainingTime}_</b>
          </div>
          ` : ""}
    <!-- 置顶等级 -->
    ${pattMsg ? `<div><b>置顶等级:</b> ${pattMsg}</div>` : ""}
  </div>

  <!-- 副标题 -->
  ${description ? `<a class="card-description" href='${torrentLink}'> ${description}</a>` : ""}
  

  <!-- 标签 Tags -->
  <div class="cl-tags">
    ${raw_tags}
    <!-- <b>Tags:</b> ${tags.join(", ")} -->
  </div>


  <div class="card-details">  
    <div class="card-line">
      <!-- 大小 -->
      <div class="cl-center">
        ${ICON2.SIZE}&nbsp;${size}
      </div> 

      <!-- 下载 -->
      &nbsp;&nbsp;
      <div class="cl-center">
        ${ICON2.DOWNLOAD}&nbsp;
        <b><a src="${downloadLink}" href="${downloadLink}">下载</a></b>
      </div>

      <!-- 收藏 -->
      &nbsp;&nbsp;
      <div class="cl-center">
        <div class="btnCollet cl-center" id="tI_${torrentIndex}" onclick='COLLET_AND_ICON_CHANGE("${collectLink}", "tI_${torrentIndex}")'>
        ${collectState == "Unbookmarked" ? ICON2.COLLET : ICON2.COLLETED}
        &nbsp;<b>收藏</b>
        </div>
      </div>
    </div>
    
    <!-- 种子id, 默认不显示 -->
    <!--<div class="card-line"><b>Torrent ID:</b> ${torrentId}</div> -->
    
    <!-- 上传时间 -->
    <div class="card-line"><b>上传时间:</b> ${uploadDate}</div>
    
    <div class="card-line">
      ${ICON2.COMMENT}&nbsp;<b>${comments}</b>&nbsp;&nbsp;
      ${ICON2.SEEDERS}&nbsp;<b>${seeders}</b>&nbsp;&nbsp;
      ${ICON2.LEECHERS}&nbsp;<b>${leechers}</b>&nbsp;&nbsp;
      ${ICON2.SNATCHED}&nbsp;<b>${snatched}</b>
    </div>    
  </div>
</div>
</div>`;
    };
    for (const rowData of torrent_json) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = cardTemplate(rowData);
      card.style.width = `${CARD2.CARD_WIDTH}px`;
      card.style.zIndex = 1e4 - rowData.torrentIndex;
      const card_img = card.querySelector(".card-image--img");
      card_img.onload = function() {
        if (masonry2) {
          masonry2.layout();
        }
      };
      waterfallNode.appendChild(card);
      if (!isFirst) {
        masonry2.appended(card);
      }
    }
    NEXUS_TOOLS$1();
  }
  function NEXUS_TOOLS$1() {
    jQuery(document).ready(function() {
      function getImgPosition(e, imgEle2) {
        let imgWidth = imgEle2.prop("naturalWidth");
        let imgHeight = imgEle2.prop("naturalHeight");
        let ratio = imgWidth / imgHeight;
        let offsetX = 10;
        let offsetY = 10;
        let width = window.innerWidth - e.clientX;
        let height = window.innerHeight - e.clientY;
        let changeOffsetY = 0;
        let changeOffsetX = false;
        if (e.clientX > window.innerWidth / 2 && e.clientX + imgWidth > window.innerWidth) {
          changeOffsetX = true;
          width = e.clientX;
        }
        if (e.clientY > window.innerHeight / 2) {
          if (e.clientY + imgHeight / 2 > window.innerHeight) {
            changeOffsetY = 1;
            height = e.clientY;
          } else if (e.clientY + imgHeight > window.innerHeight) {
            changeOffsetY = 2;
            height = e.clientY;
          }
        }
        `innerWidth: ${window.innerWidth}, innerHeight: ${window.innerHeight}, pageX: ${e.pageX}, pageY: ${e.pageY}, imgWidth: ${imgWidth}, imgHeight: ${imgHeight}, width: ${width}, height: ${height}, offsetX: ${offsetX}, offsetY: ${offsetY}, changeOffsetX: ${changeOffsetX}, changeOffsetY: ${changeOffsetY}`;
        if (imgWidth > width) {
          imgWidth = width;
          imgHeight = imgWidth / ratio;
        }
        if (imgHeight > height) {
          imgHeight = height;
          imgWidth = imgHeight * ratio;
        }
        if (changeOffsetX) {
          offsetX = -(e.clientX - width + 10);
        }
        if (changeOffsetY == 1) {
          offsetY = -(imgHeight - (window.innerHeight - e.clientY));
        } else if (changeOffsetY == 2) {
          offsetY = -imgHeight / 2;
        }
        return { imgWidth, imgHeight, offsetX, offsetY };
      }
      function getPosition(e, position) {
        return {
          left: e.pageX + position.offsetX,
          top: e.pageY + position.offsetY,
          width: position.imgWidth,
          height: position.imgHeight
        };
      }
      const previewEle = jQuery("#nexus-preview");
      let imgEle;
      const selector = "img.preview_Kesa";
      let imgPosition;
      jQuery("body").on("mouseover", selector, function(e) {
        imgEle = jQuery(this);
        imgPosition = getImgPosition(e, imgEle);
        let position = getPosition(e, imgPosition);
        let src = imgEle.attr("src");
        if (src) {
          previewEle.attr("src", src).css(position).fadeIn("fast");
        }
      }).on("mouseout", selector, function(e) {
        previewEle.hide();
      }).on("mousemove", selector, function(e) {
        let position = getPosition(e, imgPosition);
        previewEle.css(position);
      });
      if ("IntersectionObserver" in window) {
        let imgList = [...document.querySelectorAll(".nexus-lazy-load_Kesa")];
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const el = entry.target;
            const intersectionRatio = entry.intersectionRatio;
            if (intersectionRatio > 0 && intersectionRatio <= 1 && !el.classList.contains("preview_Kesa")) {
              const source = el.dataset.src;
              el.src = source;
              el.classList.add("preview_Kesa");
              if (masonry) {
                masonry.layout();
              }
            }
            el.onload = el.onerror = () => io.unobserve(el);
          });
        });
        imgList.forEach((img) => io.observe(img));
      }
    });
  }
  const CONFIG = {
    torrentListTable: "table.torrents",
    TORRENT_LIST_TO_JSON: TORRENT_LIST_TO_JSON$1,
    RENDER_TORRENT_JSON_IN_MASONRY: RENDER_TORRENT_JSON_IN_MASONRY$1,
    /**如果站点有自定义的icon, 可以用自定义的 */
    ICON: {},
    /**如果站点有必要设置自定义的css, 可以用自定义的 */
    CSS: css,
    /**如果站点有必要设置分类颜色, 可以用自定义的 */
    CATEGORY: {
      410: "#f52bcb",
      429: "#f52bcb",
      424: "#db55a9",
      430: "#db55a9",
      426: "#f77afa",
      437: "#f77afa",
      431: "#19a7ec",
      432: "#19a7ec",
      436: "#bb1e9a",
      425: "#bb1e9a",
      433: "#bb1e9a",
      411: "#f49800",
      412: "#f49800",
      413: "#f49800",
      440: "#f52bcb"
    }
  };
  function css(variable) {
    return `  
/* 卡片种类tag */
.card-category{
  padding: 2px 6px;
  border-radius: 20px;
  border: 1px;
  background: black;
  color: white;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 临时标签_热门 */
.hot{
  padding: 0 2px;
  border-radius: 8px;
  background: white;
  margin: 2px;
}
/* 临时标签_新 */
`;
  }
  function TORRENT_LIST_TO_JSON$1(torrent_list_Dom, CARD2) {
    const rows = torrent_list_Dom.querySelectorAll("tr");
    const data = [];
    rows.forEach((row) => {
      const categoryImg = row.querySelector("td:nth-child(1) > a > img");
      const category = categoryImg ? categoryImg.title : "";
      if (!category)
        return;
      const categoryLinkDOM = categoryImg.parentNode;
      const categoryLink = categoryLinkDOM.href;
      const categoryNumber = categoryLink.slice(-3);
      const torrentIndex = CARD2.CARD_INDEX++;
      const torrentNameLink = row.querySelector(".torrentname a");
      const torrentName = torrentNameLink ? torrentNameLink.title.trim() : "";
      const torrentLink = torrentNameLink.href;
      const pattern = /id=(\d+)&hit/;
      const match = torrentLink.match(pattern);
      const torrentId = match ? parseInt(match[1]) : null;
      const imgDom = row.querySelector(".torrentname img");
      const _mouseOver = imgDom.getAttribute("onmouseover");
      const raw1 = _mouseOver ? _mouseOver.split(",")[2].toString() : "";
      const picLink = raw1 ? raw1.slice(raw1.indexOf("'") + 1, raw1.lastIndexOf("'")) : "/pic/nopic.jpg";
      const desCell = row.querySelector(".torrentname td:nth-child(2)");
      const length = desCell.childNodes.length - 1;
      const desDom = desCell.childNodes[length];
      const description = desDom.nodeName == "#text" ? desDom.textContent.trim() : "";
      const place_at_the_top = row.querySelectorAll(".torrentname img.sticky");
      const pattMsg = place_at_the_top[0] ? place_at_the_top[0].title : "";
      const tempTagDom = row.querySelectorAll(".torrentname font");
      const freeTypeImg = row.querySelector('img[class^="pro_"]');
      const freeType = freeTypeImg ? "_" + freeTypeImg.alt.replace(/\s+/g, "") : "";
      const freeRemainingTimeSpan = row.querySelector(".torrentname td:nth-child(2) span");
      const freeRemainingTime = freeRemainingTimeSpan ? freeRemainingTimeSpan.innerText : "";
      const tagSpans = row.querySelectorAll(".torrentname img[class^='label_']");
      const tagsDOM = Array.from(tagSpans);
      let tags = tagSpans ? tagsDOM.map((el) => el.title.trim()) : [];
      const raw_tags = tagsDOM.map((el) => el.outerHTML).join("&nbsp;");
      const downloadLink = `download.php?id=${torrentId}`;
      const collectLink = `javascript: bookmark(${torrentId},${torrentIndex});`;
      const collectDOM = row.querySelector(".torrentname a[id^='bookmark']");
      const collectState = collectDOM.children[0].alt;
      const commentsLink = row.querySelector("td.rowfollow:nth-child(3) a");
      const comments = commentsLink ? parseInt(commentsLink.textContent) : 0;
      const uploadDateSpan = row.querySelector("td:nth-child(4) span");
      const uploadDate = uploadDateSpan ? uploadDateSpan.title : "";
      const sizeCell = row.querySelector("td:nth-child(5)");
      const size = sizeCell ? sizeCell.textContent.trim() : "";
      const seedersLink = row.querySelector("td:nth-child(6) a");
      const seeders = seedersLink ? parseInt(seedersLink.textContent) : 0;
      const leechersCell = row.querySelector("td:nth-child(7)");
      const leechers = leechersCell ? parseInt(leechersCell.textContent) : 0;
      const snatchedLink = row.querySelector("td:nth-child(8) a");
      const snatched = snatchedLink ? parseInt(snatchedLink.textContent) : 0;
      const rowData = {
        torrentIndex,
        category,
        categoryLink,
        categoryNumber,
        torrent_name: torrentName,
        torrentLink,
        torrentId,
        picLink,
        place_at_the_top,
        pattMsg,
        downloadLink,
        collectLink,
        collectState,
        tempTagDom,
        freeTypeImg,
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
        snatched
      };
      data.push(rowData);
    });
    return data;
  }
  function RENDER_TORRENT_JSON_IN_MASONRY$1(waterfallNode, torrent_json, isFirst = true, masonry2, CARD2, ICON2 = CONFIG.ICON) {
    const cardTemplate = (data) => {
      const {
        torrentIndex,
        category,
        categoryLink,
        categoryNumber,
        torrent_name: torrentName,
        torrentLink,
        torrentId,
        picLink,
        place_at_the_top,
        pattMsg,
        downloadLink,
        collectLink,
        collectState,
        tempTagDom,
        freeTypeImg,
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
        snatched
      } = data;
      return `

<div class="card-holder">
  <!-- 分区类别 -->
  <div
    class="card-category"
    href="${categoryLink}"
    style="background: ${CONFIG.CATEGORY[categoryNumber]};"
    >
    ${category}    
  </div>

  <!-- 标题 & 跳转详情链接 -->    
  <div class="card-title">
    <a class="two-lines" src="${torrentLink}" href="${torrentLink}" target="_blank">
    ${tempTagDom ? Array.from(tempTagDom).map((e) => e.outerHTML).join("&nbsp;") : ""}
    <b>${torrentName}</b>
    </a>
  </div>
  <div class="card-body">
    <div class="card-image" onclick="window.open('${torrentLink}')">
      <img  class="card-image--img nexus-lazy-load_Kesa" src="logo.png" data-src="${picLink}" alt="${torrentName}"/>
      <div class="card-index">
        ${torrentIndex + 1}
      </div>  
    </div>

    <!-- 置顶 && 免费类型&剩余时间 -->      
    ${freeType || pattMsg ? `
      <div class="card-alter">          
        <div class="top_and_free ${freeType}">
          <!-- 置顶等级 -->
          ${place_at_the_top ? Array.from(place_at_the_top).map((e) => e.outerHTML) : ""}
          &nbsp;
          <!-- 免费类型 & 免费剩余时间 -->
          ${freeTypeImg ? freeTypeImg.outerHTML : ""}  <b>${freeRemainingTime ? freeRemainingTime : ""}</b>
        </div>
      </div>
          ` : ``}

    <!-- 置顶等级 -->
    <!--${pattMsg ? `<div><b>置顶等级:</b> ${pattMsg}</div>` : ""}-->
    
    <!-- 副标题 -->
    ${description ? `<a class="card-description" href='${torrentLink}'> ${description}</a>` : ""}
    

    <!-- 标签 Tags -->
    <div class="cl-tags">
      <!-- ${tempTagDom ? Array.from(tempTagDom).map((e) => e.outerHTML + "&nbsp;") : ""} -->
      ${raw_tags}
      <!-- <b>Tags:</b> ${tags.join("&nbsp;")} -->
    </div>


    <div class="card-details">  
      <div class="card-line">
        <!-- 大小 -->
        <div class="cl-center">
          ${ICON2.SIZE}&nbsp;${size}
        </div> 

        <!-- 下载 -->
        &nbsp;&nbsp;
        <div class="cl-center">
          ${ICON2.DOWNLOAD}&nbsp;
          <b><a src="${downloadLink}" href="${downloadLink}">下载</a></b>
        </div>

        <!-- 收藏 -->
        &nbsp;&nbsp;
        <div class="cl-center">
          <div class="btnCollet cl-center" id="tI_${torrentIndex}" onclick='COLLET_AND_ICON_CHANGE("${collectLink}", "tI_${torrentIndex}")'>
          ${collectState == "Unbookmarked" ? ICON2.COLLET : ICON2.COLLETED}
          &nbsp;<b>收藏</b>
          </div>
        </div>
      </div>
      
      <!-- 种子id, 默认不显示 -->
      <!--<div class="card-line"><b>Torrent ID:</b> ${torrentId}</div> -->
      
      <!-- 上传时间 -->
      <div class="card-line"><b>上传时间:</b> ${uploadDate}</div>
      
      <div class="card-line">
        ${ICON2.COMMENT}&nbsp;<b>${comments}</b>&nbsp;&nbsp;
        ${ICON2.SEEDERS}&nbsp;<b>${seeders}</b>&nbsp;&nbsp;
        ${ICON2.LEECHERS}&nbsp;<b>${leechers}</b>&nbsp;&nbsp;
        ${ICON2.SNATCHED}&nbsp;<b>${snatched}</b>
      </div>    
    </div>
  </div>
</div>`;
    };
    for (const rowData of torrent_json) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = cardTemplate(rowData);
      card.style.width = `${CARD2.CARD_WIDTH}px`;
      card.style.zIndex = 1e4 - rowData.torrentIndex;
      const card_img = card.querySelector(".card-image--img");
      card_img.onload = function() {
        if (masonry2) {
          masonry2.layout();
        }
      };
      waterfallNode.appendChild(card);
      if (!isFirst) {
        masonry2.appended(card);
      }
    }
    NEXUS_TOOLS();
  }
  function NEXUS_TOOLS() {
    jQuery(document).ready(function() {
      function getImgPosition(e, imgEle2) {
        let imgWidth = imgEle2.prop("naturalWidth");
        let imgHeight = imgEle2.prop("naturalHeight");
        let ratio = imgWidth / imgHeight;
        let offsetX = 10;
        let offsetY = 10;
        let width = window.innerWidth - e.clientX;
        let height = window.innerHeight - e.clientY;
        let changeOffsetY = 0;
        let changeOffsetX = false;
        if (e.clientX > window.innerWidth / 2 && e.clientX + imgWidth > window.innerWidth) {
          changeOffsetX = true;
          width = e.clientX;
        }
        if (e.clientY > window.innerHeight / 2) {
          if (e.clientY + imgHeight / 2 > window.innerHeight) {
            changeOffsetY = 1;
            height = e.clientY;
          } else if (e.clientY + imgHeight > window.innerHeight) {
            changeOffsetY = 2;
            height = e.clientY;
          }
        }
        `innerWidth: ${window.innerWidth}, innerHeight: ${window.innerHeight}, pageX: ${e.pageX}, pageY: ${e.pageY}, imgWidth: ${imgWidth}, imgHeight: ${imgHeight}, width: ${width}, height: ${height}, offsetX: ${offsetX}, offsetY: ${offsetY}, changeOffsetX: ${changeOffsetX}, changeOffsetY: ${changeOffsetY}`;
        if (imgWidth > width) {
          imgWidth = width;
          imgHeight = imgWidth / ratio;
        }
        if (imgHeight > height) {
          imgHeight = height;
          imgWidth = imgHeight * ratio;
        }
        if (changeOffsetX) {
          offsetX = -(e.clientX - width + 10);
        }
        if (changeOffsetY == 1) {
          offsetY = -(imgHeight - (window.innerHeight - e.clientY));
        } else if (changeOffsetY == 2) {
          offsetY = -imgHeight / 2;
        }
        return { imgWidth, imgHeight, offsetX, offsetY };
      }
      function getPosition(e, position) {
        return {
          left: e.pageX + position.offsetX,
          top: e.pageY + position.offsetY,
          width: position.imgWidth,
          height: position.imgHeight
        };
      }
      const _previewDom = document.body.appendChild(document.createElement("img"));
      _previewDom.id = "nexus-preview";
      const previewEle = jQuery("#nexus-preview");
      let imgEle;
      const selector = "img.preview_Kesa";
      let imgPosition;
      jQuery("body").on("mouseover", selector, function(e) {
        imgEle = jQuery(this);
        imgPosition = getImgPosition(e, imgEle);
        let position = getPosition(e, imgPosition);
        let src = imgEle.attr("src");
        if (src) {
          previewEle.attr("src", src).css(position).fadeIn("fast");
        }
      }).on("mouseout", selector, function(e) {
        previewEle.hide();
      }).on("mousemove", selector, function(e) {
        let position = getPosition(e, imgPosition);
        previewEle.css(position);
      });
      if ("IntersectionObserver" in window) {
        let imgList = [...document.querySelectorAll(".nexus-lazy-load_Kesa")];
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const el = entry.target;
            const intersectionRatio = entry.intersectionRatio;
            if (intersectionRatio > 0 && intersectionRatio <= 1 && !el.classList.contains("preview_Kesa")) {
              const source = el.dataset.src;
              el.src = source;
              el.classList.add("preview_Kesa");
              if (masonry) {
                masonry.layout();
              }
            }
            el.onload = el.onerror = () => io.unobserve(el);
          });
        });
        imgList.forEach((img) => io.observe(img));
      }
    });
  }
  const SITE = {
    "kp.m-team.cc": CONFIG,
    "kamept.com": CONFIG$1
  };
  function GET_CURRENT_PT_DOMAIN() {
    const domainName = window.location.hostname;
    console.log("当前站点: ", domainName);
    return domainName;
  }
  const SITE_DOMAIN = GET_CURRENT_PT_DOMAIN();
  const CARD = {
    /** 瀑布流卡片宽度 */
    CARD_WIDTH: 200,
    /** 瀑布流卡片边框宽度 -> 这个2是真值, 但是边框好像是会随着分辨率和缩放变化, 给高有利大分辨率, 给低有利于小分辨率 */
    CARD_BORDER: 3,
    /** 瀑布流卡片索引 */
    CARD_INDEX: 0
  };
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
    /** 翻页: 下一页的加载方式: Button | Slip */
    SWITCH_MODE: "Button"
  };
  const ICON = {
    /** 大小图标 */
    SIZE: '<img class="size" src="pic/trans.gif" style=" transform: translateY(-0.4px);" alt="size" title="大小">',
    /** 评论图标 */
    COMMENT: '<img class="comments" src="pic/trans.gif" alt="comments" title="评论数">',
    /** 上传人数图标 */
    SEEDERS: '<img class="seeders" src="pic/trans.gif" alt="seeders" title="种子数">',
    /** 下载人数图标 */
    LEECHERS: '<img class="leechers" src="pic/trans.gif" alt="leechers" title="下载数">',
    /** 已完成人数图标 */
    SNATCHED: '<img class="snatched" src="pic/trans.gif" alt="snatched" title="完成数">',
    /** 下载图标 */
    DOWNLOAD: '<img class="download" src="pic/trans.gif" style=" transform: translateY(1px);" alt="download" title="下载本种">',
    /** 未收藏图标 */
    COLLET: '<img class="delbookmark" src="pic/trans.gif" alt="Unbookmarked" title="收藏">',
    /** 已收藏图标 */
    COLLETED: '<img class="bookmark" src="pic/trans.gif" alt="Bookmarked">'
  };
  function GET_TORRENT_LIST_DOM_FROM_DOMAIN() {
    const selector = SITE[SITE_DOMAIN].torrentListTable;
    return document.querySelector(selector);
  }
  function TORRENT_LIST_TO_JSON(torrent_list_Dom) {
    return SITE[SITE_DOMAIN].TORRENT_LIST_TO_JSON(torrent_list_Dom, CARD);
  }
  function RENDER_TORRENT_JSON_IN_MASONRY(waterfallNode, torrent_json, isFirst = true, masonry2) {
    return SITE[SITE_DOMAIN].RENDER_TORRENT_JSON_IN_MASONRY(
      waterfallNode,
      torrent_json,
      isFirst,
      masonry2,
      CARD,
      ICON
    );
  }
  function PUT_TORRENT_INTO_MASONRY(torrent_list_Dom, waterfallNode, isFirst = true, masonry2) {
    const data = TORRENT_LIST_TO_JSON(torrent_list_Dom);
    console.log(`渲染行数: ${data.length}`);
    console.log(data);
    RENDER_TORRENT_JSON_IN_MASONRY(waterfallNode, data, isFirst, masonry2);
  }
  function GET_CARD_GUTTER(containerDom, card_width) {
    const _width = containerDom.clientWidth;
    const card_real_width = card_width + CARD.CARD_BORDER;
    const columns = Math.floor(_width / card_real_width);
    const gutter = (_width - columns * card_real_width) / (columns - 1);
    return Math.floor(gutter);
  }
  function CHANGE_CARD_WIDTH(targetWidth, containerDom, masonry2) {
    for (const card of containerDom.childNodes) {
      card.style.width = `${targetWidth}px`;
    }
    masonry2.options.gutter = GET_CARD_GUTTER(containerDom, targetWidth);
    masonry2.layout();
  }
  function COLLET_AND_ICON_CHANGE(jsCodeLink, card_id) {
    try {
      window.location.href = jsCodeLink;
      const btn = document.querySelector(`div#${card_id}`);
      const img = btn.children[0];
      img.className = img.className == "delbookmark" ? "bookmark" : "delbookmark";
      console.log(`执行脚本${jsCodeLink}成功, 已经收藏或者取消~`);
    } catch (error) {
      console.error(error);
    }
  }
  window.COLLET_AND_ICON_CHANGE = COLLET_AND_ICON_CHANGE;
  function debounce(func, delay) {
    var timer;
    return function() {
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function() {
        func.apply(context, args);
      }, delay);
    };
  }
  function ADD_SITE_EXCLUSIVE_CSS() {
    console.log(SITE[SITE_DOMAIN].CSS());
    return SITE[SITE_DOMAIN].CSS();
  }
  console.log("________PT-TorrentList-Masonry 已启动!________");
  const _ORIGIN_TL_Node = GET_TORRENT_LIST_DOM_FROM_DOMAIN();
  if (!_ORIGIN_TL_Node) {
    console.log("未识别到种子列表捏~");
  } else {
    let scan_and_launch = function() {
      const scrollHeight = document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop + clientHeight >= scrollHeight - PAGE.DISTANCE) {
        if (PAGE.SWITCH_MODE != "Button")
          debounceLoad();
        else {
          console.log("按钮模式~");
        }
      }
    };
    let masonry2;
    window.masonry = masonry2;
    const mainOuterDOM = document.querySelector("table.mainouter");
    const themeColor = window.getComputedStyle(mainOuterDOM)["background-color"];
    console.log("背景颜色:", themeColor);
    const parentNode = _ORIGIN_TL_Node.parentNode;
    _ORIGIN_TL_Node.style.display = "none";
    const waterfallNode = document.createElement("div");
    waterfallNode.classList.add("waterfall");
    parentNode.insertBefore(waterfallNode, _ORIGIN_TL_Node.nextSibling);
    document.getElementById("btnViewOrigin");
    const toggleBtn = document.createElement("button");
    toggleBtn.classList.add("debug");
    toggleBtn.setAttribute("id", "toggle_oldTable");
    toggleBtn.innerText = "显示原种子表格";
    toggleBtn.style.zIndex = 10001;
    toggleBtn.addEventListener("click", function() {
      if (_ORIGIN_TL_Node.style.display === "none") {
        _ORIGIN_TL_Node.style.display = "block";
        toggleBtn.innerText = "隐藏原种子表格";
      } else {
        _ORIGIN_TL_Node.style.display = "none";
        toggleBtn.innerText = "显示原种子表格";
      }
    });
    document.body.appendChild(toggleBtn);
    document.getElementById("btnReLayout");
    const reLayoutBtn = document.createElement("button");
    reLayoutBtn.classList.add("debug");
    reLayoutBtn.setAttribute("id", "btnReLayout");
    reLayoutBtn.innerText = "单列宽度切换(200/300)";
    reLayoutBtn.style.zIndex = 10002;
    reLayoutBtn.addEventListener("click", function() {
      if (masonry2) {
        masonry2.layout();
      }
      CARD.CARD_WIDTH = CARD.CARD_WIDTH == 200 ? 300 : 200;
      CHANGE_CARD_WIDTH(CARD.CARD_WIDTH, waterfallNode, masonry2);
      masonry2.layout();
    });
    document.body.appendChild(reLayoutBtn);
    const btnTurnPageDOM = document.createElement("button");
    waterfallNode.insertAdjacentElement("afterend", btnTurnPageDOM);
    btnTurnPageDOM.classList.add("turnPage");
    btnTurnPageDOM.setAttribute("id", "turnPage");
    btnTurnPageDOM.innerText = "点击加载下一页";
    btnTurnPageDOM.addEventListener("click", function(event) {
      event.preventDefault();
      debounceLoad();
    });
    document.getElementById("btnSwitchMode");
    const switchModeBtn = document.createElement("button");
    switchModeBtn.classList.add("debug");
    switchModeBtn.setAttribute("id", "btnSwitchMode");
    switchModeBtn.innerText = "当前加载方式: 按钮";
    switchModeBtn.style.zIndex = 10003;
    switchModeBtn.addEventListener("click", function() {
      if (switchModeBtn.innerText == "当前加载方式: 按钮") {
        switchModeBtn.innerText = "当前加载方式: 滑动";
        PAGE.SWITCH_MODE = "Slip";
        btnTurnPageDOM.style.display = "none";
        scan_and_launch();
      } else {
        switchModeBtn.innerText = "当前加载方式: 按钮";
        PAGE.SWITCH_MODE = "Button";
        btnTurnPageDOM.style.display = "block";
      }
    });
    document.body.appendChild(switchModeBtn);
    PUT_TORRENT_INTO_MASONRY(_ORIGIN_TL_Node, waterfallNode, true, masonry2);
    const css2 = `

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

/* 调试按键3: Masonry 重新排列 */
button#btnSwitchMode {
  top: 70px;
}

/* 卡片 */
.card {
  width: ${CARD.CARD_WIDTH}px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  background-color: ${themeColor};
  /* box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); */
  /* margin: 10px; */
  margin: 6px 0;
  
  overflow: hidden;

  cursor: pointer;
}

.card:hover {
  
}

/* 卡片标题 */
.card-title{
  padding: 2px 0;
}

/* 卡片内部容器 */
.card-holder{
  background-color: rgba(255, 255, 255, 0.5);
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0));
  padding-bottom: 6px;
}

/* 卡片行默认样式 */
.card-line{
  margin-bottom: 1px;

  display: flex;
  justify-content: space-evenly;
  align-items: center;

  height: 20px;
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

  padding-top: 2px;
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
  height: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
}


/* 置顶 && 免费类型&剩余时间 */
.top_and_free{
  padding: 2px;
  border-radius: 4px;
  margin-bottom: 2px;

  display: flex;
  justify-content: center;
  align-items: center;

  line-height: 11px;
  height: 11px;
  font-size: 10px;
}
._Free{
  color: blue;
  /* background-color: #00e6 */
}

._2XFree{
  color: green;
  /* background-color: #0e0 */
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

  pointer-events: none;
}

/* 卡片: 收藏按钮 */
.btnCollet{
  padding: 1px 2px;
  cursor: pointer;
}

/* 卡片: 收藏按钮 */
#turnPage{
  width: 100%;
  height: 28px;
  border-radius: 6px;
}

/* 上面是我自己脚本的css */
/* --------------------------------------- */
/* 下面是改进原有的css */

/* 卡片索引 */
#nexus-preview{
  z-index: 20000;
  position: absolute;
  display: none;
}
`;
    const style = document.createElement("style");
    style.textContent = css2 + ADD_SITE_EXCLUSIVE_CSS();
    document.head.appendChild(style);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js";
    document.getElementsByTagName("head")[0].appendChild(script);
    script.onload = function() {
      masonry2 = new Masonry(waterfallNode, {
        itemSelector: ".card",
        columnWidth: ".card",
        gutter: GET_CARD_GUTTER(waterfallNode, CARD.CARD_WIDTH)
      });
      window.addEventListener("resize", function() {
        masonry2.options.gutter = GET_CARD_GUTTER(waterfallNode, CARD.CARD_WIDTH);
        masonry2.layout();
      });
      masonry2.layout();
      window.masonry = masonry2;
    };
    let debounceLoad;
    window.addEventListener("scroll", function() {
      scan_and_launch();
    });
    debounceLoad = debounce(function() {
      console.log("到页面底部啦!!! Scrolled to bottom!");
      const urlSearchParams = new URLSearchParams(window.location.search);
      PAGE.PAGE_CURRENT = PAGE.IS_ORIGIN ? urlSearchParams.get("page") : PAGE.PAGE_CURRENT;
      if (!PAGE.PAGE_CURRENT) {
        console.log(`网页链接没有page参数, 无法跳转下一页, 生成PAGE.PAGE_CURRENT为0`);
        PAGE.PAGE_CURRENT = 0;
      } else {
        console.log("当前页数: " + PAGE.PAGE_CURRENT);
      }
      PAGE.PAGE_NEXT = parseInt(PAGE.PAGE_CURRENT) + 1;
      urlSearchParams.set("page", PAGE.PAGE_NEXT);
      PAGE.NEXT_URL = window.location.origin + window.location.pathname + "?" + urlSearchParams.toString();
      console.log("New URL:", PAGE.NEXT_URL);
      fetch(PAGE.NEXT_URL).then((response) => response.text()).then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const table = doc.querySelector("table.torrents");
        PUT_TORRENT_INTO_MASONRY(table, waterfallNode, false, masonry2);
        CHANGE_CARD_WIDTH(CARD.CARD_WIDTH, waterfallNode, masonry2);
        PAGE.IS_ORIGIN = false;
        PAGE.PAGE_CURRENT = PAGE.PAGE_NEXT;
      }).catch((error) => {
        console.warn("获取不到下页信息, 可能到头了");
        console.warn(error);
      });
    }, PAGE.DISTANCE);
  }

})();
