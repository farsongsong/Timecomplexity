let originalArray = [];
let array = [];
let delay = 20;
let charts = {};
let cmpCount = 0;
let startTime;

const algoColors = {
  bubble:"#007bff",
  selection:"#28a745",
  insertion:"#ffc107",
  quick:"#dc3545",
  merge:"#6f42c1"
};

const algoNames=["버블","선택","삽입","퀵","병합"];
const algoList=["bubble","selection","insertion","quick","merge"];
let currentColor = "#007bff";

// ---------------- 배열 ----------------
function generateArray(){
  const size = parseInt(document.getElementById("arraySize").value);
  originalArray = Array.from({length:size},(_,i)=>i+1);
  for(let i=size-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [originalArray[i],originalArray[j]]=[originalArray[j],originalArray[i]];
  }
  array=originalArray.slice();
  drawArray();
  cmpCount=0;
  initCharts();
  document.getElementById("status").innerText="현재 알고리즘: 없음";
}

function drawArray(highlight=[], finalColor=null){
  const container=document.getElementById("arrayContainer");
  container.innerHTML="";
  array.forEach((value,index)=>{
    const bar=document.createElement("div");
    bar.className="bar";
    bar.style.height=`${value*2}px`;
    if(highlight.includes(index)) bar.style.backgroundColor="#dc3545";
    else if(finalColor) bar.style.backgroundColor=finalColor;
    else bar.style.backgroundColor=currentColor;

    const num=document.createElement("span");
    num.innerText=value;
    bar.appendChild(num);

    container.appendChild(bar);
  });
}

// ---------------- 차트 ----------------
function initCharts(){
  algoList.forEach((algo,i)=>{
    const ctx = document.getElementById(`chart_${algo}`).getContext("2d");
    charts[algo] = new Chart(ctx,{
      type:"line",
      data:{datasets:[{
        label:algoNames[i],
        data:[],
        borderColor:algoColors[algo],
        fill:false,
        pointRadius:2,
        tension:0.2
      }]},
      options:{
        responsive:true, animation:false,
        plugins:{legend:{display:true}},
        scales:{
          x:{type:"linear", title:{display:true,text:"시간(ms)"}},
          y:{beginAtZero:true,title:{display:true,text:"비교 횟수"}}
        }
      }
    });
  });
}

function updateChart(algo, cmp){
  const now = performance.now()-startTime;
  charts[algo].data.datasets[0].data.push({x:now,y:cmp});
  charts[algo].update('none');
}

// ---------------- 정렬 ----------------
async function bubbleSort(a){
  a=a.slice(); cmpCount=0; startTime=performance.now();
  currentColor=algoColors["bubble"];
  document.getElementById("status").innerText="버블 정렬 실행 중...";
  for(let i=0;i<a.length-1;i++){
    for(let j=0;j<a.length-i-1;j++){
      cmpCount++;
      array=a.slice(); drawArray([j,j+1],currentColor);
      updateChart("bubble",cmpCount);
      await new Promise(r=>setTimeout(r,delay));
      if(a[j]>a[j+1]) [a[j],a[j+1]]=[a[j+1],a[j]];
    }
  }
  array=a.slice(); drawArray([],currentColor);
  document.getElementById("status").innerText=`버블 정렬 완료 | 비교:${cmpCount} | 시간:${(performance.now()-startTime).toFixed(2)}ms`;
}

async function selectionSort(a){
  a=a.slice(); cmpCount=0; startTime=performance.now();
  currentColor=algoColors["selection"];
  document.getElementById("status").innerText="선택 정렬 실행 중...";
  for(let i=0;i<a.length-1;i++){
    let min=i;
    for(let j=i+1;j<a.length;j++){
      cmpCount++;
      array=a.slice(); drawArray([min,j],currentColor);
      updateChart("selection",cmpCount);
      await new Promise(r=>setTimeout(r,delay));
      if(a[j]<a[min]) min=j;
    }
    [a[i],a[min]]=[a[min],a[i]];
  }
  array=a.slice(); drawArray([],currentColor);
  document.getElementById("status").innerText=`선택 정렬 완료 | 비교:${cmpCount} | 시간:${(performance.now()-startTime).toFixed(2)}ms`;
}

