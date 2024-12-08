// 初期化処理
let isEnabled = false; // ツールの有効状態を示すフラグ（初期値はfalse）
let templateSet = {};
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
    messageOutput(dateTime(), isEnabled ? 'Twitch 定型チャットは有効になっています' : 'Twitch 定型チャットは無効になっています');
  });
});


// 保存された設定（'settings'と'isEnabled'）を読み込む
chrome.storage.local.get(['settings', 'isEnabled'], (data) => {
  if (enabledElement) {
    isEnabled = data.isEnabled || false; // 'isEnabled'が未設定の場合はデフォルトでfalseを使用
    enabledElement.checked = isEnabled; // チェックボックス（トグルボタン）の状態を'isEnabled'の値に設定
  }
  // 有効/無効状態に応じてメッセージを出力
  messageOutput(dateTime(), isEnabled ? 'Twitch 定型チャットは有効になっています' : 'Twitch 定型チャットは無効になっています');
});

const addSetBtn = document.getElementById("add-set-btn");
const addTemplateSetBtn = document.getElementById("default-set-btn");
const renameSetBtn = document.getElementById("rename-set-btn");
const copySetBtn = document.getElementById("copy-set-btn");
const deleteSetBtn = document.getElementById("delete-set-btn");
const deleteSet = document.getElementById("set-delete");
const saveSetBtn = document.getElementById("save-set-btn");

// デフォルトテンプレートオブジェクト
const defaultTemplate = {
  [0]: {
    hashtagText: "初見です",
    isQuick: false,
    templateText: "初見です！よろしくお願いします！"
  },
  [1]: {
    hashtagText: "きたあ",
    isQuick: false,
    templateText: "きたああああああああああああ"
  },
  [2]: {
    hashtagText: "",
    isQuick: false,
    templateText: "それめっちゃ分かります！"
  },
  [3]: {
    hashtagText: "",
    isQuick: false,
    templateText: "今日使ってるデバイスや設定を教えてください！"
  },
  [4]: {
    hashtagText: "",
    isQuick: false,
    templateText: "次に挑戦するゲームは決まってますか？"
  },
  [5]: {
    hashtagText: "",
    isQuick: false,
    templateText: "ナイスプレイ！すごかったです！"
  },
  [6]: {
    hashtagText: "応援",
    isQuick: false,
    templateText: "頑張れ！応援してます！"
  },
  [7]: {
    hashtagText: "",
    isQuick: false,
    templateText: "今の場面、めっちゃ笑いましたｗ"
  },
  [8]: {
    hashtagText: "お疲れ様です",
    isQuick: false,
    templateText: "配信お疲れ様です！いつも楽しい時間をありがとうございます！"
  }
};

