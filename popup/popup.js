// 初期化処理
let isEnabled = false; // ツールの有効状態を示すフラグ（初期値はfalse）
const enabledElement = document.getElementById('enabled'); // チェックボックス（トグルボタン）要素を取得
const panelButton = document.getElementById('panelButton');
const messagePanel = document.getElementById('messagePanel');
const messageDiv = document.getElementById('message'); // メッセージ表示用のdiv要素を取得


// チェックボックス（トグルボタン）の状態が変更されたとき，ツールの有効/無効状態を更新
enabledElement.addEventListener('change', (event) => {
  isEnabled = event.target.checked; // チェックボックス（トグルボタン）の選択状態を取得

  // 現在の有効/無効状態をストレージに保存
  chrome.storage.local.set({ isEnabled: isEnabled }, () => {
    // 有効/無効状態に応じてメッセージを出力
    messageOutput(dateTime(), isEnabled ? 'Sampleは有効になっています' : 'Sampleは無効になっています');
  });
});


// 保存された設定（'settings'と'isEnabled'）を読み込む
chrome.storage.local.get(['settings', 'isEnabled'], (data) => {
  if (enabledElement) {
    isEnabled = data.isEnabled || false; // 'isEnabled'が未設定の場合はデフォルトでfalseを使用
    enabledElement.checked = isEnabled; // チェックボックス（トグルボタン）の状態を'isEnabled'の値に設定
  }
  // 有効/無効状態に応じてメッセージを出力
  messageOutput(dateTime(), isEnabled ? 'Sampleは有効になっています' : 'Sampleは無効になっています');
});


const addSetBtn = document.getElementById("add-set-btn");
const deleteSetBtn = document.getElementById("delete-set-btn");
const deleteSet = document.getElementById("set-delete");
const saveSetBtn = document.getElementById("save-set-btn");

let preTabItem;
//追加
addSetBtn.addEventListener('click', () => {
  const inputNameForm = document.getElementById("add-set-name");
  if (inputNameForm) {
    return;
  }
  const tabItem = document.getElementById("tabItem");
  // 入力完了時（Enterキー or フォーカスが外れたとき）の処理
  function handleInputFinish(input) {
    const value = input.value.trim(); // 入力値を取得してトリム
    if (value) {
      tabItem.innerHTML = preTabItem
        + `<li class="nav-item" role="presentation">
          <button type="button" class="nav-link rounded-0 p-2" id=" v-pills-${value}-tab" data-bs-toggle="pill"
            data-bs-target="#v-pills-${value}" role="tab" aria-controls="v-pills-${value}"
            aria-selected="false">${value}
          </button>
        </li>`;
    }
    const activeTab = document.querySelector('#tabItem .nav-link.active');
    if (activeTab) {//アクティブなタブ削除
      activeTab.classList.remove('active');
    }
    const focusTabs = document.querySelectorAll('#tabItem .nav-link');
    if (focusTabs.length) {
      focusTabs[focusTabs.length - 1].classList.add('active');
    }
  }
  preTabItem = tabItem.innerHTML;
  tabItem.innerHTML += `<li class="nav-item" role="presentation">
      <button type="button" class="w-75 nav-link rounded-0 p-2" id=" v-pills-input-tab"
        data-bs-toggle="pill" data-bs-target="#v-pills-input" role="tab" aria-controls="v-pills-input"
        aria-selected="false">
        <input type="text" class=" form-control p-0 ps-1 rounded-0" placeholder="名前を入力" aria-label="twitch"
          aria-describedby="basic-addon1" id="add-set-name">
      </button>
    </li>`;
  const activeTab = document.querySelector('#tabItem .nav-link.active');
  if (activeTab) {//アクティブなタブ削除
    activeTab.classList.remove('active');
    const deleteId = activeTab.getAttribute('data-bs-target');
    if (deleteId) {
      const deleteContent = document.getElementById(deleteId.slice(1));
      //アクティブなコンテンツ削除
      deleteContent.classList.remove('show', 'active');
    }
  }
  const focusTabs = document.querySelectorAll('#tabItem .nav-link');
  focusTabs[focusTabs.length - 1].classList.add("active");

  const inputName = document.getElementById("add-set-name");
  console.log("inputName", inputName);
  inputName.focus();
  if (inputName) {
    // inputName.addEventListener("blur", () => handleInputFinish(inputName));
    inputName.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleInputFinish(inputName);
        // inputName.blur(); // フォーカスを外す
      }
    });
  }

});

