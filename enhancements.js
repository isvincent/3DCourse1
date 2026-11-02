/* Additive enhancements. Existing renderer and course data remain in index.html. */
'use strict';
const STORAGE_KEY='aigc-island-learning-v1';
let notes={}, visits={}, history=[], demoMode=false, installPrompt=null, storageOK=true;
const taskData=[
  {
    "goal": "辨識 AIGC 的角色並提出可執行的使用規範",
    "scenario": "校園活動需要宣傳圖，哪些工作適合交給 AI？",
    "steps": "建立一份含目的、對象、風格、限制及格式的提示詞，再比較兩次輸出。",
    "deliverable": "提示詞初版與修正版、三項風險檢核",
    "questions": "AI 生成的敘述可以直接當作事實嗎？|若圖片含可辨識人物，應如何處理授權與隱私？|你如何證明自己的判斷改變了作品？",
    "tip": "保留來源、查核與修改紀錄；不輸入同學的個人資料。"
  },
  {
    "goal": "用品牌定位檢驗 Logo 的辨識性與延展性",
    "scenario": "為校內閱讀社設計一個能印在借書袋上的識別。",
    "steps": "寫下三個品牌關鍵字，畫三款草圖，再測試黑白及縮小版本。",
    "deliverable": "品牌定位表、三款草圖、黑白與縮小測試",
    "questions": "漂亮是否等於符合品牌？|縮成小圖後哪些細節會消失？|與既有標誌太相似時應如何修正？",
    "tip": "Logo 應測試單色與小尺寸；AI 草圖仍需人為整理。"
  },
  {
    "goal": "理解影像整理與向量化流程的限制",
    "scenario": "把校園植物照片轉成活動圖示。",
    "steps": "依序記錄去背、調色、簡化及向量化的目的，逐步比較效果。",
    "deliverable": "四階段對照圖與選擇理由",
    "questions": "哪些細節值得保留？|向量化是否保證畫質變好？|照片來源是否允許再製？",
    "tip": "向量化適合輪廓與圖形，不會自動補回原始影像細節。"
  },
  {
    "goal": "依資料關係選擇圖表並建立閱讀層級",
    "scenario": "讓同學快速理解班級減塑調查。",
    "steps": "整理匿名資料，依比較、趨勢或占比選圖，再標示單位與來源。",
    "deliverable": "一張資訊圖表、原始資料表及圖表選擇理由",
    "questions": "長條圖與折線圖各適合什麼問題？|截斷座標會造成何種印象？|圖中結論是否超過資料能支持的範圍？",
    "tip": "不要捏造數據；占比需確認分母、總和與調查期間。"
  },
  {
    "goal": "檢查 AI 圖卡的事實、字體與視覺一致性",
    "scenario": "為圖書館做一張能公開展示的閱讀倡議圖卡。",
    "steps": "先製作文字稿與來源表，再檢查圖示、對比、錯字和版面。",
    "deliverable": "完稿圖卡、查核表及修正前後比較",
    "questions": "AI 產生的引用是否真的存在？|灰階檢查能發現什麼問題？|小字與背景的對比足夠嗎？",
    "tip": "AI 圖中文字可能錯誤，重要文字應以可編輯文字重新排版。"
  },
  {
    "goal": "利用構圖、留白及焦點引導視線",
    "scenario": "為校園講座設計能遠距閱讀的海報。",
    "steps": "排序標題、時間地點與行動資訊，製作兩種構圖並邀同學閱讀測試。",
    "deliverable": "兩版海報與五秒閱讀測試紀錄",
    "questions": "第一眼看見的內容符合目的嗎？|裝飾是否干擾活動資訊？|五秒內能找到時間與地點嗎？",
    "tip": "Z 型或 F 型是觀察工具，需依實際內容與閱讀方向調整。"
  },
  {
    "goal": "以字體與配色建立一致且易讀的視覺語氣",
    "scenario": "同一場活動分別向學生和家長宣傳。",
    "steps": "以相同文字製作兩種字體與配色版本，說明選擇並測試閱讀性。",
    "deliverable": "兩版設計、色票及字體使用規則",
    "questions": "顏色的感受會因文化與情境不同嗎？|字體有合法使用授權嗎？|不靠顏色還能分辨資訊嗎？",
    "tip": "60／30／10 是配色參考，色彩心理不可當成所有人通用的定律。"
  },
  {
    "goal": "依平台比例延展設計並維持資訊完整",
    "scenario": "將同一則活動訊息製成貼文、限時動態及橫幅。",
    "steps": "保留主視覺、字體與色票，分別重排 1:1、9:16、16:9 三種尺寸。",
    "deliverable": "三尺寸成品及裁切安全檢核表",
    "questions": "直接裁切可能失去什麼？|擴圖後新增內容是否合理？|平台介面遮住文字時如何調整？",
    "tip": "比例不等於像素尺寸；安全區依實際發布介面檢查。"
  },
  {
    "goal": "整合設計流程並清楚揭露人機協作",
    "scenario": "策劃一組校園公共議題的視覺倡議展。",
    "steps": "定義問題、蒐集來源、完成跨尺寸設計，再以同儕回饋修正並公開協作紀錄。",
    "deliverable": "策展說明、三件作品、來源與 AI 使用揭露、反思",
    "questions": "作品是否回應真實受眾？|哪些改進來自資料或回饋？|你能指出 AI 與自己各自的貢獻嗎？",
    "tip": "評量同時看設計成果與歷程，不以生成數量取代學習證據。"
  }
];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function statusMessage(message){document.getElementById('app-status').textContent=message;}
function persistLearning(){
 if(demoMode)return;
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,masteredIslands,quizAnswers,notes,visits,history:history.slice(-500),updatedAt:new Date().toISOString()}));}
 catch(e){storageOK=false;statusMessage('無法儲存於此瀏覽器，請下載歷程備份。');}
}
function restoreLearning(){try{
 const d=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(!d||d.version!==1)return;
 quizAnswers={};for(const [key,val] of Object.entries(d.quizAnswers||{})){const [i,q]=key.split('_').map(Number);if(ISLANDS_DATA[i]?.quiz[q]&&Number.isInteger(val)&&val>=0&&val<ISLANDS_DATA[i].quiz[q].options.length)quizAnswers[key]=val;}
 masteredIslands=ISLANDS_DATA.map((island,i)=>island.quiz.every((q,j)=>quizAnswers[`${i}_${j}`]===q.ans));
 notes=d.notes&&typeof d.notes==='object'?d.notes:{};visits=d.visits&&typeof d.visits==='object'?d.visits:{};history=Array.isArray(d.history)?d.history.slice(-500):[];
}catch(e){statusMessage('歷程無法讀取；可繼續使用並下載新的紀錄。');}}
function saveNote(value){notes[currentIslandIndex]=value;persistLearning();}
function renderTask(i){const t=taskData[i];return `<section class="task-card"><h3>🎯 學習任務與反思</h3><p>建議：閱讀 10 分鐘 → 實驗室 10 分鐘 → 任務 15 分鐘 → 測驗與反思 5 分鐘，可依課程調整。</p><h4>學習目標</h4><p>${esc(t.goal)}</p><h4>任務情境</h4><p>${esc(t.scenario)}</p><h4>操作步驟</h4><p>${esc(t.steps)}</p><h4>繳交成果</h4><p>${esc(t.deliverable)}</p><h4>探究問題</h4><ol>${t.questions.split('|').map(q=>`<li>${esc(q)}</li>`).join('')}</ol><h4>概念提醒</h4><p>${esc(t.tip)}</p><h4>評量規準（每項 0～2 分，滿分 8 分）</h4><table><thead><tr><th>面向</th><th>2 分達標條件</th></tr></thead><tbody><tr><td>目標與受眾</td><td>設計選擇能回應任務及受眾</td></tr><tr><td>資訊與來源</td><td>內容正確、來源可追溯</td></tr><tr><td>視覺與閱讀</td><td>資訊層級清楚，尺寸與對比可讀</td></tr><tr><td>修正與揭露</td><td>呈現修改理由及 AI 參與範圍</td></tr></tbody></table><p>1 分：部分達成但證據不足；0 分：尚未呈現。由教師或同儕依作品評分，本頁不自動判定。</p><h4>我的學習筆記</h4><label for="reflection-note">記錄作品構想、來源、測試結果與下次修改方向（自動儲存於本機）</label><textarea id="reflection-note" oninput="saveNote(this.value)">${esc(notes[i]||'')}</textarea><button onclick="downloadHistory()">下載學習歷程 JSON</button></section>`;}
const originalRender=renderLearningPanel;
renderLearningPanel=function(){
 originalRender();const tabs=document.getElementById('panel-tabs');
 const tab=document.createElement('button');tab.textContent='📝 任務與筆記';tab.className='px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap '+(currentTabMode==='task'?'bg-cyan-600 text-white':'bg-white/5 text-slate-300');tab.onclick=()=>switchTab('task');tabs.append(tab);
 const body=document.getElementById('panel-body');if(currentTabMode==='task')body.innerHTML=renderTask(currentIslandIndex);
 const toolbar=document.createElement('div');toolbar.id='study-tools';
 [['下載歷程',downloadHistory],['重做本島測驗',retryQuiz],['安裝與離線說明',showInstallHelp]].forEach(([label,fn])=>{const b=document.createElement('button');b.textContent=label;b.onclick=fn;toolbar.append(b);});body.prepend(toolbar);
};
const originalFocus=focusIsland;
focusIsland=function(i,tab='sub0'){if(!ISLANDS_DATA[i])return;originalFocus(i,tab);visits[i]=(Number(visits[i])||0)+1;history.push({event:'visit',island:i+1,at:new Date().toISOString()});persistLearning();document.getElementById('panel-body').scrollTop=0;};
const originalSelect=selectQuizOption;
selectQuizOption=function(i,q,a){originalSelect(i,q,a);history.push({event:'answer',island:i+1,question:q+1,option:a+1,correct:a===ISLANDS_DATA[i].quiz[q].ans,at:new Date().toISOString()});persistLearning();};
function retryQuiz(){if(demoMode){alert('展示模式請重新整理以回到個人進度。');return;}if(!confirm('清除本島答案與徽章？其他島嶼及筆記會保留。'))return;const i=currentIslandIndex;ISLANDS_DATA[i].quiz.forEach((_,q)=>delete quizAnswers[`${i}_${q}`]);masteredIslands[i]=false;if(islandBeacons[i])islandBeacons[i].material.opacity=0;const label=document.getElementById(`label-status-${i}`);if(label){label.className='text-[10px] text-slate-300';label.textContent='📍 點擊探索';}document.getElementById('cert-btn').classList.add('hidden');updateProgressUI();persistLearning();switchTab('quiz');}
const originalDemo=unlockAllIslandsDemo;
unlockAllIslandsDemo=function(){if(!confirm('進入教師展示模式？展示成果不會寫入個人紀錄；重新整理即可離開。'))return;demoMode=true;statusMessage('教師展示模式：不儲存成果，重新整理即可離開。');originalDemo();};
function downloadHistory(){const data={course:'AIGC × 視覺設計',exportedAt:new Date().toISOString(),mode:demoMode?'teacher-demo':'personal',storageAvailable:storageOK,islands:ISLANDS_DATA.map((x,i)=>({unit:i+1,name:x.name,mastered:masteredIslands[i],visits:visits[i]||0,note:notes[i]||'',answers:x.quiz.map((q,j)=>({question:q.q,selected:quizAnswers[`${i}_${j}`]===undefined?null:q.options[quizAnswers[`${i}_${j}`]],correct:quizAnswers[`${i}_${j}`]===q.ans}))})),events:history.slice(-500)};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='AIGC-learning-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function showInstallHelp(){if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;return;}alert('請先以 HTTPS 開啟 GitHub Pages 網址。\nAndroid／電腦：瀏覽器選單中選「安裝應用程式」（是否顯示依瀏覽器而定）。\niPhone／iPad：Safari → 分享 → 加入主畫面。\n首次需連網載入外部 3D、樣式及字型；離線前請先開啟各項功能。外部資源若未快取，離線顯示可能不完整。');}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;});
const statusEl=document.createElement('div');statusEl.id='app-status';statusEl.setAttribute('role','status');statusEl.textContent='進度自動儲存於本機 · 可下載歷程';document.body.append(statusEl);
restoreLearning();updateProgressUI();
const previousLoad=window.onload;
window.onload=function(e){previousLoad?.call(window,e);masteredIslands.forEach((done,i)=>{if(done){if(islandBeacons[i])islandBeacons[i].material.opacity=.45;const l=document.getElementById(`label-status-${i}`);if(l)l.textContent='✅ 已完成';}});};
function syncLayout(){const header=document.querySelector('header').getBoundingClientRect();const nav=document.querySelector('nav').getBoundingClientRect();document.documentElement.style.setProperty('--header-bottom',Math.ceil(header.bottom+8)+'px');document.documentElement.style.setProperty('--dock-height',Math.ceil(innerHeight-nav.top+8)+'px');}
new ResizeObserver(syncLayout).observe(document.querySelector('header'));window.addEventListener('resize',syncLayout);syncLayout();
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeLearningPanel();document.getElementById('help-modal').classList.add('hidden');closeCertificateModal();}});
document.querySelectorAll('button[title]').forEach(b=>b.setAttribute('aria-label',b.title));
window.addEventListener('offline',()=>statusMessage('目前離線：使用已快取內容；學習紀錄仍儲存於本機。'));
window.addEventListener('online',()=>statusMessage(demoMode?'教師展示模式：不儲存成果':'已連線 · 進度自動儲存於本機'));
if('serviceWorker' in navigator && ['https:','http:'].includes(location.protocol)){navigator.serviceWorker.register('./sw.js').catch(()=>statusMessage('離線服務未啟用；目前可使用線上功能。'));}