function addTabContent(uuid) {
  console.log("uuid", uuid);
  const tabPane = document.querySelector("#v-pills-tabContent .tab-pane.show.active");
  if (tabPane) {
    tabPane.classList.remove('show', 'active');
  }
  const addTabPane = document.querySelector("#v-pills-tabContent");
  console.log("addTabPane", addTabPane);
  addTabPane.innerHTML += `          
  <div class="tab-pane fade show active " id="v-pills-${uuid}" role="tabpanel"
          aria-labelledby="v-pills-${uuid}-tab" tabindex="0">
    <div class="d-flex justify-content-between px-2 py-3">
      <div class="input-group rounded-top  w-100">
        <span class="input-group-text py-0 px-1 rounded-0 bg-dark text-bg-dark"
          id="basic-addon1">www.twitch.tv/</span>
        <input type="text" class="form-control p-0 ps-1 rounded-0" placeholder="twitch-id" aria-label="twitch"
          aria-describedby="basic-addon1" id="twitch-id">
      </div>
      <button class="btn-customs btn btn-sm d-flex align-items-center py-0 px-1 ms-1" data-bs-toggle="collapse"
        data-bs-target="#collapseInfo" aria-expanded="false" aria-controls="collapseInfo">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"
          class="bi bi-info-circle-fill " viewBox="0 0 16 16">
          <path
            d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
        </svg>
        <div class="ps-1 text-nowrap">詳細</div>
      </button>
    </div>
    <div class="collapse collapse-horizontal w-100 h-100 pb-2" id="collapseInfo">
      <div class="ms-2 d-flex">作成日：
        <div class="createDate">2024-12-07 05:18</div>
      </div>
      <div class="ms-2 d-flex">更新日：
        <div class="updateDate">2024-12-07 05:18</div>
      </div>
      <div class="ms-2 d-flex">作成数：
        <div class="createNum">12</div>
      </div>
      <div class="ms-2 d-flex">使用回数：
        <div class="useNum">12</div>
      </div>
    </div>

    <div class="ms-2 mb-1">
      <div class="form-check">
        <input class="form-check-input check-hash" type="checkbox" value="" id="allHashCheck"
          data-bs-toggle="collapse" data-bs-target="#collapseHashtag" aria-expanded="false"
          aria-controls="collapseHashtag">
        <label class="form-check-label " for="allHashCheck">
          ハッシュタグをすべて表示する
        </label>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"
          data-bs-toggle="tooltipHashtag" data-bs-placement="top" title="プレビューの定型文が短くなります。（10文字以内）"
          class=" bi bi-question-circle-fill mb-1" viewBox="0 0 16 16">
          <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
        </svg>
      </div>
      <div class="form-check">
        <input class="form-check-input check-quick" type="checkbox" value="" id="allQuickCheck">
        <label class="form-check-label " for="allQuickCheck">
          クイック送信をすべてONにする
        </label>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"
          data-bs-toggle="tooltipQuick" data-bs-placement="top" title="チャットに入力されずにそのまま送信されます。（オレンジ色のテキストになります）"
          class=" bi bi-question-circle-fill mb-1" viewBox="0 0 16 16">
          <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
        </svg>
      </div>
    </div>

    <div class="d-flex mx-2 mb-1">
      <button id="add-template-btn" class="btn-customs btn btn-sm d-flex align-items-center py-0 ps-0 pe-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus"
          viewBox="0 0 16 16">
          <path
            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
        </svg>
        定型文追加
      </button>
    </div>
    <!-- 定型文 -->
    <div id="template-forms" class="template-forms">
    </div>
  </div>`;
}

let preTabItem;
// 追加
addSetBtn.addEventListener('click', () => {
  const tabItem = document.getElementById("tabItem");
  const uuid = generateShortUUID();
  preTabItem = tabItem.innerHTML;
  tabItem.innerHTML += `
  <li class="nav-item" role="presentation">
    <button type="button" class="nav-link rounded-0 p-2" id=" v-pills-${uuid}-tab" data-bs-toggle="pill"
      data-bs-target="#v-pills-${uuid}" role="tab" aria-controls="v-pills-${uuid}"
      aria-selected="false">
      <input type="text" class=" form-control p-0 ps-1 rounded-0" placeholder="名前を入力" aria-label="twitch"
        aria-describedby="basic-addon1" id="add-set-name">
    </button>
  </li>
  `;
  const activeTab = document.querySelector('#tabItem .nav-link.active');
  if (activeTab) {//アクティブなタブ削除
    activeTab.classList.remove('active');
    const deleteId = activeTab.getAttribute('data-bs-target');
    if (deleteId) {
      const deleteContent = document.querySelector(deleteId);
      //アクティブなコンテンツ削除
      if (deleteContent) {
        deleteContent.classList.remove('show', 'active');
      }
    }
  }
  const focusTabs = document.querySelectorAll('#tabItem .nav-link');
  focusTabs[focusTabs.length - 1].classList.add("active");

  const inputName = document.querySelector("#add-set-name");
  inputName.focus();
  inputName.addEventListener("blur", () => {
    if (!inputName.dataset.handled) {
      inputName.dataset.handled = "true";
      handleInputFinish(inputName);
    }
  });

  inputName.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (!inputName.dataset.handled) {
        inputName.dataset.handled = "true";
        handleInputFinish(inputName);
      }
      inputName.blur();
    }
  });



  function handleInputFinish(input) {
    const value = input.value.trim();
    const tabItem = document.querySelector('#tabItem ');
    const newActiveTab = tabItem.querySelector('.nav-link.active');
    if (value) {
      if (newActiveTab) {
        newActiveTab.innerHTML = `${value}`;
        addTabContent(uuid);
      }
    } else {
      const lastTab = tabItem.children[tabItem.children.length - 1];
      if (!newActiveTab || newActiveTab === lastTab.querySelector('.nav-link')) {
        lastTab.remove();
        const firstTab = document.querySelector('#tabItem .nav-item .nav-link');
        if (firstTab) {
          firstTab.classList.add("active");
        }
      }
    }
  }
});