deleteSetBtn.addEventListener('click', () => {
  const activeTab = document.querySelector('#tabItem .nav-link.active');
  if (activeTab) {
    console.log('Active Tab Text:', activeTab.textContent.trim());
    const setName = document.getElementById("set-name");
    if (setName) {
      setName.textContent = activeTab.textContent.trim();
    }
  }
});

//セット削除
deleteSet.addEventListener('click', () => {
  const activeTab = document.querySelector('#tabItem .nav-link.active');
  if (activeTab) {//アクティブなタブ削除
    activeTab.parentElement.remove();
    const deleteId = activeTab.getAttribute('data-bs-target').slice(1);
    const deleteContent = document.getElementById(deleteId);
    if (deleteContent) {
      //アクティブなコンテンツ削除
      deleteContent.classList.remove('show', 'active');
    }
  }

  //アクティブ化
  const remainingTabs = document.querySelectorAll('#tabItem .nav-link');
  if (remainingTabs.length > 0) {
    remainingTabs[0].classList.add('active');//最初のタブをアクティブ化
    const targetContentId = remainingTabs[0].getAttribute('data-bs-target');
    const targetContent = document.getElementById(targetContentId.slice(1));
    if (targetContent) {
      //最初のコンテンツをアクティブ化
      targetContent.classList.add('show', 'active');
    }
  }
});

saveSetBtn.addEventListener('click', () => {
  console.log("");
});


