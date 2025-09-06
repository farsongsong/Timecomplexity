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

// ------------------- 정렬 알고리즘 -------------------

async function bubbleSort(a){
  a=a.slice(); let cmp=0; const start=performance.now();
  for(let i=0;i<a.length-1;i++){
    for(let j=0;j<a.length-i-1;j++){
      cmp++; cmpCount++;
      array=a.slice(); drawArray([j,j+1]); updateChart(cmpCount);
      await new Promise(r=>setTimeout(r,delay));
      if(a[j]>a[j+1]) [a[j],a[j+1]]=[a[j+1],a[j]];
    }
  }
  const end = performance.now();
  array=a.slice(); drawArray([], algoColors["bubble"]);
  document.getElementById("status").innerText=`버블 정렬 완료 | 비교: ${cmpCount} | 시간: ${(end-start).toFixed(2)}ms`;
}

async function selectionSort(a){
  a=a.slice(); let cmp=0; const start=performance.now();
  for(let i=0;i<a.length-1;i++){
    let min=i;
    for(let j=i+1;j<a.length;j++){
      cmp++; cmpCount++;
      array=a.slice(); drawArray([min,j]); updateChart(cmpCount);
      await new Promise(r=>setTimeout(r,delay));
      if(a[j]<a[min]) min=j;
    }
    [a[i],a[min]]=[a[min],a[i]];
  }
  const end = performance.now();
  array=a.slice(); drawArray([], algoColors["selection"]);
  document.getElementById("status").innerText=`선택 정렬 완료 | 비교: ${cmpCount} | 시간: ${(end-start).toFixed(2)}ms`;
}

async function insertionSort(a){
  a=a.slice(); let cmp=0; const start=performance.now();
  for(let i=1;i<a.length;i++){
    let key=a[i], j=i-1;
    while(j>=0 && a[j]>key){
      cmp++; cmpCount++;
      a[j+1]=a[j];
      array=a.slice(); drawArray([j,j+1]); updateChart(cmpCount);
      await new Promise(r=>setTimeout(r,delay));
      j--;
    }
    a[j+1]=key;
  }
  const end = performance.now();
  array=a.slice(); drawArray([], algoColors["insertion"]);
  document.getElementById("status").innerText=`삽입 정렬 완료 | 비교: ${cmpCount} | 시간: ${(end-start).toFixed(2)}ms`;
}

async function quickSort(a){
  a=a.slice(); let cmp=0; const start=performance.now();
  async function qs(l,r){
    if(l>=r) return;
    let pivot=a[r], i=l;
    for(let j=l;j<r;j++){
      cmp++; cmpCount++;
      array=a.slice(); drawArray([i,j,r]); updateChart(cmpCount);
      await new Promise(r=>setTimeout(r,delay));
      if(a[j]<pivot) [a[i],a[j]]=[a[j],a[i]], i++;
    }
    [a[i],a[r]]=[a[r],a[i]];
    await qs(l,i-1); await qs(i+1,r);
  }
  await qs(0,a.length-1);
  const end = performance.now();
  array=a.slice(); drawArray([], algoColors["quick"]);
  document.getElementById("status").innerText=`퀵 정렬 완료 | 비교: ${cmpCount} | 시간: ${(end-start).toFixed(2)}ms`;
}

async function mergeSort(a){
  a=a.slice(); let cmp=0; const start=performance.now();
  async function ms(l,r){
    if(r-l<=1) return a.slice(l,r);
    const m=Math.floor((l+r)/2);
    const left=await ms(l,m);
    const right=await ms(m,r);
    let merged=[], i=0, j=0;
    while(i<left.length && j<right.length){
      cmp++; cmpCount++;
      merged.push(left[i]<right[j]?left[i++]:right[j++]);
      array=a.slice(); drawArray([], algoColors["merge"]); updateChart(cmpCount);
      await new Promise(r=>setTimeout(r,delay));
    }
    merged=merged.concat(left.slice(i)).concat(right.slice(j));
    for(let k=l;k<r;k++) a[k]=merged[k-l];
    return merged;
  }
  await ms(0,a.length);
  const end = performance.now();
  array=a.slice(); drawArray([], algoColors["merge"]);
  document.getElementById("status").innerText=`병합 정렬 완료 | 비교: ${cmpCount} | 시간: ${(end-start).toFixed(2)}ms`;
}

// ------------------- 순차 실행 -------------------

async function runAll(){
  generateArray();
  const algos = [bubbleSort, selectionSort, insertionSort, quickSort, mergeSort];
  const names = ["버블", "선택", "삽입", "퀵", "병합"];

  for(let i=0;i<algos.length;i++){
    array = originalArray.slice();
    document.getElementById("status").innerText = `현재 알고리즘: ${names[i]} 정렬`;
    cmpCount = 0;
    await algos[i](array);
    await new Promise(r=>setTimeout(r,500)); // 잠깐 쉬기
  }
  document.getElementById("status").innerText = "모든 정렬 완료!";
}

window.onload = generateArray;
