const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const spinBtn = document.getElementById("spinBtn");
const resetBtn = document.getElementById("resetBtn");
const clearBtn = document.getElementById("clearBtn");
const addBtn = document.getElementById("addBtn");
const menuInput = document.getElementById("menuAdd");

// 모달
const modal = document.getElementById("resultModal");
const modalText = document.getElementById("modalText");
const closeBtn = document.getElementById("closeBtn");

// 기본 메뉴
const DEFAULT_PRODUCT = ["중국집", "구내식당", "햄버거", "순대국", "정식당"];
let product = [...DEFAULT_PRODUCT];

const colors = [
  "#dc0936",
  "#e6a742",
  "#3f297e",
  "#be61cf",
  "#169ed8",
  "#209b6c",
  "#60b236",
];

let currentRotation = 0;
let isSpinning = false;

/* 룰렛 그리기 */
function newMake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (product.length === 0) {
    ctx.fillStyle = "#333";
    ctx.font = "bold 22px Pretendard";
    ctx.textAlign = "center";
    ctx.fillText("메뉴를 추가해주세요", canvas.width / 2, canvas.height / 2);
    return;
  }

  if (product.length === 1) {
    ctx.fillStyle = "#333";
    ctx.font = "bold 22px Pretendard";
    ctx.textAlign = "center";
    ctx.fillText(
      "메뉴를 2개 이상 추가해주세요",
      canvas.width / 2,
      canvas.height / 2
    );
    return;
  }

  const cw = canvas.width / 2;
  const ch = canvas.height / 2;
  const arc = (2 * Math.PI) / product.length;

  for (let i = 0; i < product.length; i++) {
    ctx.beginPath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.moveTo(cw, ch);
    ctx.arc(cw, ch, cw, arc * i, arc * (i + 1));
    ctx.fill();
    ctx.closePath();
  }

  ctx.fillStyle = "#fff";
  ctx.font = "bold 24px Pretendard";
  ctx.textAlign = "center";

  for (let i = 0; i < product.length; i++) {
    const angle = arc * i + arc / 2;
    ctx.save();
    ctx.translate(
      cw + Math.cos(angle) * (cw - 90),
      ch + Math.sin(angle) * (ch - 90)
    );
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(product[i], 0, 0);
    ctx.restore();
  }
}

/* 결과 계산 (화면 포인터(12시)와 일치) */
function getResult() {
  const slice = 360 / product.length;
  const deg = currentRotation % 360;
  const pointerAngle = (270 + deg) % 360;
  const index = Math.floor((pointerAngle + 0.0001) / slice) % product.length;
  return product[index];
}

/* 회전 */
function rotate() {
  if (isSpinning) return;
  if (product.length < 2) return alert("메뉴를 2개 이상 추가하세요!");

  isSpinning = true;
  spinBtn.disabled = resetBtn.disabled = clearBtn.disabled = true;

  canvas.style.transition = "initial";
  canvas.style.transform = "rotate(0deg)";

  setTimeout(() => {
    const randomDeg = Math.floor(Math.random() * 360);
    currentRotation = randomDeg + 3600;
    canvas.style.transition = "2s ease-out";
    canvas.style.transform = `rotate(-${currentRotation}deg)`;
  }, 1);
}

/* 메뉴 추가 */
function addMenu() {
  const name = menuInput.value.trim();
  if (!name) return alert("메뉴를 입력해주세요!");
  if (product.includes(name)) return alert("이미 있는 메뉴예요!");

  product.push(name);
  menuInput.value = "";
  newMake();
}

/* 초기화(기본값 복구) */
function resetAll() {
  if (isSpinning) return;
  if (!confirm("기본 메뉴로 초기화할까요?")) return;

  product = [...DEFAULT_PRODUCT];
  currentRotation = 0;
  canvas.style.transform = "rotate(0deg)";
  modal.classList.add("hidden");
  newMake();
}

/* 전체삭제 */
function clearAll() {
  if (isSpinning) return;
  if (!confirm("메뉴를 전부 삭제할까요?")) return;

  product = [];
  currentRotation = 0;
  canvas.style.transform = "rotate(0deg)";
  modal.classList.add("hidden");
  newMake();
}

/* 회전 종료 */
canvas.addEventListener("transitionend", () => {
  if (!isSpinning) return;

  modalText.textContent = getResult();
  modal.classList.remove("hidden");

  isSpinning = false;
  spinBtn.disabled = resetBtn.disabled = clearBtn.disabled = false;
});

/* 모달 닫기 */
closeBtn.onclick = () => modal.classList.add("hidden");
modal.onclick = (e) => {
  if (e.target === modal) modal.classList.add("hidden");
};

/* 이벤트 */
spinBtn.onclick = rotate;
resetBtn.onclick = resetAll;
clearBtn.onclick = clearAll;
addBtn.onclick = addMenu;
menuInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addMenu();
});

/* 시작 */
newMake();
