// ==UserScript==
// @name            PT种子列表无限下拉瀑布流视图
// @name:en         PT_waterfall_torrent
// @namespace       https://github.com/KesaubeEire/PT_TorrentList_Masonry
// @version         0.4.13
// @author          Kesa
// @description     PT种子列表无限下拉瀑布流视图(描述不能与名称相同, 乐)
// @description:en  PT torrent page waterfall view.
// @license         MIT
// @icon            https://kamept.com/favicon.ico
// @match           https://kamept.com/*
// @match           https://kp.m-team.cc/*
// @match           https://pterclub.com/*
// @exclude         */offers.php*
// @exclude         */index.php*
// @exclude         */forums.php*
// @exclude         */viewrequests.php*
// @exclude         */seek.php*
// @grant           none
// ==/UserScript==

(function () {
  'use strict';

  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var require_main_001 = __commonJS({
    "main-6abacef1.js"(exports, module) {
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
      function throttle(func, delay) {
        let timerId;
        let lastExecTime = 0;
        return function(...args) {
          const currentTime = Date.now();
          const elapsedTime = currentTime - lastExecTime;
          if (!timerId && elapsedTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
          } else {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
              func.apply(this, args);
              lastExecTime = currentTime;
              timerId = null;
            }, delay - elapsedTime);
          }
        };
      }
      function sortMasonry() {
        if (masonry) {
          throttle(function sort_masonry() {
            masonry.layout();
          }, 1500)();
        }
      }
      const CONFIG$2 = {
        torrentListTable: "table.torrents",
        TORRENT_LIST_TO_JSON: TORRENT_LIST_TO_JSON$3,
        RENDER_TORRENT_JSON_IN_MASONRY: RENDER_TORRENT_JSON_IN_MASONRY$3,
        /**如果站点有自定义的icon, 可以用自定义的 */
        ICON: {},
        /**如果站点有必要设置自定义的css, 可以用自定义的 */
        CSS: css$2,
        /**如果站点有必要设置分类颜色, 可以用自定义的 */
        CATEGORY: {}
      };
      function css$2(variable) {
        return ` 

`;
      }
      function TORRENT_LIST_TO_JSON$3(torrent_list_Dom, CARD2) {
        const rows = torrent_list_Dom.querySelectorAll("tbody tr");
        const data = [];
        rows.forEach((row) => {
          const categoryImg = row.querySelector("td:nth-child(1) > a > img");
          const category = categoryImg ? categoryImg.alt : "";
          if (!category)
            return;
          const categoryLinkDOM = categoryImg.parentNode;
          const categoryLink = categoryLinkDOM.href;
          const categoryNumber = categoryLink.slice(-3);
          const _categoryImg = categoryImg.cloneNode(true);
          _categoryImg.className = "card-category-img";
          const torrentIndex = CARD2.CARD_INDEX++;
          const torrentNameLink = row.querySelector(".torrentname a");
          const torrentName = torrentNameLink ? torrentNameLink.textContent.trim() : "";
          const torrentLink = torrentNameLink.href;
          const pattern = /id=(\d+)&hit/;
          const match = torrentLink.match(pattern);
          const torrentId = match ? parseInt(match[1]) : null;
          const picLink = row.querySelector(".torrentname img").getAttribute("data-src");
          const desCell = row.querySelector(".torrentname td:nth-child(2)");
          const length = desCell.childNodes.length - 1;
          const desDom = desCell.childNodes[length];
          const description = desDom.nodeName == "#text" ? desDom.textContent.trim() : "";
          const place_at_the_top = row.querySelectorAll(".torrentname img.sticky");
          const pattMsg = place_at_the_top[0] ? place_at_the_top[0].title : "";
          const tempTagDom = row.querySelectorAll(".torrentname font");
          const freeTypeImg = row.querySelector('img[class^="pro_"]');
          const freeType = freeTypeImg ? "_" + freeTypeImg.alt.replace(/\s+/g, "") : "";
          const freeRemainingTimeSpan = freeType ? Array.from(tempTagDom)[tempTagDom.length - 1] : "";
          const freeRemainingTime = freeRemainingTimeSpan ? freeRemainingTimeSpan.innerText : "";
          const tagSpans = row.querySelectorAll(".torrentname span");
          const tagsDOM = Array.from(tagSpans);
          let tags = tagSpans ? tagsDOM.map((span) => span.textContent.trim()) : [];
          if (freeRemainingTime != "") {
            tags.shift();
            tagsDOM.shift();
          }
          const raw_tags = tagsDOM.map((el) => el.outerHTML).join("");
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
            _categoryImg,
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
            tagsDOM,
            tags,
            description,
            upload_date: uploadDate,
            comments,
            size,
            seeders,
            leechers,
            snatched
          };
          data.push(rowData);
        });
        return data;
      }
      function RENDER_TORRENT_JSON_IN_MASONRY$3(waterfallNode, torrent_json, isFirst = true, masonry2, CARD2, ICON2 = CONFIG$2.ICON) {
        const cardTemplate = (data) => {
          const {
            torrentIndex,
            _categoryImg,
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
            tagsDOM,
            tags,
            description,
            upload_date: uploadDate,
            comments,
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
    <!-- TODO: 颜色这里和龟龟商量怎么搞分类的颜色捏 -->    
    <!-- style="background: ${CONFIG$2.CATEGORY[categoryNumber]};" -->
    >
    <!-- TODO: 图片这里先注释了, 和龟龟商量捏 -->    
    <!-- ${_categoryImg.outerHTML} -->
    ${category}    
  </div>

  <!-- 标题 & 跳转详情链接 -->    
  <div class="card-title">
    <a class="two-lines" src="${torrentLink}" href="${torrentLink}" target="_blank">
      ${tempTagDom ? Array.from(tempTagDom).map((e) => e.outerHTML).join("&nbsp;") : ""}
      <b>${torrentName}</b>
    </a>
  </div>

  <!-- 卡片其他信息 -->    
  <div class="card-body">
    <div class="card-image" onclick="window.open('${torrentLink}')">
      <!-- <img class="card-image--img nexus-lazy-load_Kesa" src="pic/misc/spinner.svg" data-src="${picLink}"  alt="${torrentName}" /> -->
      <!-- NOTE: 加载图片这里换成了logo, 和 MT 一样了捏 -->    
      <img class="card-image--img nexus-lazy-load_Kesa" src="pic/logo2_100.png" data-src="${picLink}"  alt="${torrentName}" />
      <div class="card-index">
        ${torrentIndex + 1}
      </div>  
    </div>

    <!-- 置顶 && 免费类型&剩余时间 -->      
    ${freeType || pattMsg ? `
      <div class="card-alter">          
        <div class="top_and_free ${freeType}">
          <!-- 置顶等级 -->
          ${place_at_the_top.length != 0 ? Array.from(place_at_the_top).map((e) => e.outerHTML) + "&nbsp;" : ""}

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
      ${tagsDOM.map((el) => {
          const _tag = document.createElement("div");
          _tag.innerHTML = el.outerHTML;
          return _tag.outerHTML;
        }).join("")}
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
              sortMasonry();
            }
            const observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.attributeName === "src") {
                  if (masonry2) {
                    sortMasonry();
                  }
                }
              });
            });
            const config = {
              attributes: true,
              // 监听属性变化
              attributeFilter: ["src"]
              // 只监听 src 属性的变化
            };
            observer.observe(card_img, config);
          };
          card_img.addEventListener("load", () => {
            if (masonry2) {
              sortMasonry();
            }
          });
          waterfallNode.appendChild(card);
          if (!isFirst) {
            masonry2.appended(card);
          }
        }
      }
      const CONFIG$1 = {
        torrentListTable: "table.torrents",
        TORRENT_LIST_TO_JSON: TORRENT_LIST_TO_JSON$2,
        RENDER_TORRENT_JSON_IN_MASONRY: RENDER_TORRENT_JSON_IN_MASONRY$2,
        /**如果站点有自定义的icon, 可以用自定义的 */
        ICON: {},
        /**如果站点有必要设置自定义的css, 可以用自定义的 */
        CSS: css$1,
        /**如果站点有必要设置分类颜色, 可以用自定义的 */
        CATEGORY: {
          // 成人分类
          410: "#f52bcb",
          // 有码 HD
          429: "#f52bcb",
          // 无码 HD
          424: "#db55a9",
          // 有码 Xvid
          430: "#db55a9",
          // 无码 Xvid
          437: "#f77afa",
          // 有码 DVD
          426: "#f77afa",
          // 无码 DVD
          431: "#19a7ec",
          // 有码 BluRay
          432: "#19a7ec",
          // 无码 BluRay
          440: "#f52bcb",
          // GAY
          436: "#bb1e9a",
          // 0 day
          425: "#bb1e9a",
          // 写真 video
          433: "#bb1e9a",
          // 写真 pic
          411: "#f49800",
          // H-Game
          412: "#f49800",
          // H-Anime
          413: "#f49800",
          // H-Comic
          // 综合分类
          401: "#c74854",
          // Movie SD
          419: "#c01a20",
          // Movie HD
          420: "#c74854",
          // Movie DVD    
          421: "#00a0e9",
          // Movie BluRay
          439: "#1b2a51",
          // Movie Remux
          403: "#c74854",
          // TV SD
          402: "#276fb8",
          // TV HD
          435: "#4dbebd ",
          // TV DVD
          438: "#1897d6",
          // TV BluRay
          404: "#23ac38",
          // 纪录教育
          405: "#996c34",
          // Anime
          407: "#23ac38",
          // Sport
          422: "#f39800",
          // Software
          423: "#f39800",
          // Game
          427: "#f39800",
          // EBook
          409: "#996c34",
          // Other
          // 音乐分类
          406: "#8a57a1",
          // MV
          408: "#8a57a1",
          // Music AAC/ALAC
          434: "#8a57a1"
          // Music 无损
        }
      };
      function css$1(variable) {
        return `  
/* 卡片种类tag */
.card-category{
  height: 24px;
  padding: 0 6px;
  border: 1px;
  background: black;
  color: white;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  display: flex;
  align-items: center;
}

/* 卡片种类tag预览图 */
.card-category-img
{
  height: 18px;

  background-size: 100% 141%;
  background-position: center top;
  padding-left: 5%;
}
`;
      }
      function TORRENT_LIST_TO_JSON$2(torrent_list_Dom, CARD2) {
        const rows = torrent_list_Dom.querySelectorAll("tbody tr");
        const data = [];
        rows.forEach((row) => {
          const categoryImg = row.querySelector("td:nth-child(1) > a > img");
          const category = categoryImg ? categoryImg.title : "";
          if (!category)
            return;
          const categoryLinkDOM = categoryImg.parentNode;
          const categoryLink = categoryLinkDOM.href;
          const categoryNumber = categoryLink.slice(-3);
          const _categoryImg = categoryImg.cloneNode(true);
          _categoryImg.className = "card-category-img";
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
            _categoryImg,
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
            tagsDOM,
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
            _categoryImg,
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
            tagsDOM,
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
    style="background: ${CONFIG$1.CATEGORY[categoryNumber]};"
    >
    ${_categoryImg.outerHTML}
    ${category}    
  </div>

  <!-- 标题 & 跳转详情链接 -->    
  <div class="card-title">
    <a class="two-lines" src="${torrentLink}" href="${torrentLink}" target="_blank">
      ${tempTagDom ? Array.from(tempTagDom).map((e) => e.outerHTML).join("&nbsp;") : ""}
      <b>${torrentName}</b>
    </a>
  </div>

  <!-- 卡片其他信息 -->    
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
          ${place_at_the_top.length != 0 ? Array.from(place_at_the_top).map((e) => e.outerHTML) + "&nbsp;" : ""}

          <!-- 免费类型 & 免费剩余时间 -->
          ${freeTypeImg ? freeTypeImg.outerHTML : ""}  <b>${freeRemainingTime ? freeRemainingTime : ""}</b>
        </div>
      </div>
          ` : ``}

    <!-- 置顶等级 -->
    <!--${pattMsg ? `<div><b>置顶等级:</b> ${pattMsg}</div>` : ""}-->

    <!-- 副标题 -->
    ${description ? `<div class="card-description"><a href='${torrentLink}'> ${description}</a></div>` : ""}
    

    <!-- 标签 Tags -->
    <div class="cl-tags">
      <!-- ${tempTagDom ? Array.from(tempTagDom).map((e) => e.outerHTML + "&nbsp;") : ""} -->
      ${tagsDOM.map((el) => {
          const _tag = document.createElement("div");
          _tag.innerHTML = el.outerHTML;
          return _tag.outerHTML;
        }).join("")}
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
              sortMasonry();
            }
            const observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.attributeName === "src") {
                  if (masonry2) {
                    sortMasonry();
                  }
                }
              });
            });
            const config = {
              attributes: true,
              // 监听属性变化
              attributeFilter: ["src"]
              // 只监听 src 属性的变化
            };
            observer.observe(card_img, config);
          };
          card_img.addEventListener("load", () => {
            if (masonry2) {
              sortMasonry();
            }
          });
          waterfallNode.appendChild(card);
          if (!isFirst) {
            masonry2.appended(card);
          }
        }
      }
      const CONFIG = {
        torrentListTable: "table.torrents",
        TORRENT_LIST_TO_JSON: TORRENT_LIST_TO_JSON$1,
        RENDER_TORRENT_JSON_IN_MASONRY: RENDER_TORRENT_JSON_IN_MASONRY$1,
        /**如果站点有必要设置分类颜色, 可以用自定义的 */
        LOADING_IMG: "/pic/PTer.Club_Logo_2023.png",
        /**如果站点有自定义的icon, 可以用自定义的 */
        ICON: {},
        /**如果站点有必要设置自定义的css, 可以用自定义的 */
        CSS: css,
        /**如果站点有必要设置分类颜色, 可以用自定义的 */
        CATEGORY: {
          // 分类
          401: "#ca464b",
          // Movie
          404: "#ed8f3b",
          // TV Series
          403: "#729dbf",
          // Anime
          405: "#d97163",
          // TV Show
          413: "#a1dae7",
          // MV
          406: "#2a4f85",
          // Music
          418: "#61281d",
          // Real Show      
          402: "#bb3e6e",
          // 纪录教育
          407: "#275b5c",
          // Sport
          408: "#f6eda2",
          // EBook
          409: "#7a5a5e",
          // Game
          410: "#e5b2af",
          // Software
          411: "#c1aa92",
          // Learn
          412: "#c5c6c8"
          // Other
        }
      };
      function css(variable) {
        return ` 
  /* 卡片种类tag */
  .card-category{
    height: 24px;
    padding: 0 6px;
    border: 1px;
    background: black;
    color: white;
    font-weight: 600;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  
    display: flex;
    align-items: center;
  }
  
  /* 卡片种类tag预览图 */
  .card-category-img
  {
    height: 18px;
  
    background-size: 100% 141%;
    background-position: center top;
    padding-left: 5%;
  }
`;
      }
      function TORRENT_LIST_TO_JSON$1(torrent_list_Dom, CARD2) {
        const rows = torrent_list_Dom.querySelectorAll("tbody tr");
        const data = [];
        rows.forEach((row) => {
          const categoryImg = row.querySelector("td:nth-child(1) > a > img");
          const category = categoryImg ? categoryImg.alt : "";
          if (!category)
            return;
          const DOM_LIST = row.querySelectorAll("td.rowfollow");
          const categoryLinkDOM = categoryImg.parentNode;
          const categoryLink = categoryLinkDOM.href;
          const categoryNumber = categoryLink.slice(-3);
          const _categoryImg = categoryImg.cloneNode(true);
          _categoryImg.className = "card-category-img";
          const torrentIndex = CARD2.CARD_INDEX++;
          const torrentNameLink = row.querySelector(".torrentname a");
          const torrentName = torrentNameLink ? torrentNameLink.textContent.trim() : "";
          const torrentLink = torrentNameLink.href;
          const pattern = /id=(\d+)/;
          const match = torrentLink.match(pattern);
          const torrentId = match ? parseInt(match[1]) : null;
          const picLink = DOM_LIST[1].querySelector(".torrentname img").getAttribute("data-orig");
          const desCell = DOM_LIST[1].querySelector(".torrentname td:nth-child(2) > div > div:nth-child(2)");
          const length = desCell ? desCell.childNodes.length - 1 : null;
          const desDom = desCell ? desCell.childNodes[length] : null;
          const description = desCell ? desDom.nodeName == "SPAN" ? desDom.textContent.trim() : "" : null;
          const place_at_the_top = DOM_LIST[1].querySelectorAll(".torrentname img.sticky");
          const pattMsg = place_at_the_top[0] ? place_at_the_top[0].title : "";
          const tempTagDom = DOM_LIST[1].querySelectorAll(".torrentname td:nth-child(2) font");
          const freeTypeImg = DOM_LIST[1].querySelector('img[class^="pro_"]');
          const freeType = freeTypeImg ? "_" + freeTypeImg.alt.replace(/\s+/g, "") : "";
          const freeRemainingTimeSpan = freeType ? DOM_LIST[1].querySelector(".torrentname td:nth-child(2) > div > div:nth-child(1) span") : "";
          const freeRemainingTime = freeRemainingTimeSpan ? freeRemainingTimeSpan.innerText : "";
          const tagSpans = DOM_LIST[1].querySelectorAll(".torrentname td:nth-child(2) > div > div:nth-child(2) a");
          const tagsDOM = Array.from(tagSpans);
          let tags = tagSpans ? tagsDOM.map((span) => span.textContent.trim()) : [];
          if (freeRemainingTime != "") {
            tags.shift();
            tagsDOM.shift();
          }
          const raw_tags = tagsDOM.map((el) => el.outerHTML).join("");
          const downloadLink = row.querySelector("td:nth-child(5) a").href;
          const collectLink = `javascript: bookmark(${torrentId},${torrentIndex});`;
          const collectDOM = row.querySelector(".torrentname a[id^='bookmark']");
          const collectState = collectDOM.children[0].alt;
          const commentsLink = DOM_LIST[2];
          const comments = commentsLink ? parseInt(commentsLink.textContent) : 0;
          const uploadDateSpan = DOM_LIST[3].childNodes[0];
          const uploadDate = uploadDateSpan ? uploadDateSpan.title : "";
          const sizeCell = DOM_LIST[4];
          const size = sizeCell ? sizeCell.textContent.trim() : "";
          const seedersLink = DOM_LIST[5];
          const seeders = seedersLink ? parseInt(seedersLink.textContent) : 0;
          const leechersCell = DOM_LIST[6];
          const leechers = leechersCell ? parseInt(leechersCell.textContent) : 0;
          const snatchedLink = DOM_LIST[7];
          const snatched = snatchedLink ? parseInt(snatchedLink.textContent) : 0;
          const rowData = {
            torrentIndex,
            _categoryImg,
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
            tagsDOM,
            tags,
            description,
            upload_date: uploadDate,
            comments,
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
            _categoryImg,
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
            tagsDOM,
            tags,
            description,
            upload_date: uploadDate,
            comments,
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
    <!--${_categoryImg.outerHTML}-->
    ${category}    
  </div>

  <!-- 标题 & 跳转详情链接 -->    
  <div class="card-title">
    <a class="two-lines" src="${torrentLink}" href="${torrentLink}" target="_blank">
      ${tempTagDom ? Array.from(tempTagDom).map((e) => e.outerHTML).join("&nbsp;") : ""}
      <b>${torrentName}</b>
    </a>
  </div>

  <!-- 卡片其他信息 -->    
  <div class="card-body">
    <div class="card-image" onclick="window.open('${torrentLink}')">
      <!-- <img class="card-image--img nexus-lazy-load_Kesa" src="pic/misc/spinner.svg" data-src="${picLink}"  alt="${torrentName}" /> -->
      <!-- NOTE: 加载图片这里换成了logo, 和 MT 一样了捏 -->    
      <img class="card-image--img nexus-lazy-load_Kesa" src="${CONFIG.LOADING_IMG}" data-src="${picLink}"  alt="${torrentName}" />
      <div class="card-index">
        ${torrentIndex + 1}
      </div>  
    </div>

    <!-- 置顶 && 免费类型&剩余时间 -->      
    ${freeType || pattMsg ? `
      <div class="card-alter">          
        <div class="top_and_free ${freeType}">
          <!-- 置顶等级 -->
          ${place_at_the_top.length != 0 ? Array.from(place_at_the_top).map((e) => e.outerHTML) + "&nbsp;" : ""}

          <!-- 免费类型 & 免费剩余时间 -->
          ${freeTypeImg ? freeTypeImg.outerHTML : ""}  <b>${freeRemainingTime ? "&nbsp;" + freeRemainingTime : ""}</b>
        </div>
      </div>
          ` : ``}

    <!-- 置顶等级 -->
    <!--${pattMsg ? `<div><b>置顶等级:</b> ${pattMsg}</div>` : ""}-->

    <!-- 副标题 -->
    ${description ? `<a class="card-description" href='${torrentLink}'> ${description}</a>` : ""}
    

    <!-- 标签 Tags -->
    <div class="cl-tags">
      ${tagsDOM.map((el) => {
          const _tag = document.createElement("div");
          _tag.innerHTML = el.outerHTML;
          return _tag.outerHTML;
        }).join("")}
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
              sortMasonry();
            }
            const observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.attributeName === "src") {
                  if (masonry2) {
                    sortMasonry();
                  }
                }
              });
            });
            const config = {
              attributes: true,
              // 监听属性变化
              attributeFilter: ["src"]
              // 只监听 src 属性的变化
            };
            observer.observe(card_img, config);
          };
          card_img.addEventListener("load", () => {
            if (masonry2) {
              sortMasonry();
            }
          });
          waterfallNode.appendChild(card);
          if (!isFirst) {
            masonry2.appended(card);
          }
        }
      }
      const SITE = {
        "kp.m-team.cc": CONFIG$1,
        "kamept.com": CONFIG$2,
        "pterclub.com": CONFIG
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
        RENDER_TORRENT_JSON_IN_MASONRY(waterfallNode, data, isFirst, masonry2);
        NEXUS_TOOLS();
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
        sortMasonry();
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
      function ADD_SITE_EXCLUSIVE_CSS() {
        if (SITE[SITE_DOMAIN].CSS)
          return SITE[SITE_DOMAIN].CSS();
        else
          console.log("本站点无自定义CSS~");
      }
      function NEXUS_TOOLS() {
        jQuery(document).ready(function() {
          function getImgPosition(event, imgEle2) {
            let imgWidth = imgEle2.prop("naturalWidth");
            let imgHeight = imgEle2.prop("naturalHeight");
            let ratio = imgWidth / imgHeight;
            let offsetX = 0;
            let offsetY = 0;
            let width = window.innerWidth - event.clientX;
            let height = window.innerHeight - event.clientY;
            let changeOffsetY = 0;
            let changeOffsetX = false;
            if (event.clientX > window.innerWidth / 2 && event.clientX + imgWidth > window.innerWidth) {
              changeOffsetX = true;
              width = event.clientX;
            }
            if (event.clientY > window.innerHeight / 2) {
              if (event.clientY + imgHeight / 2 > window.innerHeight) {
                changeOffsetY = 1;
                height = event.clientY;
              } else if (event.clientY + imgHeight > window.innerHeight) {
                changeOffsetY = 2;
                height = event.clientY;
              }
            }
            if (imgWidth > width) {
              imgWidth = width;
              imgHeight = imgWidth / ratio;
            }
            if (imgHeight > height) {
              imgHeight = height;
              imgWidth = imgHeight * ratio;
            }
            if (changeOffsetX) {
              offsetX = -imgWidth;
            }
            if (changeOffsetY == 1) {
              offsetY = -(imgHeight - (window.innerHeight - event.clientY));
            } else if (changeOffsetY == 2) {
              offsetY = -imgHeight / 2;
            }
            return { imgWidth, imgHeight, offsetX, offsetY };
          }
          function getPosition(event, position) {
            return {
              left: event.pageX + position.offsetX,
              top: event.pageY + position.offsetY,
              width: position.imgWidth,
              height: position.imgHeight
            };
          }
          if (!jQuery("#nexus-preview").length) {
            const _previewDom = document.body.appendChild(document.createElement("img"));
            _previewDom.id = "nexus-preview";
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
            imgPosition = getImgPosition(e, imgEle);
            let position = getPosition(e, imgPosition);
            previewEle.css(position);
          });
          if ("IntersectionObserver" in window) {
            let imgList = [...document.querySelectorAll(".nexus-lazy-load_Kesa")];
            const io = new IntersectionObserver((entries) => {
              entries.forEach((entry) => {
                const el = entry.target;
                entry.intersectionRatio;
                el._entry = entry;
                if (entry.isIntersecting && !el.classList.contains("preview_Kesa")) {
                  const source = el.dataset.src;
                  el.src = source;
                  el.classList.add("preview_Kesa");
                  if (masonry) {
                    sortMasonry();
                  }
                }
              });
            });
            imgList.forEach((img) => io.observe(img));
          }
        });
      }
      /*!
       * Masonry PACKAGED v4.2.2
       * Cascading grid layout library
       * https://masonry.desandro.com
       * MIT License
       * by David DeSandro
       */
      !function(t, e) {
        "function" == typeof define && define.amd ? define("jquery-bridget/jquery-bridget", ["jquery"], function(i) {
          return e(t, i);
        }) : "object" == typeof module && module.exports ? module.exports = e(t, require("jquery")) : t.jQueryBridget = e(t, t.jQuery);
      }(window, function(t, e) {
        function i(i2, r2, a) {
          function h(t2, e2, n2) {
            var o2, r3 = "$()." + i2 + '("' + e2 + '")';
            return t2.each(function(t3, h2) {
              var u2 = a.data(h2, i2);
              if (!u2)
                return void s(i2 + " not initialized. Cannot call methods, i.e. " + r3);
              var d = u2[e2];
              if (!d || "_" == e2.charAt(0))
                return void s(r3 + " is not a valid method");
              var l = d.apply(u2, n2);
              o2 = void 0 === o2 ? l : o2;
            }), void 0 !== o2 ? o2 : t2;
          }
          function u(t2, e2) {
            t2.each(function(t3, n2) {
              var o2 = a.data(n2, i2);
              o2 ? (o2.option(e2), o2._init()) : (o2 = new r2(n2, e2), a.data(n2, i2, o2));
            });
          }
          a = a || e || t.jQuery, a && (r2.prototype.option || (r2.prototype.option = function(t2) {
            a.isPlainObject(t2) && (this.options = a.extend(true, this.options, t2));
          }), a.fn[i2] = function(t2) {
            if ("string" == typeof t2) {
              var e2 = o.call(arguments, 1);
              return h(this, t2, e2);
            }
            return u(this, t2), this;
          }, n(a));
        }
        function n(t2) {
          !t2 || t2 && t2.bridget || (t2.bridget = i);
        }
        var o = Array.prototype.slice, r = t.console, s = "undefined" == typeof r ? function() {
        } : function(t2) {
          r.error(t2);
        };
        return n(e || t.jQuery), i;
      }), function(t, e) {
        "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == typeof module && module.exports ? module.exports = e() : t.EvEmitter = e();
      }("undefined" != typeof window ? window : globalThis, function() {
        function t() {
        }
        var e = t.prototype;
        return e.on = function(t2, e2) {
          if (t2 && e2) {
            var i = this._events = this._events || {}, n = i[t2] = i[t2] || [];
            return -1 == n.indexOf(e2) && n.push(e2), this;
          }
        }, e.once = function(t2, e2) {
          if (t2 && e2) {
            this.on(t2, e2);
            var i = this._onceEvents = this._onceEvents || {}, n = i[t2] = i[t2] || {};
            return n[e2] = true, this;
          }
        }, e.off = function(t2, e2) {
          var i = this._events && this._events[t2];
          if (i && i.length) {
            var n = i.indexOf(e2);
            return -1 != n && i.splice(n, 1), this;
          }
        }, e.emitEvent = function(t2, e2) {
          var i = this._events && this._events[t2];
          if (i && i.length) {
            i = i.slice(0), e2 = e2 || [];
            for (var n = this._onceEvents && this._onceEvents[t2], o = 0; o < i.length; o++) {
              var r = i[o], s = n && n[r];
              s && (this.off(t2, r), delete n[r]), r.apply(this, e2);
            }
            return this;
          }
        }, e.allOff = function() {
          delete this._events, delete this._onceEvents;
        }, t;
      }), function(t, e) {
        "function" == typeof define && define.amd ? define("get-size/get-size", e) : "object" == typeof module && module.exports ? module.exports = e() : t.getSize = e();
      }(window, function() {
        function t(t2) {
          var e2 = parseFloat(t2), i2 = -1 == t2.indexOf("%") && !isNaN(e2);
          return i2 && e2;
        }
        function e() {
        }
        function i() {
          for (var t2 = { width: 0, height: 0, innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0 }, e2 = 0; u > e2; e2++) {
            var i2 = h[e2];
            t2[i2] = 0;
          }
          return t2;
        }
        function n(t2) {
          var e2 = getComputedStyle(t2);
          return e2 || a("Style returned " + e2 + ". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"), e2;
        }
        function o() {
          if (!d) {
            d = true;
            var e2 = document.createElement("div");
            e2.style.width = "200px", e2.style.padding = "1px 2px 3px 4px", e2.style.borderStyle = "solid", e2.style.borderWidth = "1px 2px 3px 4px", e2.style.boxSizing = "border-box";
            var i2 = document.body || document.documentElement;
            i2.appendChild(e2);
            var o2 = n(e2);
            s = 200 == Math.round(t(o2.width)), r.isBoxSizeOuter = s, i2.removeChild(e2);
          }
        }
        function r(e2) {
          if (o(), "string" == typeof e2 && (e2 = document.querySelector(e2)), e2 && "object" == typeof e2 && e2.nodeType) {
            var r2 = n(e2);
            if ("none" == r2.display)
              return i();
            var a2 = {};
            a2.width = e2.offsetWidth, a2.height = e2.offsetHeight;
            for (var d2 = a2.isBorderBox = "border-box" == r2.boxSizing, l = 0; u > l; l++) {
              var c = h[l], f = r2[c], m = parseFloat(f);
              a2[c] = isNaN(m) ? 0 : m;
            }
            var p = a2.paddingLeft + a2.paddingRight, g = a2.paddingTop + a2.paddingBottom, y = a2.marginLeft + a2.marginRight, v = a2.marginTop + a2.marginBottom, _ = a2.borderLeftWidth + a2.borderRightWidth, z = a2.borderTopWidth + a2.borderBottomWidth, E = d2 && s, b = t(r2.width);
            b !== false && (a2.width = b + (E ? 0 : p + _));
            var x = t(r2.height);
            return x !== false && (a2.height = x + (E ? 0 : g + z)), a2.innerWidth = a2.width - (p + _), a2.innerHeight = a2.height - (g + z), a2.outerWidth = a2.width + y, a2.outerHeight = a2.height + v, a2;
          }
        }
        var s, a = "undefined" == typeof console ? e : function(t2) {
          console.error(t2);
        }, h = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"], u = h.length, d = false;
        return r;
      }), function(t, e) {
        "function" == typeof define && define.amd ? define("desandro-matches-selector/matches-selector", e) : "object" == typeof module && module.exports ? module.exports = e() : t.matchesSelector = e();
      }(window, function() {
        var t = function() {
          var t2 = window.Element.prototype;
          if (t2.matches)
            return "matches";
          if (t2.matchesSelector)
            return "matchesSelector";
          for (var e = ["webkit", "moz", "ms", "o"], i = 0; i < e.length; i++) {
            var n = e[i], o = n + "MatchesSelector";
            if (t2[o])
              return o;
          }
        }();
        return function(e, i) {
          return e[t](i);
        };
      }), function(t, e) {
        "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["desandro-matches-selector/matches-selector"], function(i) {
          return e(t, i);
        }) : "object" == typeof module && module.exports ? module.exports = e(t, require("desandro-matches-selector")) : t.fizzyUIUtils = e(t, t.matchesSelector);
      }(window, function(t, e) {
        var i = {};
        i.extend = function(t2, e2) {
          for (var i2 in e2)
            t2[i2] = e2[i2];
          return t2;
        }, i.modulo = function(t2, e2) {
          return (t2 % e2 + e2) % e2;
        };
        var n = Array.prototype.slice;
        i.makeArray = function(t2) {
          if (Array.isArray(t2))
            return t2;
          if (null === t2 || void 0 === t2)
            return [];
          var e2 = "object" == typeof t2 && "number" == typeof t2.length;
          return e2 ? n.call(t2) : [t2];
        }, i.removeFrom = function(t2, e2) {
          var i2 = t2.indexOf(e2);
          -1 != i2 && t2.splice(i2, 1);
        }, i.getParent = function(t2, i2) {
          for (; t2.parentNode && t2 != document.body; )
            if (t2 = t2.parentNode, e(t2, i2))
              return t2;
        }, i.getQueryElement = function(t2) {
          return "string" == typeof t2 ? document.querySelector(t2) : t2;
        }, i.handleEvent = function(t2) {
          var e2 = "on" + t2.type;
          this[e2] && this[e2](t2);
        }, i.filterFindElements = function(t2, n2) {
          t2 = i.makeArray(t2);
          var o2 = [];
          return t2.forEach(function(t3) {
            if (t3 instanceof HTMLElement) {
              if (!n2)
                return void o2.push(t3);
              e(t3, n2) && o2.push(t3);
              for (var i2 = t3.querySelectorAll(n2), r = 0; r < i2.length; r++)
                o2.push(i2[r]);
            }
          }), o2;
        }, i.debounceMethod = function(t2, e2, i2) {
          i2 = i2 || 100;
          var n2 = t2.prototype[e2], o2 = e2 + "Timeout";
          t2.prototype[e2] = function() {
            var t3 = this[o2];
            clearTimeout(t3);
            var e3 = arguments, r = this;
            this[o2] = setTimeout(function() {
              n2.apply(r, e3), delete r[o2];
            }, i2);
          };
        }, i.docReady = function(t2) {
          var e2 = document.readyState;
          "complete" == e2 || "interactive" == e2 ? setTimeout(t2) : document.addEventListener("DOMContentLoaded", t2);
        }, i.toDashed = function(t2) {
          return t2.replace(/(.)([A-Z])/g, function(t3, e2, i2) {
            return e2 + "-" + i2;
          }).toLowerCase();
        };
        var o = t.console;
        return i.htmlInit = function(e2, n2) {
          i.docReady(function() {
            var r = i.toDashed(n2), s = "data-" + r, a = document.querySelectorAll("[" + s + "]"), h = document.querySelectorAll(".js-" + r), u = i.makeArray(a).concat(i.makeArray(h)), d = s + "-options", l = t.jQuery;
            u.forEach(function(t2) {
              var i2, r2 = t2.getAttribute(s) || t2.getAttribute(d);
              try {
                i2 = r2 && JSON.parse(r2);
              } catch (a2) {
                return void (o && o.error("Error parsing " + s + " on " + t2.className + ": " + a2));
              }
              var h2 = new e2(t2, i2);
              l && l.data(t2, n2, h2);
            });
          });
        }, i;
      }), function(t, e) {
        "function" == typeof define && define.amd ? define("outlayer/item", ["ev-emitter/ev-emitter", "get-size/get-size"], e) : "object" == typeof module && module.exports ? module.exports = e(require("ev-emitter"), require("get-size")) : (t.Outlayer = {}, t.Outlayer.Item = e(t.EvEmitter, t.getSize));
      }(window, function(t, e) {
        function i(t2) {
          for (var e2 in t2)
            return false;
          return e2 = null, true;
        }
        function n(t2, e2) {
          t2 && (this.element = t2, this.layout = e2, this.position = { x: 0, y: 0 }, this._create());
        }
        function o(t2) {
          return t2.replace(/([A-Z])/g, function(t3) {
            return "-" + t3.toLowerCase();
          });
        }
        var r = document.documentElement.style, s = "string" == typeof r.transition ? "transition" : "WebkitTransition", a = "string" == typeof r.transform ? "transform" : "WebkitTransform", h = { WebkitTransition: "webkitTransitionEnd", transition: "transitionend" }[s], u = { transform: a, transition: s, transitionDuration: s + "Duration", transitionProperty: s + "Property", transitionDelay: s + "Delay" }, d = n.prototype = Object.create(t.prototype);
        d.constructor = n, d._create = function() {
          this._transn = { ingProperties: {}, clean: {}, onEnd: {} }, this.css({ position: "absolute" });
        }, d.handleEvent = function(t2) {
          var e2 = "on" + t2.type;
          this[e2] && this[e2](t2);
        }, d.getSize = function() {
          this.size = e(this.element);
        }, d.css = function(t2) {
          var e2 = this.element.style;
          for (var i2 in t2) {
            var n2 = u[i2] || i2;
            e2[n2] = t2[i2];
          }
        }, d.getPosition = function() {
          var t2 = getComputedStyle(this.element), e2 = this.layout._getOption("originLeft"), i2 = this.layout._getOption("originTop"), n2 = t2[e2 ? "left" : "right"], o2 = t2[i2 ? "top" : "bottom"], r2 = parseFloat(n2), s2 = parseFloat(o2), a2 = this.layout.size;
          -1 != n2.indexOf("%") && (r2 = r2 / 100 * a2.width), -1 != o2.indexOf("%") && (s2 = s2 / 100 * a2.height), r2 = isNaN(r2) ? 0 : r2, s2 = isNaN(s2) ? 0 : s2, r2 -= e2 ? a2.paddingLeft : a2.paddingRight, s2 -= i2 ? a2.paddingTop : a2.paddingBottom, this.position.x = r2, this.position.y = s2;
        }, d.layoutPosition = function() {
          var t2 = this.layout.size, e2 = {}, i2 = this.layout._getOption("originLeft"), n2 = this.layout._getOption("originTop"), o2 = i2 ? "paddingLeft" : "paddingRight", r2 = i2 ? "left" : "right", s2 = i2 ? "right" : "left", a2 = this.position.x + t2[o2];
          e2[r2] = this.getXValue(a2), e2[s2] = "";
          var h2 = n2 ? "paddingTop" : "paddingBottom", u2 = n2 ? "top" : "bottom", d2 = n2 ? "bottom" : "top", l2 = this.position.y + t2[h2];
          e2[u2] = this.getYValue(l2), e2[d2] = "", this.css(e2), this.emitEvent("layout", [this]);
        }, d.getXValue = function(t2) {
          var e2 = this.layout._getOption("horizontal");
          return this.layout.options.percentPosition && !e2 ? t2 / this.layout.size.width * 100 + "%" : t2 + "px";
        }, d.getYValue = function(t2) {
          var e2 = this.layout._getOption("horizontal");
          return this.layout.options.percentPosition && e2 ? t2 / this.layout.size.height * 100 + "%" : t2 + "px";
        }, d._transitionTo = function(t2, e2) {
          this.getPosition();
          var i2 = this.position.x, n2 = this.position.y, o2 = t2 == this.position.x && e2 == this.position.y;
          if (this.setPosition(t2, e2), o2 && !this.isTransitioning)
            return void this.layoutPosition();
          var r2 = t2 - i2, s2 = e2 - n2, a2 = {};
          a2.transform = this.getTranslate(r2, s2), this.transition({ to: a2, onTransitionEnd: { transform: this.layoutPosition }, isCleaning: true });
        }, d.getTranslate = function(t2, e2) {
          var i2 = this.layout._getOption("originLeft"), n2 = this.layout._getOption("originTop");
          return t2 = i2 ? t2 : -t2, e2 = n2 ? e2 : -e2, "translate3d(" + t2 + "px, " + e2 + "px, 0)";
        }, d.goTo = function(t2, e2) {
          this.setPosition(t2, e2), this.layoutPosition();
        }, d.moveTo = d._transitionTo, d.setPosition = function(t2, e2) {
          this.position.x = parseFloat(t2), this.position.y = parseFloat(e2);
        }, d._nonTransition = function(t2) {
          this.css(t2.to), t2.isCleaning && this._removeStyles(t2.to);
          for (var e2 in t2.onTransitionEnd)
            t2.onTransitionEnd[e2].call(this);
        }, d.transition = function(t2) {
          if (!parseFloat(this.layout.options.transitionDuration))
            return void this._nonTransition(t2);
          var e2 = this._transn;
          for (var i2 in t2.onTransitionEnd)
            e2.onEnd[i2] = t2.onTransitionEnd[i2];
          for (i2 in t2.to)
            e2.ingProperties[i2] = true, t2.isCleaning && (e2.clean[i2] = true);
          if (t2.from) {
            this.css(t2.from);
            this.element.offsetHeight;
          }
          this.enableTransition(t2.to), this.css(t2.to), this.isTransitioning = true;
        };
        var l = "opacity," + o(a);
        d.enableTransition = function() {
          if (!this.isTransitioning) {
            var t2 = this.layout.options.transitionDuration;
            t2 = "number" == typeof t2 ? t2 + "ms" : t2, this.css({ transitionProperty: l, transitionDuration: t2, transitionDelay: this.staggerDelay || 0 }), this.element.addEventListener(h, this, false);
          }
        }, d.onwebkitTransitionEnd = function(t2) {
          this.ontransitionend(t2);
        }, d.onotransitionend = function(t2) {
          this.ontransitionend(t2);
        };
        var c = { "-webkit-transform": "transform" };
        d.ontransitionend = function(t2) {
          if (t2.target === this.element) {
            var e2 = this._transn, n2 = c[t2.propertyName] || t2.propertyName;
            if (delete e2.ingProperties[n2], i(e2.ingProperties) && this.disableTransition(), n2 in e2.clean && (this.element.style[t2.propertyName] = "", delete e2.clean[n2]), n2 in e2.onEnd) {
              var o2 = e2.onEnd[n2];
              o2.call(this), delete e2.onEnd[n2];
            }
            this.emitEvent("transitionEnd", [this]);
          }
        }, d.disableTransition = function() {
          this.removeTransitionStyles(), this.element.removeEventListener(h, this, false), this.isTransitioning = false;
        }, d._removeStyles = function(t2) {
          var e2 = {};
          for (var i2 in t2)
            e2[i2] = "";
          this.css(e2);
        };
        var f = { transitionProperty: "", transitionDuration: "", transitionDelay: "" };
        return d.removeTransitionStyles = function() {
          this.css(f);
        }, d.stagger = function(t2) {
          t2 = isNaN(t2) ? 0 : t2, this.staggerDelay = t2 + "ms";
        }, d.removeElem = function() {
          this.element.parentNode.removeChild(this.element), this.css({ display: "" }), this.emitEvent("remove", [this]);
        }, d.remove = function() {
          return s && parseFloat(this.layout.options.transitionDuration) ? (this.once("transitionEnd", function() {
            this.removeElem();
          }), void this.hide()) : void this.removeElem();
        }, d.reveal = function() {
          delete this.isHidden, this.css({ display: "" });
          var t2 = this.layout.options, e2 = {}, i2 = this.getHideRevealTransitionEndProperty("visibleStyle");
          e2[i2] = this.onRevealTransitionEnd, this.transition({ from: t2.hiddenStyle, to: t2.visibleStyle, isCleaning: true, onTransitionEnd: e2 });
        }, d.onRevealTransitionEnd = function() {
          this.isHidden || this.emitEvent("reveal");
        }, d.getHideRevealTransitionEndProperty = function(t2) {
          var e2 = this.layout.options[t2];
          if (e2.opacity)
            return "opacity";
          for (var i2 in e2)
            return i2;
        }, d.hide = function() {
          this.isHidden = true, this.css({ display: "" });
          var t2 = this.layout.options, e2 = {}, i2 = this.getHideRevealTransitionEndProperty("hiddenStyle");
          e2[i2] = this.onHideTransitionEnd, this.transition({ from: t2.visibleStyle, to: t2.hiddenStyle, isCleaning: true, onTransitionEnd: e2 });
        }, d.onHideTransitionEnd = function() {
          this.isHidden && (this.css({ display: "none" }), this.emitEvent("hide"));
        }, d.destroy = function() {
          this.css({ position: "", left: "", right: "", top: "", bottom: "", transition: "", transform: "" });
        }, n;
      }), function(t, e) {
        "function" == typeof define && define.amd ? define("outlayer/outlayer", ["ev-emitter/ev-emitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], function(i, n, o, r) {
          return e(t, i, n, o, r);
        }) : "object" == typeof module && module.exports ? module.exports = e(t, require("ev-emitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : t.Outlayer = e(t, t.EvEmitter, t.getSize, t.fizzyUIUtils, t.Outlayer.Item);
      }(window, function(t, e, i, n, o) {
        function r(t2, e2) {
          var i2 = n.getQueryElement(t2);
          if (!i2)
            return void (h && h.error("Bad element for " + this.constructor.namespace + ": " + (i2 || t2)));
          this.element = i2, u && (this.$element = u(this.element)), this.options = n.extend({}, this.constructor.defaults), this.option(e2);
          var o2 = ++l;
          this.element.outlayerGUID = o2, c[o2] = this, this._create();
          var r2 = this._getOption("initLayout");
          r2 && this.layout();
        }
        function s(t2) {
          function e2() {
            t2.apply(this, arguments);
          }
          return e2.prototype = Object.create(t2.prototype), e2.prototype.constructor = e2, e2;
        }
        function a(t2) {
          if ("number" == typeof t2)
            return t2;
          var e2 = t2.match(/(^\d*\.?\d*)(\w*)/), i2 = e2 && e2[1], n2 = e2 && e2[2];
          if (!i2.length)
            return 0;
          i2 = parseFloat(i2);
          var o2 = m[n2] || 1;
          return i2 * o2;
        }
        var h = t.console, u = t.jQuery, d = function() {
        }, l = 0, c = {};
        r.namespace = "outlayer", r.Item = o, r.defaults = { containerStyle: { position: "relative" }, initLayout: true, originLeft: true, originTop: true, resize: true, resizeContainer: true, transitionDuration: "0.4s", hiddenStyle: { opacity: 0, transform: "scale(0.001)" }, visibleStyle: { opacity: 1, transform: "scale(1)" } };
        var f = r.prototype;
        n.extend(f, e.prototype), f.option = function(t2) {
          n.extend(this.options, t2);
        }, f._getOption = function(t2) {
          var e2 = this.constructor.compatOptions[t2];
          return e2 && void 0 !== this.options[e2] ? this.options[e2] : this.options[t2];
        }, r.compatOptions = { initLayout: "isInitLayout", horizontal: "isHorizontal", layoutInstant: "isLayoutInstant", originLeft: "isOriginLeft", originTop: "isOriginTop", resize: "isResizeBound", resizeContainer: "isResizingContainer" }, f._create = function() {
          this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), n.extend(this.element.style, this.options.containerStyle);
          var t2 = this._getOption("resize");
          t2 && this.bindResize();
        }, f.reloadItems = function() {
          this.items = this._itemize(this.element.children);
        }, f._itemize = function(t2) {
          for (var e2 = this._filterFindItemElements(t2), i2 = this.constructor.Item, n2 = [], o2 = 0; o2 < e2.length; o2++) {
            var r2 = e2[o2], s2 = new i2(r2, this);
            n2.push(s2);
          }
          return n2;
        }, f._filterFindItemElements = function(t2) {
          return n.filterFindElements(t2, this.options.itemSelector);
        }, f.getItemElements = function() {
          return this.items.map(function(t2) {
            return t2.element;
          });
        }, f.layout = function() {
          this._resetLayout(), this._manageStamps();
          var t2 = this._getOption("layoutInstant"), e2 = void 0 !== t2 ? t2 : !this._isLayoutInited;
          this.layoutItems(this.items, e2), this._isLayoutInited = true;
        }, f._init = f.layout, f._resetLayout = function() {
          this.getSize();
        }, f.getSize = function() {
          this.size = i(this.element);
        }, f._getMeasurement = function(t2, e2) {
          var n2, o2 = this.options[t2];
          o2 ? ("string" == typeof o2 ? n2 = this.element.querySelector(o2) : o2 instanceof HTMLElement && (n2 = o2), this[t2] = n2 ? i(n2)[e2] : o2) : this[t2] = 0;
        }, f.layoutItems = function(t2, e2) {
          t2 = this._getItemsForLayout(t2), this._layoutItems(t2, e2), this._postLayout();
        }, f._getItemsForLayout = function(t2) {
          return t2.filter(function(t3) {
            return !t3.isIgnored;
          });
        }, f._layoutItems = function(t2, e2) {
          if (this._emitCompleteOnItems("layout", t2), t2 && t2.length) {
            var i2 = [];
            t2.forEach(function(t3) {
              var n2 = this._getItemLayoutPosition(t3);
              n2.item = t3, n2.isInstant = e2 || t3.isLayoutInstant, i2.push(n2);
            }, this), this._processLayoutQueue(i2);
          }
        }, f._getItemLayoutPosition = function() {
          return { x: 0, y: 0 };
        }, f._processLayoutQueue = function(t2) {
          this.updateStagger(), t2.forEach(function(t3, e2) {
            this._positionItem(t3.item, t3.x, t3.y, t3.isInstant, e2);
          }, this);
        }, f.updateStagger = function() {
          var t2 = this.options.stagger;
          return null === t2 || void 0 === t2 ? void (this.stagger = 0) : (this.stagger = a(t2), this.stagger);
        }, f._positionItem = function(t2, e2, i2, n2, o2) {
          n2 ? t2.goTo(e2, i2) : (t2.stagger(o2 * this.stagger), t2.moveTo(e2, i2));
        }, f._postLayout = function() {
          this.resizeContainer();
        }, f.resizeContainer = function() {
          var t2 = this._getOption("resizeContainer");
          if (t2) {
            var e2 = this._getContainerSize();
            e2 && (this._setContainerMeasure(e2.width, true), this._setContainerMeasure(e2.height, false));
          }
        }, f._getContainerSize = d, f._setContainerMeasure = function(t2, e2) {
          if (void 0 !== t2) {
            var i2 = this.size;
            i2.isBorderBox && (t2 += e2 ? i2.paddingLeft + i2.paddingRight + i2.borderLeftWidth + i2.borderRightWidth : i2.paddingBottom + i2.paddingTop + i2.borderTopWidth + i2.borderBottomWidth), t2 = Math.max(t2, 0), this.element.style[e2 ? "width" : "height"] = t2 + "px";
          }
        }, f._emitCompleteOnItems = function(t2, e2) {
          function i2() {
            o2.dispatchEvent(t2 + "Complete", null, [e2]);
          }
          function n2() {
            s2++, s2 == r2 && i2();
          }
          var o2 = this, r2 = e2.length;
          if (!e2 || !r2)
            return void i2();
          var s2 = 0;
          e2.forEach(function(e3) {
            e3.once(t2, n2);
          });
        }, f.dispatchEvent = function(t2, e2, i2) {
          var n2 = e2 ? [e2].concat(i2) : i2;
          if (this.emitEvent(t2, n2), u)
            if (this.$element = this.$element || u(this.element), e2) {
              var o2 = u.Event(e2);
              o2.type = t2, this.$element.trigger(o2, i2);
            } else
              this.$element.trigger(t2, i2);
        }, f.ignore = function(t2) {
          var e2 = this.getItem(t2);
          e2 && (e2.isIgnored = true);
        }, f.unignore = function(t2) {
          var e2 = this.getItem(t2);
          e2 && delete e2.isIgnored;
        }, f.stamp = function(t2) {
          t2 = this._find(t2), t2 && (this.stamps = this.stamps.concat(t2), t2.forEach(this.ignore, this));
        }, f.unstamp = function(t2) {
          t2 = this._find(t2), t2 && t2.forEach(function(t3) {
            n.removeFrom(this.stamps, t3), this.unignore(t3);
          }, this);
        }, f._find = function(t2) {
          return t2 ? ("string" == typeof t2 && (t2 = this.element.querySelectorAll(t2)), t2 = n.makeArray(t2)) : void 0;
        }, f._manageStamps = function() {
          this.stamps && this.stamps.length && (this._getBoundingRect(), this.stamps.forEach(this._manageStamp, this));
        }, f._getBoundingRect = function() {
          var t2 = this.element.getBoundingClientRect(), e2 = this.size;
          this._boundingRect = { left: t2.left + e2.paddingLeft + e2.borderLeftWidth, top: t2.top + e2.paddingTop + e2.borderTopWidth, right: t2.right - (e2.paddingRight + e2.borderRightWidth), bottom: t2.bottom - (e2.paddingBottom + e2.borderBottomWidth) };
        }, f._manageStamp = d, f._getElementOffset = function(t2) {
          var e2 = t2.getBoundingClientRect(), n2 = this._boundingRect, o2 = i(t2), r2 = { left: e2.left - n2.left - o2.marginLeft, top: e2.top - n2.top - o2.marginTop, right: n2.right - e2.right - o2.marginRight, bottom: n2.bottom - e2.bottom - o2.marginBottom };
          return r2;
        }, f.handleEvent = n.handleEvent, f.bindResize = function() {
          t.addEventListener("resize", this), this.isResizeBound = true;
        }, f.unbindResize = function() {
          t.removeEventListener("resize", this), this.isResizeBound = false;
        }, f.onresize = function() {
          this.resize();
        }, n.debounceMethod(r, "onresize", 100), f.resize = function() {
          this.isResizeBound && this.needsResizeLayout() && this.layout();
        }, f.needsResizeLayout = function() {
          var t2 = i(this.element), e2 = this.size && t2;
          return e2 && t2.innerWidth !== this.size.innerWidth;
        }, f.addItems = function(t2) {
          var e2 = this._itemize(t2);
          return e2.length && (this.items = this.items.concat(e2)), e2;
        }, f.appended = function(t2) {
          var e2 = this.addItems(t2);
          e2.length && (this.layoutItems(e2, true), this.reveal(e2));
        }, f.prepended = function(t2) {
          var e2 = this._itemize(t2);
          if (e2.length) {
            var i2 = this.items.slice(0);
            this.items = e2.concat(i2), this._resetLayout(), this._manageStamps(), this.layoutItems(e2, true), this.reveal(e2), this.layoutItems(i2);
          }
        }, f.reveal = function(t2) {
          if (this._emitCompleteOnItems("reveal", t2), t2 && t2.length) {
            var e2 = this.updateStagger();
            t2.forEach(function(t3, i2) {
              t3.stagger(i2 * e2), t3.reveal();
            });
          }
        }, f.hide = function(t2) {
          if (this._emitCompleteOnItems("hide", t2), t2 && t2.length) {
            var e2 = this.updateStagger();
            t2.forEach(function(t3, i2) {
              t3.stagger(i2 * e2), t3.hide();
            });
          }
        }, f.revealItemElements = function(t2) {
          var e2 = this.getItems(t2);
          this.reveal(e2);
        }, f.hideItemElements = function(t2) {
          var e2 = this.getItems(t2);
          this.hide(e2);
        }, f.getItem = function(t2) {
          for (var e2 = 0; e2 < this.items.length; e2++) {
            var i2 = this.items[e2];
            if (i2.element == t2)
              return i2;
          }
        }, f.getItems = function(t2) {
          t2 = n.makeArray(t2);
          var e2 = [];
          return t2.forEach(function(t3) {
            var i2 = this.getItem(t3);
            i2 && e2.push(i2);
          }, this), e2;
        }, f.remove = function(t2) {
          var e2 = this.getItems(t2);
          this._emitCompleteOnItems("remove", e2), e2 && e2.length && e2.forEach(function(t3) {
            t3.remove(), n.removeFrom(this.items, t3);
          }, this);
        }, f.destroy = function() {
          var t2 = this.element.style;
          t2.height = "", t2.position = "", t2.width = "", this.items.forEach(function(t3) {
            t3.destroy();
          }), this.unbindResize();
          var e2 = this.element.outlayerGUID;
          delete c[e2], delete this.element.outlayerGUID, u && u.removeData(this.element, this.constructor.namespace);
        }, r.data = function(t2) {
          t2 = n.getQueryElement(t2);
          var e2 = t2 && t2.outlayerGUID;
          return e2 && c[e2];
        }, r.create = function(t2, e2) {
          var i2 = s(r);
          return i2.defaults = n.extend({}, r.defaults), n.extend(i2.defaults, e2), i2.compatOptions = n.extend({}, r.compatOptions), i2.namespace = t2, i2.data = r.data, i2.Item = s(o), n.htmlInit(i2, t2), u && u.bridget && u.bridget(t2, i2), i2;
        };
        var m = { ms: 1, s: 1e3 };
        return r.Item = o, r;
      }), function(t, e) {
        "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size"], e) : "object" == typeof module && module.exports ? module.exports = e(require("outlayer"), require("get-size")) : t.Masonry = e(t.Outlayer, t.getSize);
      }(window, function(t, e) {
        var i = t.create("masonry");
        i.compatOptions.fitWidth = "isFitWidth";
        var n = i.prototype;
        return n._resetLayout = function() {
          this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns(), this.colYs = [];
          for (var t2 = 0; t2 < this.cols; t2++)
            this.colYs.push(0);
          this.maxY = 0, this.horizontalColIndex = 0;
        }, n.measureColumns = function() {
          if (this.getContainerWidth(), !this.columnWidth) {
            var t2 = this.items[0], i2 = t2 && t2.element;
            this.columnWidth = i2 && e(i2).outerWidth || this.containerWidth;
          }
          var n2 = this.columnWidth += this.gutter, o = this.containerWidth + this.gutter, r = o / n2, s = n2 - o % n2, a = s && 1 > s ? "round" : "floor";
          r = Math[a](r), this.cols = Math.max(r, 1);
        }, n.getContainerWidth = function() {
          var t2 = this._getOption("fitWidth"), i2 = t2 ? this.element.parentNode : this.element, n2 = e(i2);
          this.containerWidth = n2 && n2.innerWidth;
        }, n._getItemLayoutPosition = function(t2) {
          t2.getSize();
          var e2 = t2.size.outerWidth % this.columnWidth, i2 = e2 && 1 > e2 ? "round" : "ceil", n2 = Math[i2](t2.size.outerWidth / this.columnWidth);
          n2 = Math.min(n2, this.cols);
          for (var o = this.options.horizontalOrder ? "_getHorizontalColPosition" : "_getTopColPosition", r = this[o](n2, t2), s = { x: this.columnWidth * r.col, y: r.y }, a = r.y + t2.size.outerHeight, h = n2 + r.col, u = r.col; h > u; u++)
            this.colYs[u] = a;
          return s;
        }, n._getTopColPosition = function(t2) {
          var e2 = this._getTopColGroup(t2), i2 = Math.min.apply(Math, e2);
          return { col: e2.indexOf(i2), y: i2 };
        }, n._getTopColGroup = function(t2) {
          if (2 > t2)
            return this.colYs;
          for (var e2 = [], i2 = this.cols + 1 - t2, n2 = 0; i2 > n2; n2++)
            e2[n2] = this._getColGroupY(n2, t2);
          return e2;
        }, n._getColGroupY = function(t2, e2) {
          if (2 > e2)
            return this.colYs[t2];
          var i2 = this.colYs.slice(t2, t2 + e2);
          return Math.max.apply(Math, i2);
        }, n._getHorizontalColPosition = function(t2, e2) {
          var i2 = this.horizontalColIndex % this.cols, n2 = t2 > 1 && i2 + t2 > this.cols;
          i2 = n2 ? 0 : i2;
          var o = e2.size.outerWidth && e2.size.outerHeight;
          return this.horizontalColIndex = o ? i2 + t2 : this.horizontalColIndex, { col: i2, y: this._getColGroupY(i2, t2) };
        }, n._manageStamp = function(t2) {
          var i2 = e(t2), n2 = this._getElementOffset(t2), o = this._getOption("originLeft"), r = o ? n2.left : n2.right, s = r + i2.outerWidth, a = Math.floor(r / this.columnWidth);
          a = Math.max(0, a);
          var h = Math.floor(s / this.columnWidth);
          h -= s % this.columnWidth ? 0 : 1, h = Math.min(this.cols - 1, h);
          for (var u = this._getOption("originTop"), d = (u ? n2.top : n2.bottom) + i2.outerHeight, l = a; h >= l; l++)
            this.colYs[l] = Math.max(d, this.colYs[l]);
        }, n._getContainerSize = function() {
          this.maxY = Math.max.apply(Math, this.colYs);
          var t2 = { height: this.maxY };
          return this._getOption("fitWidth") && (t2.width = this._getContainerFitWidth()), t2;
        }, n._getContainerFitWidth = function() {
          for (var t2 = 0, e2 = this.cols; --e2 && 0 === this.colYs[e2]; )
            t2++;
          return (this.cols - t2) * this.columnWidth - this.gutter;
        }, n.needsResizeLayout = function() {
          var t2 = this.containerWidth;
          return this.getContainerWidth(), t2 != this.containerWidth;
        }, i;
      });
      console.log("________PT-TorrentList-Masonry 已启动!________");
      const _ORIGIN_TL_Node = GET_TORRENT_LIST_DOM_FROM_DOMAIN();
      if (!_ORIGIN_TL_Node) {
        console.log("未识别到种子列表捏~");
      } else {
        let scan_and_launch2 = function() {
          const scrollHeight = document.body.scrollHeight;
          const clientHeight = document.documentElement.clientHeight;
          const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          if (scrollTop + clientHeight >= scrollHeight - PAGE.DISTANCE) {
            if (PAGE.SWITCH_MODE != "Button")
              debounceLoad();
            if (masonry2)
              sortMasonry();
          }
        }, loadNextPage2 = function() {
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
          btnTurnPageDOM.disabled = false;
          btnTurnPageDOM.textContent = "点击加载下一页";
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
        waterfallNode.addEventListener("click", () => {
          if (masonry2) {
            sortMasonry();
            console.log("Masonry 已整理~");
          }
        });
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
            sortMasonry();
          }
          CARD.CARD_WIDTH = CARD.CARD_WIDTH == 200 ? 300 : 200;
          CHANGE_CARD_WIDTH(CARD.CARD_WIDTH, waterfallNode, masonry2);
          sortMasonry();
        });
        document.body.appendChild(reLayoutBtn);
        const btnTurnPageDOM = document.createElement("button");
        waterfallNode.insertAdjacentElement("afterend", btnTurnPageDOM);
        btnTurnPageDOM.classList.add("turnPage");
        btnTurnPageDOM.setAttribute("id", "turnPage");
        btnTurnPageDOM.innerText = "点击加载下一页";
        btnTurnPageDOM.addEventListener("click", function(event) {
          event.preventDefault();
          btnTurnPageDOM.disabled = true;
          btnTurnPageDOM.textContent = "正在加载中...";
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
            scan_and_launch2();
          } else {
            switchModeBtn.innerText = "当前加载方式: 按钮";
            PAGE.SWITCH_MODE = "Button";
            btnTurnPageDOM.style.display = "block";
          }
        });
        document.body.appendChild(switchModeBtn);
        const sortMasonryBtn = document.createElement("button");
        sortMasonryBtn.classList.add("debug");
        sortMasonryBtn.setAttribute("id", "sort_masonry");
        sortMasonryBtn.innerText = "手动整理布局";
        sortMasonryBtn.style.zIndex = 10004;
        sortMasonryBtn.addEventListener("click", function() {
          if (masonry2)
            sortMasonry();
        });
        document.body.appendChild(sortMasonryBtn);
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

  transition: height 0.3s;
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

