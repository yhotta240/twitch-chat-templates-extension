let isEnabled = false; // ツールの有効状態を示すフラグ（初期値は無効）

// Sampleツールの有効/無効を処理する関数
const handleSampleTool = (isEnabled) => {
  if (isEnabled) { // ツールが有効になったときの処理

  } else { // ツールが無効になったときの処理

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


// チャット欄の監視を設定する関数
function observeChatBar() {
  const chatOpen = document.querySelector('[data-a-target="right-column-chat-bar"]'); // チャットが開いているときの要素

  if (chatOpen) {
    // console.log('チャットが開いています');
    // チャットが開いたときの処理
  } else {
    // console.log('チャットが閉じています');
    // チャットが閉じたときの処理
  }

}


// MutationObserverのインスタンスを作成し、observeChatBar関数をコールバックとして渡す
const observer = new MutationObserver(() => {
  observeChatBar();
  addElement();
  // SVGのクリックイベントを設定
  const leftArrow = document.getElementById("left-arrow");
  const rightArrow = document.getElementById("right-arrow");
  const textContainer = document.getElementById("text");
  const children = textContainer ? textContainer.children : null;
  const templateBtns = document.querySelectorAll('.template-btn');

  // const chatInputText = chatInput.querySelector('[data-a-target="chat-input-text"]');

  let click = 0;
  // console.log("click", click);
  if (leftArrow && rightArrow) {
    // イベントリスナーがすでに設定されているかどうかを確認
    if (!leftArrow.hasAttribute('data-listener')) {
      leftArrow.addEventListener("click", function () {
        if (click > 0 && click <= children.length) {
          click -= 1;
        }
        console.log("click", click)
        let totalWidth = 0;
        // console.log("left-arrow", children)
        // console.log("left-arrow", children[click])
        totalWidth += (children[click].offsetWidth)*2;  // 子要素の幅を加算
        // console.log("left-arrow", children[i].innerHTML)

        textContainer.scrollLeft -= totalWidth;
        console.log(textContainer.scrollLeft)
      });
      leftArrow.setAttribute('data-listener', 'true');
    }

    if (!rightArrow.hasAttribute('data-listener')) {
      rightArrow.addEventListener("click", function () {
        // 最初の子要素の幅を取得
        let totalWidth = 0;
        // console.log("right-arrow", children)
        // console.log("right-arrow", children[click])
        totalWidth += (children[click].offsetWidth)*2;  // 子要素の幅を加算
        // console.log("right-arrow", children[i].innerHTML)

        textContainer.scrollLeft += totalWidth;  // 各要素の幅に基づいてスクロール
        if (click >= 0 && click < children.length) {
          click += 1;
        }
        console.log("click", click)
      });
      rightArrow.setAttribute('data-listener', 'true');
    }
  }
  if (templateBtns.length > 0 && !templateBtns[0].hasAttribute('data-listener')) {
    templateBtns.forEach(function (button) {
      button.addEventListener('click', function () {
        const inputText = button.getAttribute('data-text');
        const chatInput = document.querySelector('[data-a-target="chat-input"]');
        console.log("text", inputText);
        if (chatInput) {
          // フォーカスを設定
          chatInput.focus();
          // 入力イベントをトリガー
          const inputEvent = new InputEvent("input", { bubbles: true });
          chatInput.dispatchEvent(inputEvent);
          // 貼り付け
          const clipboardData = new DataTransfer();
          clipboardData.setData("text/plain", inputText);
          const pasteEvent = new ClipboardEvent("paste", {
            bubbles: true,
            clipboardData: clipboardData,
          });
          chatInput.dispatchEvent(pasteEvent);
        }
      });
    });
    templateBtns[0].setAttribute('data-listener', 'true');
  }
});

observer.observe(document, {
  childList: true,
  attributes: true,
  subtree: true
});

// // 初期化
window.addEventListener('load', () => {
  observeChatBar();
  addElement();
});



let offset = 0; // 初期位置の設定

// moveText関数
function moveText(direction) {
  const textDiv = document.getElementById("text");
  const firstChildWidth = textDiv.children[0].offsetWidth;
  offset += direction * firstChildWidth;
  textDiv.style.transform = `translateX(${offset}px)`;
}

// // ボタンがクリックされたときにテキストをチャット入力エリアに挿入
// 入力欄にテキストを追加する関数


function addElement() {
  const chat = document.getElementById("twitch-template-chat");
  if (chat) return;
  // 親要素を取得
  const parentElement = document.querySelector('div.Layout-sc-1xcs6mc-0.kILIqT.chat-input');
  // 新しいdiv要素を作成
  const newDiv = document.createElement('div');

  newDiv.innerHTML = `
  <div class=" mb-2 w-100 d-flex justify-content-between" id="twitch-template-chat">
    <button id="left-arrow"type="button" class="btn btn-custom  p-0">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
        class="bi bi-caret-left-fill m-1 mx-2" viewBox="0 0 16 16">
        <path
          d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
      </svg>
    </button>
    <div id="text" class="btn-group  fs-4 d-flex justify-content-between text-nowrap overflow-x-scroll z-0"
      style="scroll-behavior: smooth;"  role="group">
      <button type="button" class="btn btn-custom my-auto px-2 py-3  template-btn" data-text="おはようございます！">おは</button>
      <button type="button" class="btn btn-custom my-auto px-2 py-3  template-btn" data-text="こんにちは">こんにちは</button>
      <button type="button" class="btn btn-custom my-auto px-2 py-3  template-btn" data-text="よろしく">よろしく</button>
      <button type="button" class="btn btn-custom my-auto px-2 py-3  template-btn" data-text="よろしくお願いいたします。">よろしくお願いいたします。</button>
      <button type="button" class="btn btn-custom my-auto px-2 py-3  template-btn" data-text="すげえええええ">すげえええええ</button>
      <button type="button" class="btn btn-custom my-auto px-2 py-3  template-btn" data-text="まじか">まじか</button>
      <button type="button" class="btn btn-custom my-auto px-2 py-3  template-btn" data-text="く、くる">く、くる</button>
      <button type="button" class="btn btn-custom my-auto px-2 py-3  template-btn" data-text="きたああああああ">きたああああああ</button>
      <button type="button" class="btn btn-custom my-auto px-2 py-3  template-btn" data-text="きたああああああ">きたああああああ</button>
      <button type="button" class="btn btn-custom my-auto px-2 py-3  template-btn" data-text="あああああああああああああああ">あああああああああああああああ</button>
      <button type="button" class="btn btn-custom my-auto px-2 py-3  template-btn" data-text="すごいな">すごいな</button>
      <button type="button" class="btn btn-custom my-auto px-2 py-3  template-btn" data-text="すごすぎ">すごすぎ</button>
      <button type="button" class="btn btn-custom my-auto px-2 py-3  template-btn" data-text="お疲れ様でしたー">お疲れ様でしたー</button>
      <button type="button" class="btn btn-custom my-auto px-2 py-3  template-btn" data-text="きたああああああ">きたああああああ</button>
    </div>
    <button id="right-arrow" type="button" class="btn btn-custom  p-0">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
        class="bi bi-caret-right-fill m-1 mx-2" viewBox="0 0 16 16">
        <path
          d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
      </svg>
    </button>
    <button type="button" class="btn btn-custom  p-0">
      <div style="width: 2rem; height: 2rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" fill="currentColor"
          class="bi bi-three-dots-vertical" viewBox="0 0 16 14">
          <path
            d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
        </svg>
      </div>
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
  </style>
  </div>`;

  console.log("parentElement", parentElement);
  // 親要素に新しいdivを追加
  if (parentElement) {
    console.log("ok")
    parentElement.insertBefore(newDiv, parentElement.firstChild); // 最後に追加
    // parentElement.appendChild(newDiv); // 最後に追加
  }

}




