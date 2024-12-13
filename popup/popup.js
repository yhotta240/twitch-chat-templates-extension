// 初期化処理
let isEnabled = false; // ツールの有効状態を示すフラグ（初期値はfalse）
let templateSet = {};
const enabledElement = document.getElementById('enabled'); // チェックボックス（トグルボタン）要素を取得
const panelButton = document.getElementById('panelButton');
const messagePanel = document.getElementById('messagePanel');
const messageDiv = document.getElementById('message'); // メッセージ表示用のdiv要素を取得


// ツールの有効/無効状態
enabledElement.addEventListener('change', (event) => {
  isEnabled = event.target.checked;
  chrome.storage.local.set({ isEnabled: isEnabled }, () => {
    messageOutput(dateTime(), isEnabled ? 'Twitch 定型チャットは有効になっています' : 'Twitch 定型チャットは無効になっています');
  });
});


// 保存された設定を読み込む
chrome.storage.local.get(['settings', 'isEnabled'], (data) => {
  if (enabledElement) {
    isEnabled = data.isEnabled || false;
    enabledElement.checked = isEnabled;
  }
  messageOutput(dateTime(), isEnabled ? 'Twitch 定型チャットは有効になっています' : 'Twitch 定型チャットは無効になっています');
});

const addSetBtn = document.getElementById("add-set-btn");
const addTemplateSetBtn = document.getElementById("default-set-btn");
const renameSetBtn = document.getElementById("rename-set-btn");
const copySetBtn = document.getElementById("copy-set-btn");
const deleteSetBtn = document.getElementById("delete-set-btn");
const saveSetBtn = document.getElementById("save-set-btn");

function getTabInfo() {
  const tabItem = document.querySelector('#tabItem');
  const activeTab = tabItem.querySelector('.nav-link.active');
  // console.log("activeTab", activeTab);
  const noActiveTab = tabItem.querySelector('.nav-link');
  const targetId = activeTab ? activeTab.getAttribute('data-bs-target') : null;
  // console.log("targetId", targetId);
  const tabUuid = targetId ? targetId.slice(-13) : null;
  const tabContents = document.querySelector("#v-pills-tabContent");
  const activeContent = targetId ? tabContents.querySelector(targetId) : null;
  const noActiveContent = tabContents.querySelector(".tab-pane");
  // console.log("activeContent", activeContent);
  return {
    tabItem,
    activeTab,
    noActiveTab,
    targetId,
    tabUuid,
    tabContents,
    activeContent,
    noActiveContent
  }
}

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

