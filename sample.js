console.log("ok")

const textContainer = document.getElementById("text");
const children = textContainer.children;
let click = 0;
console.log("click", click);
// 左矢印クリック時
document.getElementById("left-arrow").addEventListener("click", function () {
  // 最初の子要素の幅を取得
  if (click > 0 && click <= children.length) {
    click -= 1;
  }
  console.log("click", click)
  let totalWidth = 0;
  // console.log("left-arrow", children)
  totalWidth += children[click].offsetWidth;  // 子要素の幅を加算
  // console.log("left-arrow", children[i].innerHTML)
  console.log("left-arrow", children[click].offsetWidth)

  textContainer.scrollLeft -= totalWidth;  // 各要素の幅に基づいてスクロール
  console.log(textContainer.scrollLeft)
});

// 右矢印クリック時
document.getElementById("right-arrow").addEventListener("click", function () {
  // 最初の子要素の幅を取得
  let totalWidth = 0;
  // console.log("right-arrow", children)

  totalWidth += children[click].offsetWidth;  // 子要素の幅を加算
  // console.log("right-arrow", children[i].innerHTML)
  console.log("right-arrow", children[click].offsetWidth)

  textContainer.scrollLeft += totalWidth;  // 各要素の幅に基づいてスクロール
  console.log(textContainer.scrollLeft)
  if (click >= 0 && click < children.length) {
    click += 1;
  }
  console.log("click", click)
});


function insertTextToChat(text) {
  const chatInput = document.querySelector('[data-a-target="chat-input-text"]');
  if (chatInput) {
    const currentText = chatInput.innerText;
    chatInput.innerText = currentText + text; // 既存のテキストに追加
  }
}

const templateBtn = document.getElementById("template-btn");
templateBtn.addEventListener('click', function () {
  //insertTextToChat("おはようございます！"); // チャットに「おはようございます！」を挿入
});