let originalArray = [];
let array = [];
let delay = 20;
let chart;
let cmpCount = 0;

const algoColors = {
  bubble: "#007bff",
  selection: "#28a745",
  insertion: "#ffc107",
  quick: "#dc3545",
  merge: "#6f42c1"
};

const algoNames = ["버블", "선택", "삽입", "퀵", "병합"];
const algoList = ["bubble", "selection", "insertion", "quick", "merge"];

// 배열 생성
function generateArray() {
  const size = parseInt(document.getElementById("arraySize").value);
  originalArray = Array.from({ length: size }, (_, i) => i + 1);
  for (let i = size - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [originalArray[i], originalArray[j]] = [originalArray[j], originalArray[i]];
  }
  array = originalArray.slice();
  drawArray();
  cmpCount = 0;
  initChart();
  document.getElementById("status").innerText = "현재 알고리즘: 없음";
}

// 막대 그리기
function drawArray(highlight = [], finalColor = null) {
  const container = document.getElementById("arrayContainer");
  container.innerHTML = "";
  array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${value * 2}px`;
    if (highlight.includes(index)) bar.style.backgroundColor = "#dc3545";
    else if (finalColor) bar.style.backgroundColor = finalColor;

    const num = document.createElement("span");
    num.innerText = value;
    bar.appendChild(num);

    container.appendChild(bar);
  });
}

// ------------------- 그래프 -------------------

function initChart() {
  const ctx = document.getElementById("chart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: algoList.map((algo, i) => ({
        label: algoNames[i],
        data: [],
        borderColor: algoColors[algo],
        fill: false
      }))
    },
    options: {
      responsive: true,
      animation: false,
      plugins: { legend: { display: true } },
      scales: {
        x: { type: "linear", title: { display: true, text: "시간(ms)" } },
        y: { beginAtZero: true, title: { display: true, text: "비교 횟수" } }
      }
    }
  });
}

// 그래프 업데이트
function updateChart(algoIndex, cmp, time) {
  chart.data.datasets[algoIndex].data.push({ x: time, y: cmp });
  chart.update('none');
}

// ------------------- 정렬 알고리즘 -------------------

async function bubbleSort(a, algoIndex) {
  a = a.slice();
  let cmp = 0;
  const start = performance.now();
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      cmp++;
      cmpCount++;
      array = a.slice();
      drawArray([j, j + 1]);
      updateChart(algoIndex, cmpCount, performance.now() - start);
      await new Promise(r => setTimeout(r, delay));
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
  }
  array = a.slice();
  drawArray([], algoColors["bubble"]);
  document.getElementById("status").innerText = `버블 정렬 완료 | 비교: ${cmpCount} | 시간: ${(performance.now() - start).toFixed(2)}ms`;
}

async function selectionSort(a, algoIndex) {
  a = a.slice();
  let cmp = 0;
  const start = performance.now();
  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      cmp++;
      cmpCount++;
      array = a.slice();
      drawArray([min, j]);
      updateChart(algoIndex, cmpCount, performance.now() - start);
      await new Promise(r => setTimeout(r, delay));
      if (a[j] < a[min]) min = j;
    }
    [a[i], a[min]] = [a[min], a[i]];
  }
  array = a.slice();
  drawArray([], algoColors["selection"]);
  document.getElementById("status").innerText = `선택 정렬 완료 | 비교: ${cmpCount} | 시간: ${(performance.now() - start).toFixed(2)}ms`;
}

async function insertionSort(a, algoIndex) {
  a = a.slice();
  let cmp = 0;
  const start = performance.now();
  for (let i = 1; i < a.length; i++) {
    let key = a[i], j = i - 1;
    while (j >= 0 && a[j] > key) {
      cmp++;
      cmpCount++;
      a[j + 1] = a[j];
      array = a.slice();
      drawArray([j, j + 1]);
      updateChart(algoIndex, cmpCount, performance.now() - start);
      await new Promise(r => setTimeout(r, delay));
      j--;
    }
    a[j + 1] = key;
  }
  array = a.slice();
  drawArray([], algoColors["insertion"]);
  document.get
