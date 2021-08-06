# 翻牌遊戲 ｜memorizing-card-game
> 微型專案設計

## 成品與資源連結
- Pages
  - [首頁index](https://penuts27.github.io/pocker/)

## 使用前端工具

`node npm - gulp`  `  
`javascript` 
`JavaScript Standard Style`

## 程式說明

定義狀態 (state)讓Controller統一管理  
`FirstCardAwaits`  

`SecondCardAwaits`  

`CardsMatched: 'CardsMatched`  

`GameFinished: 'GameFinished`  

搭配 MVC 架構實現程式碼模組化的管理，刻意練習`關注點分離``低耦合、可抽換`，來封裝M（資料）、 V（畫面）、 C（流程）

## 遊戲規則

遊戲規則說明如下：  
一副撲克牌共有 52 張牌，分別為黑桃、紅心、方塊、梅花 4 種花色，每種花色有 13 張牌，分別為 1～13 點。  

遊戲開始時，牌桌上覆蓋 52 張牌，玩家需要翻開牌面才能得知點數。  
玩家一次只能翻開兩張牌，若兩張牌點數一樣，則為配對成功，配對成功的牌可以保留翻開的狀態；若配對失敗，則卡片會重新覆蓋，玩家要趁機記住卡片的號碼，尋求下一次配對成功的機會。  
玩家的任務是將 52 張牌／26 組對子全部翻開。每成功配對一次可以得到 10 分，累積 260 分即達成任務。

## 指令列表

- `gulp` - 執行開發模式(會開啟模擬瀏覽器並監聽相關檔案)
  - 若沒有自動開啟瀏覽器則可手動在瀏覽器上輸入 `http://localhost:8080/` 即可。
  - 假使監聽功能無效的話，可以檢查一下是否修改到資料夾的名稱等。
- `gulp build` - 執行編譯模式(不會開啟瀏覽器)
- `gulp clean` - 清除 dist 資料夾
- `gulp deploy` - 將 dist 資料夾部署至 GitHub Pages
  - 若無法部署到 GitHub Pages 的話，可以確定一下是否已經初始化專案等。

> 請務必確保已經在本機上輸入過 `npm install -g gulp`，否則電腦會不認識 `gulp` 指令哦。

## 資料夾結構

- App # 原始碼
  - assets # 靜態資源放置處
    - images # 圖片放置處
    - js # JavaScript 放置處
    - style # 樣式放置處
  - index.html # 首頁 HTML
  - layout.ejs # Layout ejs
- gulpfile.js # Gulp 原始碼
  - envOptions.js # Gulp 路徑變數
  - index.js # Gulp 核心原始碼