// DOMの読み込み完了を監視し，完了後に実行
document.addEventListener('DOMContentLoaded', function () {
  // manifest.jsonから拡張機能の情報を取得
  const manifestData = chrome.runtime.getManifest();
  document.getElementById('name').textContent = `${manifestData.name}`;

  // ツールチップ（ハッシュタグをONにする）
  const tooltipHashtag = document.querySelectorAll('[data-bs-toggle="tooltipHashtag"]');
  tooltipHashtag.forEach(function (e) {
    new bootstrap.Tooltip(e);
  });
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltipQuick"]');
  tooltipTriggerList.forEach(function (e) {
    new bootstrap.Tooltip(e);
  });

  const addTemplateBtn = document.getElementById("add-template-btn");
  addTemplateBtn.addEventListener("click", () => {
    const templateForms = document.getElementById("template-forms");
    // const filteredChildren = Array.from(templateForms.children).filter(child => child.tagName !== 'HR');
    const filteredChildren = templateForms.children;
    const newTemplateHTML = `
    <div id="template-form-${filteredChildren.length}">
      <div class="mx-2 p-1 template-select" tabindex="0" id="focusableDiv">
        <div class="d-flex justify-content-between mb-1">
          <!-- ハッシュタグ -->
          <div class="collapse w-100" id="hashtag-${filteredChildren.length}">
            <div class="input-group rounded-top ">
              <span class="input-group-text py-0 px-1 rounded-0" id="basic-addon1">#</span>
              <input type="text" class="form-control p-0 ps-1 rounded-0" placeholder="ハッシュタグ"
                aria-label="ハッシュタグ" aria-describedby="basic-addon1">
            </div>
          </div>
          <div class="d-flex justify-content-end w-100 mb-1">
            <!-- ハッシュタグ表示 -->
            <div>
              <input class="form-check-input check-hash" type="checkbox" id="hashCheckbox" value="option1"
                data-bs-toggle="collapse" data-bs-target="#hashtag-${filteredChildren.length}" aria-expanded="false"
                aria-controls="hashtag-${filteredChildren.length}">
              <label class="form-check-label" for="hashCheckbox"></label>
            </div>
            <!-- クイック送信 -->
            <div>
              <input class="form-check-input check-quick ms-2" type="checkbox" id="quickCheckbox"
                value="option">
              <label class="form-check-label" for="hashCheckbox"></label>
            </div>
            <!-- クリアボタン -->
            <button class="clearBtn btn-customs btn btn-sm d-flex align-items-center py-0 px-1"
              data-target="textarea-${filteredChildren.length}">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"
                class="bi bi-x-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path
                  d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
              </svg>
              <div class="ps-1">クリア</div>
            </button>
            <button data-target="template-form-${filteredChildren.length}"
              class="delete-template-btn btn-customs btn btn-sm d-flex align-items-center py-0 px-1"
              type="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"
                class="bi bi-trash3" viewBox="0 0 16 16">
                <path
                  d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
              </svg>
              <div class="ps-1">削除</div>
            </button>
          </div>
        </div>
        <div class="">
          <textarea class="form-control p-1 rounded-0 " placeholder="定型文${filteredChildren.length + 1}" aria-label="定型文${filteredChildren.length + 1}" id="textarea-${filteredChildren.length}"
            rows="1"></textarea>
        </div>
      </div>
      <hr class="m-2">
    </div>
    `;
    templateForms.insertAdjacentHTML("afterbegin", newTemplateHTML);
  });




  // ボタンにイベントリスナーを設定
  function initButtonHandlers() {
    // 全体にイベント委譲
    document.addEventListener("click", (event) => {
      // 削除ボタンがクリックされた場合
      if (event.target.closest(".delete-template-btn")) {
        const button = event.target.closest(".delete-template-btn");
        const targetId = button.getAttribute("data-target");
        const templateForm = document.getElementById(targetId);
        if (templateForm) {
          console.log("targetId", targetId);
          templateForm.remove();
          resetTemplateIndices(); // 削除後にインデックスをリセット
        }
      }

      // クリアボタンがクリックされた場合
      if (event.target.closest(".clearBtn")) {
        const button = event.target.closest(".clearBtn");
        const targetId = button.getAttribute("data-target");
        const textarea = document.getElementById(targetId);
        if (textarea) {
          textarea.value = "";
        }
      }
    });
  }
  // 初期化処理
  initButtonHandlers();

  // インデックスをリセットする処理（下が0になるよう逆順で設定）
  function resetTemplateIndices() {
    const templateForms = document.getElementById("template-forms");
    const children = Array.from(templateForms.children);

    // インデックスをリセットする際に順番を保持しつつ更新
    children.reverse().forEach((child, reverseIndex) => {
      const newIndex = reverseIndex; // 下から0になるようインデックス設定
      child.id = `template-form-${newIndex}`;
      // 必要な部分だけ属性を更新
      const textarea = child.querySelector('textarea');
      if (textarea) {
        textarea.setAttribute('placeholder', `定型文${newIndex + 1}`); // プレースホルダを更新
        textarea.setAttribute('aria-label', `定型文${newIndex + 1}`); // アリアラベルを更新
      }

      const hashtagCollapse = child.querySelector('.collapse');
      if (hashtagCollapse) {
        hashtagCollapse.id = `hashtag-${newIndex}`; // ハッシュタグのIDを更新
      }

      const clearBtn = child.querySelector('.clearBtn');
      if (clearBtn) {
        clearBtn.setAttribute('data-target', `textarea-${newIndex}`); // クリアボタンのデータターゲットを更新
      }

      const deleteBtn = child.querySelector('.delete-template-btn');
      if (deleteBtn) {
        deleteBtn.setAttribute('data-target', `template-form-${newIndex}`); // 削除ボタンのデータターゲットを更新
      }
    });
  }


  // メッセージパネルの表示・非表示を切り替える
  panelButton.addEventListener('click', function () {
    // メッセージパネルの高さを指定（必要に応じて調整可能）
    const panelHeight = '170px';

    if (messagePanel.style.height === panelHeight) {
      // パネルが開いている場合は閉じる
      messagePanel.style.height = '0';
      panelButton.textContent = 'メッセージパネルを開く';
    } else {
      // パネルが閉じている場合は開く
      messagePanel.style.height = panelHeight;
      panelButton.textContent = 'メッセージパネルを閉じる';
    }
  });

  // 情報タブ: 
  // ストアリンクのクリックイベントを設定
  const storeLink = document.getElementById('store_link');
  if (storeLink) clickURL(storeLink);

  // 各情報をHTML要素に反映
  document.getElementById('extension-id').textContent = `${chrome.runtime.id}`;
  document.getElementById('extension-name').textContent = `${manifestData.name}`;
  document.getElementById('extension-version').textContent = `${manifestData.version}`;
  document.getElementById('extension-description').textContent = `${manifestData.description}`;
  chrome.permissions.getAll((result) => {
    let siteAccess;
    if (result.origins.length > 0) {
      if (result.origins.includes("<all_urls>")) {
        siteAccess = "すべてのサイト";
      } else {
        siteAccess = result.origins.join("<br>");
      }
    } else {
      siteAccess = "クリックされた場合のみ";
    }
    document.getElementById('site-access').innerHTML = siteAccess;
  });
  // シークレットモードでのアクセス権を確認し，結果を表示
  chrome.extension.isAllowedIncognitoAccess((isAllowedAccess) => {
    document.getElementById('incognito-enabled').textContent = `${isAllowedAccess ? '有効' : '無効'}`;
  });
  // GitHubリンクのクリックイベントを設定
  const githubLink = document.getElementById('github-link');
  if (githubLink) clickURL(githubLink);

});


