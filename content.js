let isEnabled = false; // ツールの有効状態を示すフラグ（初期値は無効）

// ツールの有効/無効を処理する関数
const handleSampleTool = (isEnabled) => {
  if (isEnabled) { // ツールが有効になったときの処理
    observer.observe(document, {
      childList: true,
      attributes: true,
      subtree: true
    });
  } else { // ツールが無効になったときの処理
    observer.disconnect();
  }
};


// 最初の読み込みまたはリロード後に実行する処理
chrome.storage.local.get(['settings', 'isEnabled'], (data) => {
  isEnabled = data.isEnabled !== undefined ? data.isEnabled : isEnabled;

  handleSampleTool(isEnabled);
});

// 特定のキー（Ctrl + B）が押されたときに実行される処理（ショートカット用）
document.addEventListener('keydown', (e) => {
  if (e.key === 'b' && e.ctrlKey && !e.shiftKey && !e.altKey) {
    chrome.storage.local.get(['settings', 'isEnabled'], (data) => {
      isEnabled = !data.isEnabled;
      chrome.storage.local.set({ settings: data.settings, isEnabled: isEnabled });
      handleSampleTool(isEnabled);
    });
  }
});


// ストレージの値が変更されたときに実行される処理
chrome.storage.onChanged.addListener((changes) => {
  isEnabled = changes.isEnabled ? changes.isEnabled.newValue : isEnabled;

  handleSampleTool(isEnabled);
});

const observer = new MutationObserver(() => {
  addElement();

  const leftArrow = document.getElementById("left-arrow");
  const rightArrow = document.getElementById("right-arrow");
  const textContainer = document.getElementById("text");
  const children = textContainer ? textContainer.children : null;
  const templateBtns = document.querySelectorAll('.template-btn');
  // const chatInputText = chatInput.querySelector('[data-a-target="chat-input-text"]');

  const [textExpand, textCollapse, textRight, textLeft, text, templateGroupSets] =
    ['#text-expand', '#text-collapse', '#right-arrow', '#left-arrow', '#text', '#twitch-template-chat']
      .map(sel => document.querySelector(sel));
  if ([textExpand, textCollapse, textRight, textLeft, text, templateGroupSets].some(el => !el)) {
    return;
  }
  [textExpand, textCollapse].forEach(button => button.addEventListener('click', () => {
    const isExpand = button === textExpand;
    templateGroupSets.style.height = isExpand ? "200px" : "";
    [textRight, textLeft].forEach(el => el.style.display = isExpand ? "none" : "");
    textExpand.classList.toggle("d-none", isExpand);
    textCollapse.classList.toggle("d-none", !isExpand);
    text.classList.toggle('flex-wrap', isExpand);
    text.classList.toggle('overflow-y-scroll', isExpand);
    text.classList.toggle('text-nowrap', !isExpand);
    text.classList.toggle('overflow-x-scroll', !isExpand);
  }));

  let click = 0;
  // console.log("click", click);
  if (leftArrow && rightArrow) {
    if (!leftArrow.hasAttribute('data-listener')) {
      leftArrow.addEventListener("click", function () {
        if (children.length > 0 && click > 0) { // 範囲チェック
          click -= 1;

          let totalWidth = children[click] ? children[click].offsetWidth : 0; // 安全に幅を取得
          textContainer.scrollLeft -= totalWidth;
          // console.log("Scroll Left:", textContainer.scrollLeft, "Click Index:", click);
        }
      });
      leftArrow.setAttribute('data-listener', 'true');
    }

    if (!rightArrow.hasAttribute('data-listener')) {
      rightArrow.addEventListener("click", function () {
        if (children.length > 0 && click < children.length - 1) { // 範囲チェック
          let totalWidth = children[click] ? children[click].offsetWidth : 0; // 安全に幅を取得
          textContainer.scrollLeft += totalWidth;

          click += 1;
          // console.log("Scroll Right:", textContainer.scrollLeft, "Click Index:", click);
        }
      });
      rightArrow.setAttribute('data-listener', 'true');
    }
  }

  if (templateBtns.length > 0 && !templateBtns[0].hasAttribute('data-listener')) {
    templateBtns.forEach(function (button) {
      button.addEventListener('click', function () {
        const inputText = button.getAttribute('data-text');
        const textStyle = getComputedStyle(button);
        const chatInput = document.querySelector('[data-a-target="chat-input"]');
        const sendButton = document.querySelector('button[data-a-target="chat-send-button"]');

        if (chatInput && sendButton) {
          // 入力欄にフォーカスを設定
          chatInput.focus();
          const clipboardData = new DataTransfer();
          clipboardData.setData("text/plain", inputText);
          const pasteEvent = new ClipboardEvent("paste", {
            bubbles: true,
            clipboardData: clipboardData,
          });
          chatInput.dispatchEvent(pasteEvent);
          // 少し遅延を入れて送信ボタンをクリック
          setTimeout(() => {
            if (textStyle.color === "rgb(255, 165, 0)") {
              sendButton.click();
              console.log(`メッセージ送信: ${inputText}`);
            }
          }, 75);
        }
      });
    });
    templateBtns[0].setAttribute('data-listener', 'true');
  }
});

let offset = 0; // 初期位置の設定
// moveText関数
function moveText(direction) {
  const textDiv = document.getElementById("text");
  const firstChildWidth = textDiv.children[0].offsetWidth;
  offset += direction * firstChildWidth;
  textDiv.style.transform = `translateX(${offset}px)`;
}

