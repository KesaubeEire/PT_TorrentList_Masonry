// ==UserScript==
// @name         KamePT种子列表瀑布流视图
// @name:en      KamePT_waterfall_torrent
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  KamePT torrent page waterfall view
// @author       Kesa
// @match        https://kamept.com/torrents.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kamept.com
// @grant        none
// ==/UserScript==

const domain = "https://kamept.com/";
(function () {
  "use strict";

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
  const fallNode = document.createElement("div");

  // 添加class
  fallNode.classList.add("waterfall");

  // 设置样式
  fallNode.style.width = "100%";
  fallNode.style.paddingTop = "20px";
  fallNode.style.paddingBottom = "20px";
  fallNode.style.backgroundColor = "grey";
  fallNode.style.borderRadius = "20px";
  fallNode.style.height = "200px";

  // 将瀑布流节点放置在表格节点上面
  parentNode.insertBefore(fallNode, tableNode);

  // 生成按钮 -> 可以随时显示原来的表格
  const btnViewOrigin = document.getElementById("btnViewOrigin");
  // 创建一个按钮元素
  const toggleBtn = document.createElement("button");
  toggleBtn.innerText = "显示原种子表格";
  toggleBtn.style.position = "fixed";
  toggleBtn.style.top = "10px";
  toggleBtn.style.right = "10px";
  toggleBtn.style.padding = "10px";
  toggleBtn.style.backgroundColor = "#333";
  toggleBtn.style.color = "#fff";
  toggleBtn.style.border = "none";
  toggleBtn.style.borderRadius = "5px";
  toggleBtn.style.cursor = "pointer";
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

  // 2. 将种子列表信息搞下来 html -> json 对象 --------------------------------------------------------------------------------------
  // 获取表格 Dom
  const table = document.querySelector("table.torrents");

  // 获取表格中的所有行
  const rows = table.querySelectorAll("tr");
  // const rows = div.querySelectorAll('tr');

  // 种子信息 -> 存储所有行数据的数组
  const data = [];

  // 一个dom变量
  let dom01;

  // index
  let index = 0;

  // 遍历每一行并提取数据
  rows.forEach((row) => {
    // 获取种子分类
    const categoryImg = row.querySelector("td:nth-child(1) > a > img");
    const category = categoryImg ? categoryImg.alt : "";
    // 若没有分类则退出
    if (!category) return;

    // 加index
    index++;

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
    const collectLink = `javascript: bookmark(${torrentId},0);`;

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
    let tags = tagSpans
      ? Array.from(tagSpans).map((span) => span.textContent.trim())
      : [];

    // console.log(index);
    // console.log(torrentName);
    // console.log(tags);

    if (
      tags.length != 0 &&
      (tags[0].includes("天") ||
        tags[0].includes("时") ||
        tags[0].includes("分钟"))
    ) {
      // console.log(tags[0]);
      tags.shift();
    }

    // 获取描述
    const descriptionCell = row.querySelector(".torrentname td:nth-child(2)");
    dom01 = descriptionCell;
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
      category,
      torrent_name: torrentName,
      torrentLink,
      torrentId,
      picLink,
      pattMsg,
      downloadLink,
      collectLink,
      free_type: freeType,
      free_remaining_time: freeRemainingTime,
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

  // 将所有行的 JSON 对象数组打印到控制台
  // console.log(JSON.stringify(data));
  console.log(data);
})();
