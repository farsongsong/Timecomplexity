let array = [];
const size = 30;

// 배열 생성
function generateArray() {
  array = [];
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 100) + 1);
  }
  drawArray(array);
}

// 배열 시각화
function drawArray(arr, highlights = []) {
  const container = document.getElementById("arrayContainer");
  container.innerHTML = "";
  arr.forEach((value, idx) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value * 2.5}px`;
    bar.style.width = `${600 / size}px`;
    if (highlights.includes(idx)) bar.style.background = "tomato";
    container.appendChild(bar);
  });
}

// 버블 정렬
async function bubbleSort(arr) {
  let copy = [...arr];
  let steps = 0;
  for (let i = 0; i < copy.length; i++) {
    for (let j = 0; j < copy.length - i - 1; j++) {
      steps++;
      if (copy[j] > copy[j+1]) {
        [copy[j], copy[j+1]] = [copy[j+1], copy[j]];
      }
      drawArray(copy, [j, j+1]);
      await sleep(20);
    }
  }
  return steps;
}

// 선택 정렬
async function selectionSort(arr) {
  let copy = [...arr];
  let steps = 0;
  for (let i = 0; i < copy.length; i++) {
    let min = i;
    for (let j = i+1; j < copy.length; j++) {
      steps++;
      if (copy[j] < copy[min]) min = j;
      drawArray(copy, [i, j]);
      await sleep(20);
    }
    [copy[i], copy[min]] = [copy[min], copy[i]];
  }
  return steps;
}

// 삽입 정렬
async function insertionSort(arr) {
  let copy = [...arr];
  let steps = 0;
  for (let i = 1; i < copy.length; i++) {
    let key = copy[i];
    let j = i - 1;
    while (j >= 0 && copy[j] > key) {
      steps++;
      copy[j+1] = copy[j];
      j--;
      drawArray(copy, [j, j+1]);
      await sleep(20);
    }
    copy[j+1] = key;
  }
  return steps;
}

// 실행
async function runAll() {
  generateArray();
  let results = {};

  results["버블"] = await bubbleSort(array);
  results["선택"] = await selectionSort(array);
  results["삽입"] = await insertionSort(array);

  drawChart(results);
}

// Chart.js 성능 그래프
function drawChart(results) {
  const ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(results),
      datasets: [{
        label: "비교 횟수",
        data: Object.values(results),
        backgroundColor: ["#007bff", "#28a745", "#ffc107"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

// 유틸
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 초기 실행
window.onload = generateArray;