//テンプレ追加
addTemplateSetBtn.addEventListener('click', () => {
  const tabItem = document.getElementById("tabItem");
  const value = 'template'; // 入力値を取得してトリム
  const uuid = generateShortUUID();
  tabItem.innerHTML += `
    <li class="nav-item" role="presentation">
      <button type="button" class="nav-link rounded-0 p-2" id=" v-pills-${uuid}-tab" data-bs-toggle="pill"
        data-bs-target="#v-pills-${uuid}" role="tab" aria-controls="v-pills-${uuid}"
        aria-selected="false">${value}
      </button>
    </li>
  `;
  const activeTab = document.querySelector('#tabItem .nav-link.active');
  if (activeTab) {//アクティブなタブ削除
    activeTab.classList.remove('active');
  }
  const focusTabs = document.querySelectorAll('#tabItem .nav-link');
  if (focusTabs.length) {
    const newTab = focusTabs[focusTabs.length - 1];
    newTab.classList.add('active');

    addTabContent(uuid);
    const targetId = newTab.getAttribute('data-bs-target');
    console.log("targetId", targetId);
    const templateContent = document.querySelector(targetId);
    const templateForms = templateContent.querySelector(".template-forms");
    console.log("templateForms", templateForms);
    templateForms.innerHTML =
      Object.keys(defaultTemplate).reverse().map((id, index) => {
        const { hashtagText, isQuick, templateText } = defaultTemplate[id];
        return `
          <div id="template-form-${id}">
          <div class="mx-2 p-1 template-select" tabindex="0" id="focusableDiv">
            <div class="d-flex justify-content-between mb-1">
              <!-- ハッシュタグ -->
              <div class="collapse w-100" id="hashtag-${id}">
                <div class="input-group rounded-top ">
                  <span class="input-group-text py-0 px-1 rounded-0" id="basic-addon1">#</span>
                  <input type="text" class="form-control p-0 ps-1 rounded-0 hashtag-text" placeholder="ハッシュタグ" aria-label="ハッシュタグ" aria-describedby="basic-addon1" value="${hashtagText}">
                </div>
              </div>
              <div class="d-flex justify-content-end w-100 mb-1">
                <!-- ハッシュタグ表示 -->
                <div>
                  <input class="form-check-input check-hash" type="checkbox" id="hashCheckbox-${id}" value="option1" data-bs-toggle="collapse" data-bs-target="#hashtag-${id}" aria-expanded="false" aria-controls="hashtag-${id}" ${hashtagText ? "checked" : ""}>
                  <label class="form-check-label" for="hashCheckbox-${id}"></label>
                </div>
                <!-- クイック送信 -->
                <div>
                  <input class="form-check-input is-quick check-quick ms-2" type="checkbox" id="quickCheckbox-${id}" value="option" ${isQuick ? "checked" : ""}>
                  <label class="form-check-label" for="quickCheckbox-${id}"></label>
                </div>
                <!-- クリアボタン -->
                <button class="clearBtn btn-customs btn btn-sm d-flex align-items-center py-0 px-1" data-target="textarea-${id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"></path>
                  </svg>
                  <div class="ps-1">クリア</div>
                </button>
                <button data-target="template-form-${id}" class="delete-template-btn btn-customs btn btn-sm d-flex align-items-center py-0 px-1" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"></path>
                  </svg>
                  <div class="ps-1">削除</div>
                </button>
              </div>
            </div>
            <div class="">
              <textarea class="form-control p-1 rounded-0 template-text" placeholder="定型文${id + 1}" aria-label="定型文${id + 1}" id="textarea-${id}" rows="1">${templateText}</textarea>
            </div>
          </div>
          <hr class="m-2">
        </div>`;
      }).join("");
    targetTab(document.querySelector('#tabItem'));
  }
});

