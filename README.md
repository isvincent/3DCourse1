# AIGC × 視覺設計 3D 數位學習島嶼

以提供的 `aigc_3d (1).html` 為基礎增強。保留原本九座島嶼、島嶼位置、建築、海洋、日夜光影、玻璃面板、底部導覽、18 個子單元、九個實驗室、27 題測驗、徽章及證書設計。

## 檔案架構

```text
aigc-island/
├── index.html                 # 首頁；原始 3D 場景及完整既有教材
├── enhancements.css           # 附加 RWD、閱讀與觸控調整
├── enhancements.js            # 九島任務、筆記、進度、下載與 PWA 註冊
├── learning-tasks.json        # 任務內容的可讀資料副本
├── manifest.webmanifest       # PWA 名稱、啟動路徑、圖示及色彩
├── sw.js                      # 離線快取與版本管理
├── assets/
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       └── maskable-512.png
├── .nojekyll
├── README.md
└── VALIDATION.md
```

## 新增內容

每島在原分頁後增加「任務與筆記」，包含學習目標、情境任務、操作步驟、應繳成果、三個探究問題、概念提醒與四面向評量規準，共九份任務及 27 個探究問題。課程增補以本次 HTML 中的單元主題為依據，本次未附 PDF，未宣稱已逐頁比對原教材。

評量每面向 0～2 分，滿分 8 分；須由教師或同儕依作品與證據評分。網頁闖關通過只代表目前題目作答完成，不代表作品已通過教師評量。

筆記與測驗進度使用 localStorage 儲存。重新開啟同一裝置、同一瀏覽器、同一網站可延續進度；不會同步到其他裝置，也不會傳到教師端。無痕模式、清除網站資料、儲存空間不足均可能使紀錄無法保留。「下載歷程」會匯出 JSON，包含九島答案、筆記、完成狀態、瀏覽次數與最近 500 筆操作。下載檔是備份及作業繳交用途，本版未提供匯入。

「重做本島測驗」會先確認，僅清除該島答案及徽章。教師「全島點亮」進入展示模式，不寫入個人紀錄；重新整理離開。展示模式下匯出的檔案明確標示 `teacher-demo`。

## 上傳 GitHub Pages

1. 建立 GitHub 儲存庫，例如 `aigc-island`。
2. 將本資料夾的**內容**完整放入儲存庫根目錄，確認首頁直接是 `index.html`，不要只上傳壓縮檔，也不要再多包一層資料夾。
3. 在儲存庫的 **Settings → Pages**，選擇 **Deploy from a branch**，分支選 `main`，資料夾選 `/ (root)`，儲存。
4. 等待部署完成後，開啟 Pages 顯示的 HTTPS 網址。一般專案網址形式為 `https://你的帳號.github.io/aigc-island/`，以 GitHub 顯示網址為準。
5. 完整載入後重新整理一次，再測試離線及安裝功能。請以手機實測直向、橫向、筆記輸入與底部導覽。

不需 npm、不需編譯、不需 API 金鑰。所有本機資源採相對路徑，可放在 GitHub Pages 專案子路徑。

## 本機預覽

在此資料夾執行：

```bash
python3 -m http.server 8080
```

開啟 `http://localhost:8080/`。Service Worker 僅在 HTTPS 或瀏覽器認定安全的 localhost 環境啟用；直接雙擊 `index.html` 的 `file://` 模式不支援 PWA 離線服務。

## RWD 與操作

保留原始視覺風格，依頂部工具列實際高度調整學習面板位置。手機顯示較精簡的進度資訊，底部島嶼導覽可左右捲動；學習面板可獨立捲動，分頁與按鈕提供較大的點擊範圍。短螢幕橫向隱藏品牌列以保留閱讀空間；遵循減少動態偏好停用 CSS 動畫及轉場（原有 3D 場景動畫仍會運作）。Esc 可關閉學習面板與說明／證書視窗。

## PWA 安裝與離線限制

- Android／支援的電腦瀏覽器：使用網址列或瀏覽器選單的安裝選項；是否出現及名稱依瀏覽器而定。
- iPhone／iPad：使用 Safari 分享選單的「加入主畫面」。
- `manifest.webmanifest` 包含 192、512 與 maskable 圖示，顯示模式為 standalone。
- Service Worker 安裝時快取本套件的本機檔案，外部資源則在它取得頁面控制後依實際請求快取。首次開啟需連網，載入完成後應重新整理一次再離線測試。
- 原設計依賴 Tailwind CDN、Three.js r128、OrbitControls、Font Awesome 及 Google Fonts。這些資源保留原始來源，未內附第三方副本。若 CDN 無法連線、外部資源未成功快取或快取被瀏覽器移除，離線的樣式、圖示或 3D 場景可能不完整。這是具離線快取能力的版本，**不是首次開啟即可完全斷網使用的全離線版**。
- 3D 場景初始化失敗時提供文字提示，底部單元選單仍可開啟文字課程。保留原設計依賴，未改製另一套平面主頁。
- 個人進度留在 localStorage，不受一般 Service Worker 版本更新清除快取影響。

## 維護與修改

- 既有課程：修改 `index.html` 的 `ISLANDS_DATA`；九島索引需保留一致，避免舊進度錯位。
- 學習任務：修改 `enhancements.js` 的 `taskData`，並同步修改 `learning-tasks.json`。頁面使用 JS 中內嵌副本，JSON 是方便編輯及交換的資料副本，修改 JSON 不會單獨改變畫面。
- 手機字級、間距：修改 `enhancements.css`。
- PWA 名稱與圖示：修改 manifest 與 `assets/icons/`。
- 發布新版：更新 `sw.js` 的 `CACHE` 名稱（例如 `aigc-island-v1.0.1`）。新版安裝後需關閉此網站所有分頁／已安裝視窗，再重新開啟使新 Worker 接手；若有問題可於瀏覽器開發者工具 Application → Service Workers 解除註冊後重載。
- 若要完全離線，後續需將第三方程式、編譯後 Tailwind CSS、字型、圖示及其授權檔合法內附，調整路徑並加入 CORE 快取列表；目前套件未執行這項改造。

## 驗證

已完成的程式檢查及未完成的實機驗證見 `VALIDATION.md`。本套件尚未替使用者上傳 GitHub 或發布網站。
