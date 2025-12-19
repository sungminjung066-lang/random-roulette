const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const spinBtn = document.getElementById("spinBtn");
const addBtn = document.getElementById("addBtn");
const menuInput = document.getElementById("menuAdd");

// 모달
const modal = document.getElementById("resultModal");
const modalText = document.getElementById("modalText");
const closeBtn = document.getElementById("closeBtn");

let product = ["중국집", "구내식당", "햄버거", "순대국", "정식당"];

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

  const cw = canvas.width / 2;
  const ch = canvas.height / 2;
  const arc = (2 * Math.PI) / product.length;

  // 부채꼴
  for (let i = 0; i < product.length; i++) {
    ctx.beginPath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.moveTo(cw, ch);
    ctx.arc(cw, ch, cw, arc * i, arc * (i + 1));
    ctx.fill();
    ctx.closePath();
  }

  // 텍스트
  ctx.fillStyle = "#fff";
  ctx.font = "bold 24px Pretendard, sans-serif";
  ctx.textAlign = "center";

  for (let i = 0; i < product.length; i++) {
    const angle = arc * i + arc / 2;
    ctx.save();

    ctx.translate(
      cw + Math.cos(angle) * (cw - 90),
      ch + Math.sin(angle) * (ch - 90)
    );
    ctx.rotate(angle + Math.PI / 2);

    // 단어 여러 개면 줄바꿈(선택)
    product[i].split(" ").forEach((text, j) => {
      ctx.fillText(text, 0, 30 * j);
    });

    ctx.restore();
  }
}

/* ✅ 결과 계산: “포인터(12시)”가 가리키는 칸을 그대로 뽑기 */
function getResult() {
  const slice = 360 / product.length;
  const deg = currentRotation % 360; // 0~359

  // canvas의 0도는 3시 방향.
  // 포인터는 12시 방향이므로 기준 각도는 270도.
  // 우리는 캔버스를 rotate(-deg)로 돌렸으니,
  // 포인터가 바라보는 실제(캔버스 기준) 각도 = 270 + deg
  const pointerAngle = (270 + deg) % 360;

  // 경계에서 흔들림 방지로 아주 작은 값 추가(선택)
  const index = Math.floor((pointerAngle + 0.0001) / slice) % product.length;

  return product[index];
}

/* 회전 */
function rotate() {
  if (isSpinning) return;

  if (product.length < 2) {
    alert("메뉴는 2개 이상 있어야 돌아가요!");
    return;
  }

  isSpinning = true;
  spinBtn.disabled = true;

  // 애니메이션 재적용을 위한 초기화
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

  // (선택) 중복 방지
  if (product.includes(name)) {
    alert("이미 있는 메뉴예요!");
    return;
  }

  product.push(name);
  menuInput.value = "";
  newMake();
}

/* 회전 종료 → 결과 표시 */
canvas.addEventListener("transitionend", () => {
  if (!isSpinning) return;

  modalText.textContent = getResult();
  modal.classList.remove("hidden");

  isSpinning = false;
  spinBtn.disabled = false;
});

/* 모달 닫기 */
closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

/* 초기 실행 */
newMake();

spinBtn.addEventListener("click", rotate);
addBtn.addEventListener("click", addMenu);
menuInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addMenu();
});
