const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const addBtn = document.getElementById("addBtn");
const menuInput = document.getElementById("menuInput");

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

const newMake = () => {
  const [cw, ch] = [canvas.width / 2, canvas.height / 2];
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
  ctx.font = "bold 24px Pretendard, sans-serif"; // 폰트 fallback 추가
  ctx.textAlign = "center";

  for (let i = 0; i < product.length; i++) {
    const angle = arc * i + arc / 2;
    ctx.save();
    ctx.translate(
      cw + Math.cos(angle) * (cw - 80),
      ch + Math.sin(angle) * (ch - 80)
    );
    ctx.rotate(angle + Math.PI / 2);
    product[i].split(" ").forEach((text, j) => {
      ctx.fillText(text, 0, 30 * j);
    });
    ctx.restore();
  }
};

const rotate = () => {
  canvas.style.transform = `initial`;
  canvas.style.transition = `initial`;

  setTimeout(() => {
    const ran = Math.floor(Math.random() * 360);
    const rotate = ran + 3600;
    canvas.style.transition = `2s ease-out`;
    canvas.style.transform = `rotate(-${rotate}deg)`;
    setTimeout(() => {
      alert(`오늘의 메뉴는?`);
    }, 2000);
  }, 1);
};

const add = () => {
  const name = menuInput.value.trim();
  if (name) {
    product.push(name);
    menuInput.value = "";
    newMake();
  } else {
    alert("메뉴 이름을 입력해주세요!");
  }
};

newMake();

spinBtn.addEventListener("click", rotate);
addBtn.addEventListener("click", add);
