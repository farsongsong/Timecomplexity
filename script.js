let originalArray = [];
let array = [];
let delay = 30;
let chart;

function generateArray() {
  const size = parseInt(document.getElementById("arraySize").value);
  originalArray = Array.from({length:size}, (_,i)=>i+1);
  for (let i=size-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [originalArray[i],originalArray[j]]=[originalArray[j],originalArray[i]];
  }
  array = originalArray.slice();
  drawArray();
}

function drawArray(highlight=[]) {
  const container = document.getElementById("arrayContainer");
  container.innerHTML="";
  array.forEach((value,index)=>{
    const bar = document.createElement("div");
    bar.className="bar";
    bar.style.height=`${value*2}px`;
    if(highlight.includes(index)) bar.style.backgroundColor="#dc3545";

    const num = document.createElement("span");
    num.innerText = value;
    bar.appendChild(num);

    container.appendChild(bar);
  });
}

// 정렬 알고리즘
async function bubbleSort(a){
  let cmp=0;
  a=a.slice();
  for(let i=0;i<a.length-1;i++){
    for(let j=0;j<a.length-i-1;j++){
      cmp++;
      array = a.slice(); drawArray([j,j+1]);
      await new Promise(r=>setTimeout(r,delay));
      if(a[j]>a[j+1]) [a[j],a[j+1]]=[a[j+1],a[j]];
    }
  }
  array=a.slice(); drawArray();
  return cmp;
}

async function selectionSort(a){
  let cmp=0;
  a=a.slice();
  for(let i=0;i<a.length-1;i++){
    let min=i;
    for(let j=i+1;j<a.length;j++){
      cmp++;
      array=a.slice(); drawArray([min,j]);
      await new Promise(r=>setTimeout(r,delay));
      if(a[j]<a[min]) min=j;
    }
    [a[i],a[min]]=[a[min],a[i]];
  }
  array=a.slice(); drawArray();
  return cmp;
}

async function insertionSort(a){
  let cmp=0;
  a=a.slice();
  for(let i=1;i<a.length;i++){
    let key=a[i],j=i-1;
    while(j>=0 && a[j]>key){
      cmp++;
      a[j+1]=a[j];
      array=a.slice(); drawArray([j,j+1]);
      await new Promise(r=>setTimeout(r,delay));
      j--;
    }
    a[j+1]=key;
  }
  array=a.slice(); drawArray();
  return cmp;
}

async function quickSort(a){
  let cmp=0;
  a=a.slice();
  async function qs(l,r){
    if(l>=r) return;
    let pivot=a[r],i=l;
    for(let j=l;j<r;j++){
      cmp++;
      array=a.slice(); drawArray([i,j,r]);
      await new Promise(r=>setTimeout(r,delay));
      if(a[j]<pivot) [a[i],a[j]]=[a[j],a[i]],i++;
    }
    [a[i],a[r]]=[a[r],a[i]];
    await qs(l,i-1); await qs(i+1,r);
  }
  await qs(0,a.length-1);
  array=a.slice(); drawArray();
  return cmp;
}

async function mergeSort(a){
  let cmp=0;
  a=a.slice();
  async function ms(l,r){
    if(r-l<=1) return a.slice(l,r);
    const m=Math.floor((l+r)/2);
    const left=await ms(l,m), right=await ms(m,r);
    let merged=[],i=0,j=0;
    while(i<left.length && j<right.length){
      cmp++;
      merged.push(left[i]<right[j]?left[i++] : right[j++]);
    }
    merged=merged.concat(left.slice(i)).concat(right.slice(j));
    for(let k=l;k<r;k++) a[k]=merged[k-l];
    array=a.slice(); drawArray(); await new Promise(r=>setTimeout(r,delay));
    return merged;
  }
  await ms(0,a.length);
  array=a.slice(); drawArray();
  return cmp;
}

// 실행
async function runSelected(){
  const algo = document.getElementById("algoSelect").value;
  array = originalArray.slice();
  let cmp=0;

  if(algo==="bubble") cmp=await bubbleSort(array);
  if(algo==="selection") cmp=await selectionSort(array);
  if(algo==="insertion") cmp=await insertionSort(array);
  if(algo==="quick") cmp=await quickSort(array);
  if(algo==="merge") cmp=await mergeSort(array);

  document.getElementById("status").innerText=`현재 알고리즘: ${document.getElementById("algoSelect").selectedOptions[0].text}, 비교 횟수: ${cmp}`;
}

async function compareAll(){
  let results={};
  results["버블"]=await bubbleSort(originalArray.slice());
  results["선택"]=await selectionSort(originalArray.slice());
  results["삽입"]=await insertionSort(originalArray.slice());
  results["퀵"]=await quickSort(originalArray.slice());
  results["병합"]=await mergeSort(originalArray.slice());
  drawChart(results);
}

function drawChart(results){
  const ctx=document.getElementById("chart").getContext("2d");
  if(chart) chart.destroy();
  chart=new Chart(ctx,{
    type:"bar",
    data:{
      labels:Object.keys(results),
      datasets:[{
        label:"비교 횟수",
        data:Object.values(results),
        backgroundColor:["#007bff","#28a745","#ffc107","#dc3545","#6f42c1"]
      }]
    },
    options:{
      responsive:true,
      plugins:{
        legend:{display:false},
        title:{display:true,text:"정렬 알고리즘 비교",font:{size:18}}
      }
    }
  });
}

window.onload=generateArray;