// コンテンツの追加
function addTabContent(uuid, value = {}) {

  console.log("uuid", uuid);

  const { tabItem, tabContents: addTabPane } = getTabInfo();
  const twitchUserId = value.twitchUserId || '';
  const createDate = value.createDate || dateTime();
  const updateDate = value.updateDate || dateTime();
  // if (value) {
  // }
  addTabPane.innerHTML += `          
  <div class="tab-pane fade show active " id="v-pills-${tabItem.children.length - 1}-${uuid}" role="tabpanel"
          aria-labelledby="v-pills-${uuid}-tab" tabindex="0">
    <div class="d-flex justify-content-between px-2 py-3">
      <div class="input-group rounded-top  w-100">
        <span class="input-group-text py-0 px-1 rounded-0 bg-dark text-bg-dark">www.twitch.tv/</span>
        <input type="text" class="form-control p-0 ps-1 rounded-0" placeholder="twitch-id" aria-label="twitch"
          aria-describedby="basic-addon1" id="twitch-id-${uuid}" value="${twitchUserId}">
      </div>
      <button class="btn-customs btn btn-sm d-flex align-items-center py-0 px-1 ms-1" data-bs-toggle="collapse"
        data-bs-target="#collapseInfo-${uuid}" aria-expanded="false" aria-controls="collapseInfo">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"
          class="bi bi-info-circle-fill " viewBox="0 0 16 16">
          <path
            d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
        </svg>
        <div class="ps-1 text-nowrap">詳細</div>
      </button>
    </div>
    <div class="collapse collapse-horizontal w-100 h-100 pb-2" id="collapseInfo-${uuid}">
      <div class="ms-2 d-flex">作成日：
        <div class="createDate">${createDate}</div>
      </div>
      <div class="ms-2 d-flex">更新日：
        <div class="updateDate">${updateDate}</div>
      </div>
      <div class="ms-2 d-flex">作成数：
        <div class="createNum">0</div>
      </div>
      <div class="ms-2 d-flex">使用回数：
        <div class="useNum">0</div>
      </div>
    </div>

    <div class="ms-2 mb-1">
      <div class="form-check">
        <input class="form-check-input check-hash" type="checkbox" value="" id="allHashCheck-${uuid}"
          data-bs-toggle="collapse" data-bs-target="#collapseHashtag" aria-expanded="false"
          aria-controls="collapseHashtag">
        <label class="form-check-label " for="allHashCheck-${uuid}">
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
        <input class="form-check-input check-quick" type="checkbox" value="" id="allQuickCheck-${uuid}">
        <label class="form-check-label " for="allQuickCheck-${uuid}">
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
      <button  class="add-template-btn btn-customs btn btn-sm d-flex align-items-center py-0 ps-0 pe-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus"
          viewBox="0 0 16 16">
          <path
            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
        </svg>
        定型文追加
      </button>
    </div>
    <!-- 定型文 -->
    <div class="template-forms">
    </div>
  </div>
  `;
}

function targetPreview(tabItem) {//プレビューに反映
  const activeTab = tabItem.querySelector('.nav-link.active');
  const targetId = activeTab.getAttribute('data-bs-target');
  const viewContent = document.querySelector(targetId);
  if (!viewContent) return;
  const templateForms = viewContent.querySelector('.template-forms');
  const children = Array.from(templateForms.children);
  const text = document.querySelector('#text');
  text.innerHTML = "";
  children.forEach((child, index) => {
    const hashtagText = child.querySelector('.hashtag-text')?.value || '';
    const isQuick = child.querySelector('.is-quick')?.checked || false;
    const templateText = child.querySelector('.template-text')?.value || '';
    let viewText = hashtagText ? "#" + hashtagText : templateText;
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

function handleInputFinish(input, uuid) {
  const value = input.value.trim();
  const { tabItem, activeTab: newActiveTab } = getTabInfo();

  if (value) {
    if (newActiveTab) {
      newActiveTab.innerHTML = `${value}`;
    }
    addTabContent(uuid);
    messageOutput(dateTime(), `${value}が追加されました`);
  } else {
    const lastTab = tabItem.children[tabItem.children.length - 1];
    if (!newActiveTab || newActiveTab === lastTab.querySelector('.nav-link')) {
      if (lastTab) {
        lastTab.remove();
      }
      const firstTab = document.querySelector('#tabItem .nav-item .nav-link');
      if (!firstTab) return;
      firstTab.classList.add("active");
      const firstTargetId = firstTab.getAttribute('data-bs-target');
      const firstTargetContent = document.querySelector(firstTargetId);
      firstTargetContent.classList.add('show', 'active');

    }
  }
}

// 追加
addSetBtn.addEventListener('click', () => {
  const { tabItem } = getTabInfo();
  const uuid = generateShortUUID();
  tabItem.innerHTML += `
  <li class="nav-item" role="presentation">
    <button type="button" class="nav-link rounded-0 p-2" id=" v-pills-${uuid}-tab" data-bs-toggle="pill"
      data-bs-target="#v-pills-${tabItem.children.length}-${uuid}" role="tab" aria-controls="v-pills-${tabItem.children.length}-${uuid}"
      aria-selected="false">
      <input type="text" class=" form-control p-0 ps-1 rounded-0" placeholder="名前を入力" aria-label="twitch"
        aria-describedby="basic-addon1" id="add-set-name">
    </button>
  </li>
  `;
  const { activeTab, activeContent: deleteContent } = getTabInfo();
  activeTab.classList.remove('active');
  if (activeTab) {
    deleteContent.classList.remove('show', 'active');
  }
  const focusTabs = document.querySelectorAll('#tabItem .nav-link');
  focusTabs[focusTabs.length - 1].classList.add("active");

  const inputName = document.querySelector("#add-set-name");
  inputName.focus();
  inputName.addEventListener("blur", () => {
    if (!inputName.dataset.handled) {
      inputName.dataset.handled = "true";
      handleInputFinish(inputName, uuid);
    }
  });

  inputName.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (!inputName.dataset.handled) {
        inputName.dataset.handled = "true";
        handleInputFinish(inputName, uuid);
      }
      inputName.blur();
    }
  });


});