renameSetBtn.addEventListener('click', () => {
  const tabItem = document.querySelector('#tabItem');
  let activeTab = tabItem.querySelector('.nav-link.active') || tabItem.querySelector('.nav-item .nav-link');
  if (activeTab) {
    activeTab.classList.add("active");
  }
  const inputNameForm = document.querySelector("#add-set-name");
  const inputRenameForm = document.querySelector("#re-set-name");
  if (inputNameForm || inputRenameForm) return;
  // if (inputNameForm) {
  //   inputNameForm.parentElement.parentElement.remove();
  // }
  const currentName = activeTab.textContent.trim();
  activeTab.innerHTML = `
    <input 
      type="text" 
      class="form-control p-0 ps-1 rounded-0" 
      placeholder="名前を変更" 
      aria-label="名前変更" 
      id="re-set-name" 
      value=""
    >
  `;
  const renameInput = document.querySelector('#re-set-name');
  renameInput.focus();
  renameInput.value = currentName;
  const inputEvent = new InputEvent("input", { bubbles: true });
  renameInput.dispatchEvent(inputEvent);

  renameInput.addEventListener("blur", () => {
    const newName = renameInput.value.trim() || currentName; // 空欄の場合は元の名前に戻す
    activeTab.innerHTML = newName;
    console.log(`タブの名前が変更されました: ${newName}`);
  });
  renameInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
      console.log("ok");
      renameInput.blur();
    }
  });
});

// 複製
copySetBtn.addEventListener('click', () => {
  const activeTab = document.querySelector('#tabItem .nav-link.active');
  const copyId = activeTab.getAttribute('data-bs-target');
  const copyContent = document.querySelector(copyId);
  if (!copyContent) return;
  console.log('copyContent', copyContent)
  const tabItem = document.getElementById("tabItem");
  const value = activeTab.textContent;
  console.log(value);
  const uuid = generateShortUUID();
  tabItem.innerHTML += `
    <li class="nav-item" role="presentation">
      <button type="button" class="nav-link rounded-0 p-2" id=" v-pills-${uuid}-tab" data-bs-toggle="pill"
        data-bs-target="#v-pills-${uuid}" role="tab" aria-controls="v-pills-${uuid}"
        aria-selected="false">${value}
      </button>
    </li>
  `;
  document.querySelector('#tabItem .nav-link.active').classList.remove('active');
  const focusTabs = document.querySelectorAll('#tabItem .nav-link');
  if (focusTabs.length) {
    const newTab = focusTabs[focusTabs.length - 1];
    newTab.classList.add('active');
    const tabPane = document.querySelector("#v-pills-tabContent .tab-pane.show.active");
    if (tabPane) {
      tabPane.classList.remove('show', 'active');
    }
    const addTabPane = document.querySelector("#v-pills-tabContent");
    // 元の要素をクローンして操作
    const newPane = copyContent.cloneNode(true); // 子要素も含めてクローン
    const newId = `v-pills-${uuid}`; // 一意のIDを生成
    // 新しいタブのIDや属性を設定
    newPane.id = newId;
    newPane.setAttribute('aria-labelledby', `${newId}-tab`);
    newPane.classList.add('show', 'active'); // アクティブ状態を設定
    // DOMに追加
    addTabPane.appendChild(newPane);
    // デバッグ用ログ
    console.log("新しいタブの内容が追加されました:", newPane);
    targetTab(document.querySelector('#tabItem'));
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
      targetContent.classList.add('show', 'active');
    }
  }
});

