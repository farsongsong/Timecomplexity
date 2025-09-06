 let originalArray = [];
let array = [];
let delay = 20;
let chart;
let cmpCount = 0;
let startTime = 0;

const algoColors = {
  bubble: "#007bff",
  selection: "#28a745",
  insertion: "#ffc107",
  quick: "#dc3545",
  merge: "#6f42c1"
};

const algoNames = ["버블", "선택", "삽입", "퀵", "병합"];
const algoList = ["bubble","selection","insertion","quick","merge"];

// 배열 생성
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
function drawArray(highlight=[], finalColor=null, algoColor=null) {
  const container = document.getElementById("arrayContainer");
  container.innerHTML = "";
  array.forEach((value,index)=>{
    const bar = document.createElement("div");
    bar.className="bar";
    bar.style.height=`${value*2}px`;

    if(highlight.includes(index)) bar.style.backgroundColor="#dc3545";
    else if(finalColor) bar.style.backgroundColor = finalColor;
    else if(algoColor) bar.style.backgroundColor = algoColor;

    const num = document.createElement("span");
    num.innerText = value;
    num.style.color = algoColor || "#222";
    bar.appendChild(num);

    container.appendChild(bar);
  });
}

// ------------------- 그래프 -------------------

function initChart(){
  const ctx = document.getElementById("chart").getContext("2d");
  if(chart) chart.destroy();
  chart = new Chart(ctx,{
    type:"line",
    data:{
      datasets: algoList.map((algo,i)=>({
        label: algoNames[i],
        data: [],
        borderColor: algoColors[algo],
        borderWidth: 2,
        fill:false,
        pointRadius:0
      }))
    },
    options:{
      responsive:true,
      animation:false,
      plugins:{legend:{display:true}},
      scales:{
        x:{type:"linear", title:{display:true, text:"시간(ms)"}},
        y:{beginAtZero:true, title:{display:true, text:"비교 횟수"}}
      }
    }
  });
}

function updateChart(algoIndex, cmp){
  const now = performance.now();
  chart.data.datasets[algoIndex].data.push({x: now-startTime, y: cmp});
  chart.update('none');
}

// ------------------- 정렬 알고리즘 -------------------

async function bubbleSort(a, algoIndex){
  a=a.slice(); cmpCount=0; startTime=performance.now();
  for(let i=0;i<a.length-1;i++){
    for(let j=0;j<a.length-i-1;j++){
      cmpCount++;
      array=a.slice(); drawArray([j,j+1], null, algoColors["bubble"]);
      updateChart(algoIndex, cmpCount);
      await new Promise(r=>setTimeout(r,delay));
      if(a[j]>a[j+1]) [a[j],a[j+1]]=[a[j+1],a[j]];
    }
  }
  array=a.slice(); drawArray([], algoColors["bubble"]);
  document.getElementById("status").innerText=`버블 정렬 완료 | 비교: ${cmpCount} | 시간: ${(performance.now()-startTime).toFixed(2)}ms`;
}

async function selectionSort(a, algoIndex){
  a=a.slice(); cmpCount=0; startTime=performance.now();
  for(let i=0;i<a.length-1;i++){
    let min=i;
    for(let j=i+1;j<a.length;j++){
      cmpCount++;
      array=a.slice(); drawArray([min,j], null, algoColors["selection"]);
      updateChart(algoIndex, cmpCount);
      await new Promise(r=>setTimeout(r,delay));
      if(a[j]<a[min]) min=j;
    }
    [a[i],a[min]]=[a[min],a[i]];
  }
  array=a.slice(); drawArray([], algoColors["selection"]);
  document.getElementById("status").innerText=`선택 정렬 완료 | 비교: ${cmpCount} | 시간: ${(performance.now()-startTime).toFixed(2)}ms`;
}

async function insertionSort(a, algoIndex){
  a=a.slice(); cmpCount=0; startTime=performance.now();
  for(let i=1;i<a.length;i++){
    let key=a[i], j=i-1;
    while(j>=0 && a[j]>key){
      cmpCount++;
      a[j+1]=a[j];
      array=a.slice(); drawArray([j,j+1], null, algoColors["insertion"]);
      updateChart(algoIndex, cmpCount);
      await new Promise(r=>setTimeout(r,delay));
      j--;
    }
    a[j+1]=key;
  }
  array=a.slice(); drawArray([], algoColors["insertion"]);
  document.getElementById("status").innerText=`삽입 정렬 완료 | 비교: ${cmpCount} | 시간: ${(performance.now()-startTime).toFixed(2)}ms`;
}

async function quickSort(a, algoIndex){
  a=a.slice(); cmpCount=0; startTime=performance.now();
  async function qs(l,r){
    if(l>=r) return;
    let pivot=a[r], i=l;
    for(let j=l;j<r;j++){
      cmpCount++;
      array=a.slice(); drawArray([i,j,r], null, algoColors["quick"]);
      updateChart(algoIndex, cmpCount);
      await new Promise(r=>setTimeout(r,delay));
      if(a[j]<pivot) [a[i],a[j]]=[