// デフォルトテンプレ追加
addTemplateSetBtn.addEventListener('click', () => {
  const { tabItem } = getTabInfo();
  const value = 'template'; // 入力値を取得してトリム
  const uuid = generateShortUUID();
  tabItem.innerHTML += `
    <li class="nav-item" role="presentation">
      <button type="button" class="nav-link rounded-0 p-2" id=" v-pills-${uuid}-tab" data-bs-toggle="pill"
        data-bs-target="#v-pills-${tabItem.children.length}-${uuid}" role="tab" aria-controls="v-pills-${tabItem.children.length}-${uuid}"
        aria-selected="false">${value}
      </button>
    </li>
  `;
  const { activeTab, activeContent: tabPane } = getTabInfo();
  // const {  } = getTabInfo();
  console.log("tabPane", tabPane);
  if (activeTab && tabPane) {
    tabPane.classList.remove('show', 'active');
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
        return addTemplate(id, uuid, hashtagText, isQuick, templateText);
      }).join("");
    targetPreview(document.querySelector('#tabItem'));
  }
  messageOutput(dateTime(), `${value}が追加されました`);
});

function addTemplate(id, uuid, hashtagText, isQuick, templateText) {
  const template = `
  <div id="template-form-${uuid}-${id}">
    <div class="mx-2 p-1 template-select" tabindex="0" id="focusableDiv">
      <div class="d-flex justify-content-between mb-1">
        <!-- ハッシュタグ -->
        <div class="collapse w-100 ${hashtagText ? 'show' : ''}" id="hashtag-${uuid}-${id}">
          <div class="input-group rounded-top ">
            <span class="input-group-text py-0 px-1 rounded-0" id="basic-addon1">#</span>
            <input id="input-${uuid}-${id}" type="text" class="form-control p-0 ps-1 rounded-0 hashtag-text" placeholder="ハッシュタグ" aria-label="ハッシュタグ" aria-describedby="basic-addon1" value="${hashtagText}"  maxlength="20">
          </div>
        </div>
        <div class="d-flex justify-content-end w-100 mb-1">
          <!-- ハッシュタグ表示 -->
          <div>
            <input class="form-check-input check-hash ${hashtagText ? '' : 'collapsed'}" type="checkbox" id="hashCheckbox-${uuid}-${id}" value="option1" data-bs-toggle="collapse" data-bs-target="#hashtag-${uuid}-${id}" aria-expanded="false" aria-controls="hashtag-${id}"  ${hashtagText ? "checked" : ""}>
            <label class="form-check-label" for="hashCheckbox-${uuid}-${id}"></label>
          </div>
          <!-- クイック送信 -->
          <div>
            <input class="form-check-input is-quick check-quick ms-2" type="checkbox" id="quickCheckbox-${uuid}-${id}" value="option" ${isQuick ? "checked" : ""}>
            <label class="form-check-label" for="quickCheckbox-${uuid}-${id}"></label>
          </div>
          <!-- クリアボタン -->
          <button class="clearBtn btn-customs btn btn-sm d-flex align-items-center py-0 px-1" data-target="textarea-${uuid}-${id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"></path>
            </svg>
            <div class="ps-1">クリア</div>
          </button>
          <button data-target="template-form-${uuid}-${id}" class="delete-template-btn btn-customs btn btn-sm d-flex align-items-center py-0 px-1" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"></path>
            </svg>
            <div class="ps-1">削除</div>
          </button>
        </div>
      </div>
      <div class="">
        <textarea class="form-control p-1 rounded-0 template-text" placeholder="定型文${id + 1}" aria-label="定型文${id + 1}" id="textarea-${uuid}-${id}" rows="1">${templateText}</textarea>
      </div>
    </div>
    <hr class="m-2">
  </div>
  `;
  return template;
}
// 変更
renameSetBtn.addEventListener('click', () => {
  const { tabItem } = getTabInfo();
  let activeTab = tabItem.querySelector('.nav-link.active') || tabItem.querySelector('.nav-item .nav-link');
  if (activeTab) {
    activeTab.classList.add("active");
  }
  const inputNameForm = document.querySelector("#add-set-name");
  const inputRenameForm = document.querySelector("#re-set-name");
  if (inputNameForm || inputRenameForm) return;
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
  // const inputEvent = new InputEvent("input", { bubbles: true });
  // renameInput.dispatchEvent(inputEvent);

  renameInput.addEventListener("blur", () => {
    const newName = renameInput.value.trim() || currentName; // 空欄の場合は元の名前に戻す
    activeTab.innerHTML = newName;
    console.log(`タブ名が変更されました: ${newName}`);
    messageOutput(dateTime(), `${newName}に変更されました`);
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
  const { tabContents, activeContent: copyContent } = getTabInfo();
  if (!copyContent) return;
  console.log('copyContent', copyContent);
  const { tabItem, activeTab } = getTabInfo();
  const value = activeTab.textContent;
  console.log(value);
  const uuid = generateShortUUID();
  tabItem.innerHTML += `
    <li class="nav-item" role="presentation">
      <button type="button" class="nav-link rounded-0 p-2" id=" v-pills-${uuid}-tab" data-bs-toggle="pill"
        data-bs-target="#v-pills-${tabItem.children.length}-${uuid}" role="tab" aria-controls="v-pills-${tabItem.children.length}-${uuid}"
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
    console.log("newPane", newPane);

    const oldUuid = copyContent.id.slice(-13); // 旧UUIDを抽出
    const oldHTML = newPane.outerHTML;

    // 正規表現でUUIDパターン全体を置き換え
    const updatedHTML = oldHTML.replace(
      /\b[a-fA-F0-9]{8}-[a-fA-F0-9]{4}\b/g, // UUIDパターンの正規表現
      (match) => {
        return match === oldUuid ? uuid : match; // 該当する旧UUIDのみ新しいUUIDに置き換え
      }
    );
    // console.log("updatedHTML", updatedHTML);

    // 更新したHTMLをnewPaneに適用
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = updatedHTML.trim();
    const updatedPane = tempContainer.firstChild;

    // 必要なクラスや状態を更新
    console.log("tabContents", tabContents.children.length)
    updatedPane.id = `v-pills-${tabContents.children.length}-${uuid}`;
    updatedPane.classList.add('show', 'active');

    addTabPane.appendChild(updatedPane);

    // デバッグ用ログ
    targetPreview(document.querySelector('#tabItem'));
    messageOutput(dateTime(), `${value}が複製されました`);
  }
});

// 削除
deleteSetBtn.addEventListener('click', () => {
  const { tabItem, activeTab } = getTabInfo();
  const modalBody = document.querySelector('#exampleModal .modal-body');
  if (tabItem.children.length > 1) {
    modalBody.innerHTML = `
      セット名: <span id="set-name" class="text-danger">${activeTab.textContent}</span> を削除します。本当によろしいですか？
      <div class="d-flex justify-content-end mt-2">
        <button type="button" id="set-delete" class="btn btn-danger btn-sm me-2 p-1" data-bs-dismiss="modal">削除</button>
        <button type="button" class="btn btn-secondary btn-sm p-1" data-bs-dismiss="modal">閉じる</button>
      </div>
    `;
  } else {
    // 削除不可メッセージ
    modalBody.innerHTML = `
      セット名: <span id="set-name" class="text-danger">削除不可</span><br>
      残り1つのため，削除できません。
      <div class="d-flex justify-content-end mt-2">
        <button type="button" class="btn btn-secondary btn-sm p-1" data-bs-dismiss="modal">閉じる</button>
      </div>
    `;
    messageOutput(dateTime(), `残り1つのため，${activeTab.textContent}の削除は行えません。`);
    return;
  }
  //セット削除
  document.getElementById('set-delete').addEventListener('click', () => {
    // 対応するタブコンテンツを削除
    const { activeContent: deleteContent } = getTabInfo();
    if (deleteContent) {
      deleteContent.remove();
    }
    activeTab.parentElement.remove();

    // 残ったタブのうち最初のタブをアクティブ化
    const remainingTabs = tabItem.querySelectorAll('.nav-link');
    if (remainingTabs.length > 0) {
      const firstTab = remainingTabs[0];
      firstTab.classList.add('active');

      const targetContentId = firstTab.getAttribute('data-bs-target');
      const targetContent = document.querySelector(targetContentId);
      if (targetContent) {
        targetContent.classList.add('show', 'active');
      }
    }
    // モーダルのリセット（オプション）
    modalBody.innerHTML = '';
    const { tabItem: resetTabs } = getTabInfo();
    Array.from(resetTabs.children).forEach((tab, index) => {
      const navLink = tab.querySelector(".nav-link");
      const tabId = navLink.getAttribute('data-bs-target');
      const uuid = tabId.slice(-13);
      const targetId = `v-pills-${index}-${uuid}`;
      const tabContent = document.querySelector(tabId);
      // 更新
      navLink.setAttribute('id', `#${targetId}-tab`);
      navLink.setAttribute('data-bs-target', `#${targetId}`);
      navLink.setAttribute('aria-controls', `#${targetId}`);
      tabContent.setAttribute('id', targetId);
      tabContent.setAttribute('aria-labelledby', targetId);
    });
    targetPreview(tabItem);
    messageOutput(dateTime(), `${activeTab.textContent}が削除されました`);
  });
});