// 設定をストレージに保存する関数
function saveSettings(datetime, message, value) {
  const settings = {
    blurValue: value, // ぼかしの設定値
  };

  // ストレージに設定を保存し，保存完了後にメッセージを出力
  chrome.storage.local.set({ settings: settings }, () => {
    messageOutput(datetime, message); // 保存時の日時とメッセージを出力
  });
}


// popup.html内のリンクを新しいタブで開けるように設定する関数
// linkにはgetElementByIdで取得した要素またはURL文字列を渡す
function clickURL(link) {
  const url = link.href ? link.href : link; // linkが要素ならhref属性からURLを取得，URL文字列ならそのまま使用

  // linkがHTML要素の場合のみクリックイベントを設定
  if (link instanceof HTMLElement) {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // デフォルトのリンク遷移を防止
      chrome.tabs.create({ url }); // 新しいタブでURLを開く
    });
  }
}


// メッセージを指定した日時とともに出力する関数
function messageOutput(datetime, message) {
  messageDiv.innerHTML += '<p class="m-0">' + datetime + ' ' + message + '</p>'; // <p> タグで囲んでメッセージを新しい行に追加
}
// メッセージをクリアする処理
document.getElementById('messageClearButton').addEventListener('click', () => {
  messageDiv.innerHTML = '<p class="m-0">' + '' + '</p>'; // メッセージ表示エリアを空にする
});


// 現在の時間を取得する
// "年-月-日 時:分" の形式で返す（例：2024-11-02 10:52）
function dateTime() {
  const now = new Date();// 現在の日付と時刻を取得

  // 各部分の値を取得し2桁に整形
  const year = now.getFullYear();                                    // 年
  const month = String(now.getMonth() + 1).padStart(2, '0');         // 月（0始まりのため+1）
  const day = String(now.getDate()).padStart(2, '0');                // 日
  const hours = String(now.getHours()).padStart(2, '0');             // 時
  const minutes = String(now.getMinutes()).padStart(2, '0');         // 分

  // フォーマットした日時を文字列で返す
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
  return formattedDateTime;
}