// 定型文をストレージに保存
function saveAction() {
  const templateSets = {};
  const tabItem = document.querySelectorAll('#tabItem .nav-link');
  console.log(tabItem);
  tabItem.forEach((navLink, index) => {
    const saveTargetId = navLink.getAttribute('data-bs-target').slice(1);
    const saveTargetContent = document.getElementById(saveTargetId);
    console.log("saveTargetContent", saveTargetContent);
    const templateForms = saveTargetContent.querySelector('.template-forms');
    const children = Array.from(templateForms.children);
    // インデックスをリセットする際に順番を保持しつつ更新
    let templates = {};
    children.forEach((child, index) => {
      const hashtagText = child.querySelector('.hashtag-text')?.value || '';
      const isQuick = child.querySelector('.is-quick')?.checked || false;
      const templateText = child.querySelector('.template-text')?.value || '';
      templates[index] = {
        hashtagText: hashtagText,
        isQuick: isQuick,
        templateText: templateText,
      }
    });
    // console.log("templates", templates);
    const twitchUserIdElement = saveTargetContent.querySelector("#twitch-id");
    const twitchUserId = twitchUserIdElement ? twitchUserIdElement.value : null; // 値が取得できない場合は null を代入
    // console.log("twitchUserId", twitchUserId);
    const createDate = saveTargetContent.querySelector('.createDate')?.textContent || dateTime();
    const updateDate = saveTargetContent.querySelector('.updateDate')?.textContent || dateTime();
    const createNum = parseInt(saveTargetContent.querySelector('.createNum')?.textContent || '0', 10);
    const useNum = parseInt(saveTargetContent.querySelector('.useNum')?.textContent || '0', 10);
    const twitchId = {
      twitchUserId: twitchUserId,
      createDate: createDate,
      updateDate: updateDate,
      createNum: createNum,
      useNum: useNum,
      templates: templates,
    }
    // console.log("twitchId", twitchId);
    templateSets[saveTargetId] = twitchId;
  });
  console.log("templateSets", templateSets);
  // ストレージに保存
  chrome.storage.local.set({ templateSets: templateSets }, () => {
    messageOutput(dateTime(), '定型文プリセットの内容がすべて保存されました');
  });
}
saveSetBtn.addEventListener('click', () => {
  saveAction();
});

function targetTab(tabItem) {//プレビューに反映
  const activeTab = tabItem.querySelector('.nav-link.active');
  const targetId = activeTab.getAttribute('data-bs-target');
  console.log("targetId", targetId);
  console.log("activeTab", activeTab.textContent);
  const viewContent = document.querySelector(targetId);
  console.log("viewContent", viewContent);
  if (!viewContent) return;
  const templateForms = viewContent.querySelector('.template-forms');
  const children = Array.from(templateForms.children);
  const text = document.querySelector('#text');
  text.innerHTML = "";
  children.forEach((child, index) => {
    const hashtagText = child.querySelector('.hashtag-text')?.value || '';
    const isQuick = child.querySelector('.is-quick')?.checked || false;
    const templateText = child.querySelector('.template-text')?.value || '';
    console.log("hashtagText", hashtagText);
    console.log("templateText", templateText);
    let viewText = hashtagText ? "#" + hashtagText : templateText;
    console.log("viewText", viewText);
    text.innerHTML += `
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

// DOMの読み込み完了を監視し，完了後に実行
document.addEventListener('DOMContentLoaded', function () {
  // saveAction();
  // manifest.jsonから拡張機能の情報を取得
  const manifestData = chrome.runtime.getManifest();
  document.getElementById('name').textContent = `${manifestData.name}`;

  const tabItem = document.querySelector('#tabItem');
  targetTab(tabItem);
  tabItem.addEventListener('click', () => {
    targetTab(tabItem);
  });

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
              <input type="text" class="form-control p-0 ps-1 rounded-0 hashtag-text" placeholder="ハッシュタグ"
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
              <input class="form-check-input is-quick check-quick ms-2 " type="checkbox" id="quickCheckbox"
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
          <textarea class="form-control p-1 rounded-0 template-text" placeholder="定型文${filteredChildren.length + 1}" aria-label="定型文${filteredChildren.length + 1}" id="textarea-${filteredChildren.length + 1}"
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
      const textarea = child.querySelector('textarea');
      const hashtagCollapse = child.querySelector('.collapse');
      const clearBtn = child.querySelector('.clearBtn');
      const deleteBtn = child.querySelector('.delete-template-btn');
      if (textarea) {
        textarea.setAttribute('placeholder', `定型文${newIndex + 1}`); // プレースホルダを更新
        textarea.setAttribute('aria-label', `定型文${newIndex + 1}`); // アリアラベルを更新
      }
      if (hashtagCollapse) {
        hashtagCollapse.id = `hashtag-${newIndex}`; // ハッシュタグのIDを更新
      }
      if (clearBtn) {
        clearBtn.setAttribute('data-target', `textarea-${newIndex}`); // クリアボタンのデータターゲットを更新
      }
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


function generateShortUUID() {
  return 'xxxxxxxx-xxxx'.replace(/[x]/g, function () {
    const r = (Math.random() * 16) | 0; // 0～15の乱数
    return r.toString(16); // 16進数に変換
  });
}