// 保存
saveSetBtn.addEventListener('click', () => {
  saveAction();
});

// インデックスをリセットする処理（下が0になるよう逆順で設定）
function resetIndices(tabId) {
  const templateForms = document.querySelector(".template-forms");
  const children = Array.from(templateForms.children);

  // インデックスをリセットする際に順番を保持しつつ更新
  children.reverse().forEach((child, reverseIndex) => {
    const newIndex = reverseIndex; // 下から0になるようインデックス設定
    child.id = `template-form-${tabId}-${newIndex}`;
    const textarea = child.querySelector('textarea');
    const hashtagCollapse = child.querySelector('.collapse');
    const clearBtn = child.querySelector('.clearBtn');
    const deleteBtn = child.querySelector('.delete-template-btn');
    textarea.setAttribute('placeholder', `定型文${newIndex + 1}`);
    textarea.setAttribute('aria-label', `定型文${newIndex + 1}`);
    hashtagCollapse.id = `hashtag-${tabId}-${newIndex}`;
    clearBtn.setAttribute('data-target', `textarea-${tabId}-${newIndex}`);
    deleteBtn.setAttribute('data-target', `template-form-${tabId}-${newIndex}`);
  });
}


// 定型文をストレージに保存
function saveAction() {
  const templateSets = {};
  const tabItem = document.querySelectorAll('#tabItem .nav-link');
  console.log("tabItem", tabItem);
  tabItem.forEach((navLink, index) => {
    console.log("navLink", navLink);
    const tabName = navLink.textContent.trim();
    console.log("tabName", tabName);
    const saveTargetId = navLink.getAttribute('data-bs-target');
    console.log("saveTargetId", saveTargetId);
    const uuid = saveTargetId.slice(-13);
    console.log("saveTargetId", uuid);
    const saveTargetContent = document.querySelector(saveTargetId);
    console.log("saveTargetContent", saveTargetContent);
    const templateForms = saveTargetContent.querySelector('.template-forms');
    const children = Array.from(templateForms.children);

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
    const twitchUserIdElement = saveTargetContent.querySelector(`#twitch-id-${uuid}`);
    const twitchUserId = twitchUserIdElement ? twitchUserIdElement.value : null;
    const createDate = saveTargetContent.querySelector('.createDate')?.textContent || dateTime();
    const updateDate = saveTargetContent.querySelector('.updateDate')?.textContent || dateTime();
    const createNum = parseInt(saveTargetContent.querySelector('.createNum')?.textContent || '0', 10);
    const useNum = parseInt(saveTargetContent.querySelector('.useNum')?.textContent || '0', 10);
    const twitchId = {
      twitchUserId: twitchUserId,
      tabName: tabName,
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

function loading() {
  chrome.storage.local.get(['isEnabled', 'templateSets'], (data) => {
    const storageInfo = data.templateSets;
    if (storageInfo && typeof storageInfo === "object") {
      const { tabItem, tabContents } = getTabInfo();
      tabItem.innerHTML = "";
      tabContents.innerHTML = "";
      Object.entries(storageInfo).forEach(([key, value], index) => {
        console.log(`info ${index}: key = ${key}, value =`, value);
        const uuid = key.slice(-13);
        tabItem.innerHTML += `
          <li class="nav-item" role="presentation">
            <button type="button" class="nav-link rounded-0 p-2" id="${key}-tab" data-bs-toggle="pill"
              data-bs-target="${key}" role="tab" aria-controls="${key}"
              aria-selected="false">${value.tabName}
            </button>
          </li>
        `;
        addTabContent(uuid, value);
        const { noActiveTab, tabContents, noActiveContent, } = getTabInfo();
        noActiveTab.classList.add('active');
        tabContents.children[index].classList.remove('active', 'show');
        noActiveContent.classList.add('active', 'show');
        // const twitchId = tabContents.querySelector(`#twitch-id-${uuid}`);
        const templateForms = tabContents.children[index].querySelector(".template-forms");
        templateForms.innerHTML = Object.keys(value.templates)
          .reverse()
          .map((id) => {
            const { hashtagText, isQuick, templateText } = value.templates[id];
            return addTemplate(id, uuid, hashtagText, isQuick, templateText);
          })
          .join("");
      });
      targetPreview(tabItem);
    } else {
      console.log("templateSets is not a valid Object.");
    }
  });
}


// DOMの読み込み完了を監視し，完了後に実行
document.addEventListener('DOMContentLoaded', function () {
  // saveAction();
  loading();
  const manifestData = chrome.runtime.getManifest();
  document.getElementById('name').textContent = `${manifestData.name}`;

  const tabItem = document.querySelector('#tabItem');
  targetPreview(tabItem);
  tabItem.addEventListener('click', () => {
    targetPreview(tabItem);
  });

  document.addEventListener("mouseover", (event) => {
    const tooltipHashtag = event.target.closest('[data-bs-toggle="tooltipHashtag"]');
    const tooltipTriggerList = event.target.closest('[data-bs-toggle="tooltipQuick"]');

    if (tooltipHashtag) {
      const hashtagInstance = new bootstrap.Tooltip(tooltipHashtag);
      tooltipHashtag.addEventListener("mouseleave", () => {
        hashtagInstance.dispose();
      }, { once: true });
    }
    if (tooltipTriggerList) {
      const triggerListInstance = new bootstrap.Tooltip(tooltipTriggerList);
      tooltipTriggerList.addEventListener("mouseleave", () => {
        triggerListInstance.dispose();
      }, { once: true });
    }
  });



  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-template-btn")) {
      const { targetId, activeContent: targetContent } = getTabInfo();
      const tabId = targetId.slice(-13);
      const templateForms = targetContent.querySelector(".template-forms");
      const filteredChildren = templateForms.children;
      const newTemplateHTML = `
          <div id="template-form-${tabId}-${filteredChildren.length}">
            <div class="mx-2 p-1 template-select" tabindex="0" id="focusableDiv">
              <div class="d-flex justify-content-between mb-1">
                <!-- ハッシュタグ -->
                <div class="collapse w-100" id="hashtag-${tabId}-${filteredChildren.length}">
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
                      data-bs-toggle="collapse" data-bs-target="#hashtag-${tabId}-${filteredChildren.length}" aria-expanded="false"
                      aria-controls="hashtag-${tabId}-${filteredChildren.length}">
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
                    data-target="textarea-${tabId}-${filteredChildren.length}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"
                      class="bi bi-x-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                      <path
                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                    <div class="ps-1">クリア</div>
                  </button>
                  <button data-target="template-form-${tabId}-${filteredChildren.length}"
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
                <textarea class="form-control p-1 rounded-0 template-text" placeholder="定型文${filteredChildren.length + 1}" aria-label="定型文${filteredChildren.length + 1}" id="textarea-${tabId}-${filteredChildren.length + 1}"
                  rows="1"></textarea>
              </div>
            </div>
            <hr class="m-2">
          </div>
        `;
      templateForms.insertAdjacentHTML("afterbegin", newTemplateHTML);
    }

    // 削除ボタンがクリックされた場合
    if (event.target.closest(".delete-template-btn")) {
      const button = event.target.closest(".delete-template-btn");
      const targetId = button.getAttribute("data-target");
      const tabId = targetId.slice(-13);
      const templateForm = document.getElementById(targetId);
      if (templateForm) {
        console.log("targetId", targetId);
        templateForm.remove();
        resetTemplateIndices(tabId); // 削除後にインデックスをリセット
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
    const tabItem = document.querySelector('#tabItem');
    targetPreview(tabItem);
  });


  // インデックスをリセットする処理（下が0になるよう逆順で設定）
  function resetTemplateIndices(tabId) {
    const templateForms = document.querySelector(".template-forms");
    const children = Array.from(templateForms.children);

    // インデックスをリセットする際に順番を保持しつつ更新
    children.reverse().forEach((child, reverseIndex) => {
      const newIndex = reverseIndex; // 下から0になるようインデックス設定
      child.id = `template-form-${tabId}-${newIndex}`;
      const textarea = child.querySelector('textarea');
      const hashtagCollapse = child.querySelector('.collapse');
      const clearBtn = child.querySelector('.clearBtn');
      const deleteBtn = child.querySelector('.delete-template-btn');
      if (textarea) {
        textarea.setAttribute('placeholder', `定型文${newIndex + 1}`); // プレースホルダを更新
        textarea.setAttribute('aria-label', `定型文${newIndex + 1}`); // アリアラベルを更新
      }
      if (hashtagCollapse) {
        hashtagCollapse.id = `hashtag-${tabId}-${newIndex}`; // ハッシュタグのIDを更新
      }
      if (clearBtn) {
        clearBtn.setAttribute('data-target', `textarea-${tabId}-${newIndex}`); // クリアボタンのデータターゲットを更新
      }
      if (deleteBtn) {
        deleteBtn.setAttribute('data-target', `template-form-${tabId}-${newIndex}`); // 削除ボタンのデータターゲットを更新
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

  const issueLink = document.getElementById('issue-link');
  if (issueLink) clickURL(issueLink);

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