async function insertionSort(a){
  a=a.slice(); cmpCount=0; startTime=performance.now();
  currentColor=algoColors["insertion"];
  document.getElementById("status").innerText="삽입 정렬 실행 중...";
  for(let i=1;i<a.length;i++){
    let key=a[i], j=i-1;
    while(j>=0 && a[j]>key){
      cmpCount++;
      a[j+1]=a[j];
      array=a.slice(); drawArray([j,j+1],currentColor);
      updateChart("insertion",cmpCount);
      await new Promise(r=>setTimeout(r,delay));
      j--;
    }
    a[j+1]=key;
  }
  array=a.slice(); drawArray([],currentColor);
  document.getElementById("status").innerText=`삽입 정렬 완료 | 비교:${cmpCount} | 시간:${(performance.now()-startTime).toFixed(2)}ms`;
}

async function quickSort(a){
  a=a.slice(); cmpCount=0; startTime=performance.now();
  currentColor=algoColors["quick"];
  document.getElementById("status").innerText="퀵 정렬 실행 중...";
  async function qs(l,r){
    if(l>=r) return;
    let pivot=a[r], i=l;
    for(let j=l;j<r;j++){
      cmpCount++;
      array=a.slice(); drawArray([i,j,r],currentColor);
      updateChart("quick",cmpCount);
      await new Promise(r=>setTimeout(r,delay));
      if(a[j]<pivot) [a[i],a[j]]=[a[j],a[i]],i++;
    }
    [a[i],a[r]]=[a[r],a[i]];
    await qs(l,i-1); 
    await qs(i+1,r);
  }
  await qs(0,a.length-1);
  array=a.slice(); drawArray([],currentColor);
  document.getElementById("status").innerText=`퀵 정렬 완료 | 비교:${cmpCount} | 시간:${(performance.now()-startTime).toFixed(2)}ms`;
}

async function mergeSort(a){
  a=a.slice(); cmpCount=0; startTime=performance.now();
  currentColor=algoColors["merge"];
  document.getElementById("status").innerText="병합 정렬 실행 중...";
  async function ms(l,r){
    if(r-l<=1) return a.slice(l,r);
    const m=Math.floor((l+r)/2);
    const left=await ms(l,m);
    const right=await ms(m,r);
    let merged=[],i=0,j=0;
    while(i<left.length && j<right.length){
      cmpCount++;
      if(left[i]<right[j]) merged.push(left[i++]);
      else merged.push(right[j++]);
      for(let k=l;k<r;k++) a[k]=(merged[k-l]||0);
      array=a.slice(); drawArray([],currentColor);
      updateChart("merge",cmpCount);
      await new Promise(r=>setTimeout(r,delay));
    }
    merged=merged.concat(left.slice(i)).concat(right.slice(j));
    for(let k=l;k<r;k++) a[k]=merged[k-l];
    return merged;
  }
  await ms(0,a.length);
  array=a.slice(); drawArray([],currentColor);
  document.getElementById("status").innerText=`병합 정렬 완료 | 비교:${cmpCount} | 시간:${(performance.now()-startTime).toFixed(2)}ms`;
}

// ---------------- 순차 실행 ----------------
async function runAll(){
  generateArray();
  await bubbleSort(array);
  await selectionSort(array);
  await insertionSort(array);
  await quickSort(array);
  await mergeSort(array);
}

// ---------------- 이벤트 ----------------
document.getElementById("startBtn").addEventListener("click", runAll);
document.getElementById("newBtn").addEventListener("click", generateArray);
window.onload=generateArray;
