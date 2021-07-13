# NTCU Elearning Auto Download Blocker

**請注意！此擴充功能仍在測試階段，請自行評估後再下載使用**

## 研究動機

在經過長期使用學校的教學系統後，發現在下載資料夾內的檔案逐漸變多。  
而在我研究背後的程式碼後，了解到這套教學系統會在使用者每一次點選「開始上課」後自動地開啟最後一次開啟的教學資源。  
在表面上，似乎是一個貼心的設計，但在長期使用下，電腦中被無意下載的檔案越來越多…

## 此擴充功能的原理

簡單而言：封鎖在載入時觸發的資源開啟，讓使用者自行選擇教學資源下載。  

首先，我對整體的載入及下載過程進行分析，並發現相關的程式碼都在 manifest.js 內。  
在資源載入後，會去取得上一次離開的節點，並自動地進入該節點。  
進入節點的方式是由 launchActivity 這個 function 利用 `<form></form>` 把節點資料放進去並呼叫submit()送出。

到這裡，我想到的修改方式有 3 種：

1. 使用 [chrome.downloads](https://developer.chrome.com/docs/extensions/reference/downloads/) 這個 API  
   理論上，只要在偵測到 [onCreated](https://developer.chrome.com/docs/extensions/reference/downloads/#event-onCreated) 這個 event 後要求暫停或是停止下載即可。  
   但在實際測試上發現，即便在偵測到 [onCreated](https://developer.chrome.com/docs/extensions/reference/downloads/#event-onCreated) 後立刻呼叫 [pause](https://developer.chrome.com/docs/extensions/reference/downloads/#method-pause) 或是 [cancel](https://developer.chrome.com/docs/extensions/reference/downloads/#method-cancel)  
   檔案還是有可能因為很小，再呼叫前就被下載完了，這種方法不可行。  

2. 複寫 manifest.js  
   這種方式最為簡單，只要移除掉自動進入節點的程式碼即可。  
   但這種方式也最危險，只要 Elearning 的開發者在未來有修改到 manifest.js 這個檔案，可能就會因為程式碼不一致而發生問題。  

3. 修改 `<form></form>`  
   這個擴充功能是利用這種方式開發。  

   HackCode.js 部分：  
   > 將 id 為 fetchResourceForm 的 `<form></form>` 的 action 做修改，阻擋在載入過程呼叫的submit()  
   > 並持續性地檢查 className 為 link_fnt01 的 node 數量  
   > 在其數量不等於 0 時（submit() 呼叫後）復原 action 的值  

   之後，利用 ContentScript.js （詳細資訊請參考 [Content scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)）  
   在每一次 pathtree.php 載入後加上 HackCode.js 這個 script ，達到封鎖自動載入的教學資源，並讓使用者能夠自行選擇。  

## 安裝方式

因為 Google 要求需成為 Developer 身分，支付 5 美元的費用，才能將擴充功能上架。  
因此，若要使用此擴充功能，必須手動安裝  
1. 首先，點擊 [這裡](https://github.com/a962702/NTCU-Elearning-Auto-Download-Blocker/archive/refs/heads/master.zip) 下載最新版的擴充功能。  
2. 將下載回來的擴充功能解壓縮到獨立的資料夾內（請不要任意刪除該資料夾）  
3. 開啟 Chrome ，點擊右上方的功能表，依序選擇 更多工具 - 擴充功能  
4. 開啟右上方的 開發人員模式  
5. 此時，左上方會多出 3 個選項，選擇最左邊的 載入未封裝項目  
6. 選擇在第2步產生，放有此擴充功能檔案的資料夾  