function addElement() {
  const chat = document.getElementById("twitch-template-chat");
  if (chat) return;
  const parentElement = document.querySelector('div.Layout-sc-1xcs6mc-0.kILIqT.chat-input');

  if (parentElement) {
    const newDiv = document.createElement('div');
    newDiv.innerHTML = `
    <div class="d-flex justify-content-between">
      <select id="select-set-name" class="rounded-0 border-0 bg-dark text-light form-select form-select-lg w-50"
        aria-label="select example">
        
      </select>
      <div class="d-flex">
        <button id="text-expand" type="button" class="btn btn-custom  ">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-arrows-expand" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10" />
          </svg>
        </button>
        <button id="text-collapse" type="button" class="d-none btn btn-custom  ">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-arrows-collapse" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8m7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0m-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0z" />
          </svg>
        </button>
        <button type="button" class="btn btn-custom  p-0" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="報告">
          <div style="width: 2rem; height: 2rem;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" fill="currentColor"
              class="bi bi-three-dots-vertical" viewBox="0 0 16 14">
              <path
                d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  
    <div class=" mb-2 w-100 d-flex justify-content-between" id="twitch-template-chat">
      <button id="left-arrow"type="button" class="btn btn-custom  p-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          class="bi bi-caret-left-fill " viewBox="0 0 16 16">
          <path
            d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
        </svg>
      </button>
      <div id="text" class="btn-group px-2 fs-4 d-flex align-content-start justify-content-between text-nowrap overflow-x-scroll z-0"
        style="scroll-behavior: smooth;"  role="group">
  
      </div>
      <button id="right-arrow" type="button" class="btn btn-custom  p-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          class="bi bi-caret-right-fill " viewBox="0 0 16 16">
          <path
            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
        </svg>
      </button>

      <style>
        /* スクロールバー全体 */
        ::-webkit-scrollbar {
          width: 6px;
          /* 横幅 */
          height: 6px;
          /* 縦幅 */
        }
  
        /* スクロールバーの背景 */
        ::-webkit-scrollbar-track {
          border-radius: 10px;
          /* 角丸 */
        }
  
        /* スクロールバーのつまみ */
        ::-webkit-scrollbar-thumb {
          background-color: #888;
          /* つまみの色 */
          border-radius: 10px;
          /* 角丸 */
        }
  
        /* スクロールバーのつまみ（ホバー時） */
        ::-webkit-scrollbar-thumb:hover {
          background-color: #555;
          /* ホバー時の色 */
        }
  
        .btn-custom {
          color: rgba(255, 255, 255, 0.5); /* テキスト色を薄い白に */
        }
  
        .btn-custom:hover {
          color: white; /* ホバー時のテキスト色を白に */
        }
        .btn-custom:focus {
          color: white;
        }
        .bg-custom-dark{
          background-color: #29292e;
        }
    </style>
    </div>`;
    parentElement.insertBefore(newDiv, parentElement.firstChild); // 最後に追加
    // parentElement.appendChild(newDiv); // 最後に追加
  }

  const currentURL = window.location.href; // ブラウザの現在のURLを取得
  const twitchURLId = new URL(currentURL).pathname.split('/')[1];
  // console.log("twitchURLId: ", twitchURLId);

  const selectSetName = document.querySelector('#select-set-name');
  const textBtnGroup = document.querySelector('#text');
  if (!textBtnGroup || !selectSetName) return;

  chrome.storage.local.get(['isEnabled', 'templateSets'], (data) => {
    if (!data.isEnabled || !data.templateSets || typeof data.templateSets !== "object") {
      // console.log("templateSets is not a valid Object or feature is disabled.");
      return;
    }
    if (!data.isEnabled) return;

    let templatesText;
    let isTemplatesText = false;
    Object.entries(data.templateSets).forEach(([key, value], index) => {
      // console.log(`info ${index}: key = ${key}, value =`, value);
      const { twitchUserId, tabName, templates } = value;

      // <option> 要素を作成して追加
      const option = document.createElement('option');
      option.value = index;
      option.textContent = tabName;
      selectSetName.appendChild(option);

      if (twitchUserId === twitchURLId) {
        // console.log("一致しました: " + twitchUserId);
        option.setAttribute("selected", "selected");
        templatesText = templates;
        isTemplatesText = true;
      }
      if (!isTemplatesText) {
        templatesText = templates;
        isTemplatesText = true;
      }
      updateTextButtons(textBtnGroup, templatesText);
    });
    selectSetName.addEventListener("change", (event) => {
      const selectedIndex = parseInt(event.target.value);
      const selectedTemplate = Object.entries(data.templateSets)[selectedIndex]?.[1];
      if (selectedTemplate) {
        updateTextButtons(textBtnGroup, selectedTemplate.templates);
        // console.log(`選択されたテンプレート: ${selectedTemplate.tabName}`);
      }
    });
  });
}


function updateTextButtons(textBtnGroup, templates) {
  if (!templates) return;
  textBtnGroup.innerHTML = '';
  Object.values(templates).forEach((template) => {
    const { hashtagText = "", isQuick = false, templateText = "" } = template;
    const viewText = hashtagText ? `#${hashtagText}` : templateText;

    textBtnGroup.innerHTML += `
      <button 
        type="button" 
        class="btn btn-custom my-auto px-2 py-3 template-btn" 
        data-text="${templateText}" 
        style="${isQuick ? "color: orange;" : ""}">
        ${viewText}
      </button>
    `;
  });
}

