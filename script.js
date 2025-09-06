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

function generateArray() {
  const size = parseInt(document.getElementById("arraySize").value);
  originalArray = Array.from({length:size}, (_,i)=>i+1);
  for (let i=size-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [originalArray[i],originalArray[j]]=[originalArray[j],originalArray[i]];
  }
  array = originalArray.slice();
  drawArray();
  cmpCount = 0;
  initChart();
  document.getElementById("status").innerText = "현재 알고리즘: 없음";
}

// 막대 그리기
function drawArray(highlight=[], finalColor=null) {
  const container = document.getElementById("arrayContainer");
  container.innerHTML = "";
  array.forEach((value,index)=>{
    const bar = document.createElement("div");
    bar.className="bar";
    bar.style.height=`${value*2}px`;
    if(highlight.includes(index)) bar.style.backgroundColor="#dc3545";
    else if(finalColor) bar.style.backgroundColor = finalColor;

    const num = document.createElement("span");
    num.innerText = value;
    bar.appendChild(num);

    container.appendChild(bar);
  });
}

// 실시간 그래프 초기화
function initChart(){
  const ctx = document.getElementById("chart").getContext("2d");
  if(chart) chart.destroy();
  chart = new Chart(ctx,{
    type:"line",
    data:{
      labels: [],
      datasets:[{
        label:"비교 횟수",
        data: [],
        borderColor:"#007bff",
        borderWidth:2,
        fill:false
      }]
    },
    options:{
      responsive:true,
      animation:false,
      plugins:{legend:{display:true}},
      scales:{y:{beginAtZero:true}}
    }
  });
}

// 그래프 업데이트
function updateChart(cmp){
  chart.data.labels.push(chart.data.labels.length+1);
  chart.data.datasets[0].data.push(cmp);
  chart.update('none');
}

// 정렬 알고리즘
async function bubbleSort(a){
  let cmp=0;
  a=a.slice();
  const start = performance.now();
  for(let i=0;i<a.length-1;i++){
    for(let j=0;j<a.length-i-1;j++){
      cmp++; cmpCount++;
      array = a.slice(); drawArray([j,j+1]); updateChart(cmpCount);
      await new Promise(r=>setTimeout(r,delay));
      if(a[j]>a[j+1]) [a[j],a[j+1]]=[a[j+1],a[j]];
    }
  }
  const end = performance.now();
  array=a.slice(); drawArray([], algoColors["bubble"]);
  document.getElementById("status").innerText=`버블 정렬 완료 | 비교: ${cmpCount} | 시간: ${(end-start).toFixed(2)}ms`;
}

// (다른 알고리즘들도 bubbleSort와 동일한 구조로 작성: selectionSort, insertionSort, quickSort, mergeSort)
// 아래 예시는 실행 순차 호출용
async function runAll() {
  generateArray();
  cmpCount = 0;
  const algos = ["bubble","selection","insertion","quick","merge"];
  const names = ["버블","선택","삽입","퀵","병합"];

  for(let i=0;i<algos.length;i++){
    array = originalArray.slice();
    document.getElementById("status").innerText = `현재 알고리즘: ${names[i]} 정렬`;
    cmpCount = 0;

    if(algos[i]==="bubble") await bubbleSort(array);
    if(algos[i]==="selection") await selectionSort(array);
    if(algos[i]==="insertion") await insertionSort(array);
    if(algos[i]==="quick") await quickSort(array);
    if(algos[i]==="merge") await mergeSort(array);

    await new Promise(r=>setTimeout(r,500)); // 잠깐 쉬면서 다음 알고리즘으로
  }

  document.getElementById("status").innerText = "모든 정렬 완료!";
}

// 페이지 로드 시 배열 생성
window.onload = generateArray;