/* 调试按键2: Masonry 切换卡片宽度 */
button#btnReLayout {
  top: 40px;
}  

/* 调试按键3: 切换下一页加载方式 */
button#btnSwitchMode {
  top: 70px;
}

/* 调试按键4: Masonry 重新排列 */
button#sort_masonry {
  top: 100px;
}

/* 卡片 */
.card {
  width: ${CARD.CARD_WIDTH}px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  background-color: ${themeColor};
  /* box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); */
  /* margin: 10px; */
  margin: 6px 0;
  
  overflow: hidden;

  cursor: pointer;

  box-shadow: rgba(0, 0, 0, 0.3) 3px 3px 0px, rgba(0, 0, 0, 0.1) -1px -1px 0px;
}
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
  flex-wrap: wrap;

  gap: 2px;
  
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
.card-description{
  padding-left: 4px;
  padding-right: 4px;
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

  background-color: rgba(0,0,0);
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
  height: 32px;
  border-radius: 16px;
  line-height: 20px;
  font-size: 14px;
}

/* 上面是我自己脚本的css */
/* --------------------------------------- */
/* 下面是改进原有的css */

/* 卡片索引 */
#nexus-preview{
  z-index: 20000;
  position: absolute;
  display: none;

  pointer-events: none;
}

/* 临时标签_热门 */
.hot{
  padding: 0 2px;
  border-radius: 8px;
  background: white;
  margin: 2px;
}
/* 临时标签_新 */
.new{
  padding: 0 2px;
  border-radius: 8px;
  background: white;
  margin: 2px;
}
`;
        const style = document.createElement("style");
        style.textContent = css2 + ADD_SITE_EXCLUSIVE_CSS();
        document.head.appendChild(style);
        masonry2 = new Masonry(waterfallNode, {
          itemSelector: ".card",
          columnWidth: ".card",
          gutter: GET_CARD_GUTTER(waterfallNode, CARD.CARD_WIDTH)
        });
        window.addEventListener("resize", function() {
          masonry2.options.gutter = GET_CARD_GUTTER(waterfallNode, CARD.CARD_WIDTH);
          sortMasonry();
        });
        sortMasonry();
        window.masonry = masonry2;
        let debounceLoad;
        window.addEventListener("scroll", function() {
          scan_and_launch2();
        });
        debounceLoad = debounce(loadNextPage2, PAGE.GAP);
      }
    }
  });
  require_main_001();

})();
