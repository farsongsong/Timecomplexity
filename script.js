let originalArray = [];
let array = [];
let delay = 20;
let compareCounts = [];
let times = [];

function generateArray(){
    const size = parseInt(document.getElementById('arraySize').value);
    originalArray = [];
    for(let i=1;i<=size;i++) originalArray.push(i);
    for(let i=size-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [originalArray[i],originalArray[j]]=[originalArray[j],originalArray[i]];
    }
    array=originalArray.slice();
    drawArray();
}

function drawArray(highlight=[]){
    const container=document.getElementById('arrayContainer');
    container.innerHTML='';
    array.forEach((value,index)=>{
        const bar=document.createElement('div');
        bar.className='bar';
        bar.style.height=`${value*2}px`;
        if(highlight.includes(index)) bar.style.backgroundColor='red';
        container.appendChild(bar);
    });
}

async function bubbleSort(arr){
    let cmp=0;
    let a=arr.slice();
    const n=a.length;
    for(let i=0;i<n-1;i++){
        for(let j=0;j<n-i-1;j++){
            cmp++;
            array=a.slice();
            drawArray([j,j+1]);
            await new Promise(r=>setTimeout(r,delay));
            if(a[j]>a[j+1]){
                [a[j],a[j+1]]=[a[j+1],a[j]];
                array=a.slice();
                drawArray([j,j+1]);
                await new Promise(r=>setTimeout(r,delay));
            }
        }
    }
    array=a.slice();
    drawArray();
    return cmp;
}

async function selectionSort(arr){
    let cmp=0;
    let a=arr.slice();
    const n=a.length;
    for(let i=0;i<n-1;i++){
        let min=i;
        for(let j=i+1;j<n;j++){
            cmp++;
            array=a.slice();
            drawArray([min,j]);
            await new Promise(r=>setTimeout(r,delay));
            if(a[j]<a[min]) min=j;
        }
        [a[i],a[min]]=[a[min],a[i]];
        array=a.slice();
        drawArray([i,min]);
        await new Promise(r=>setTimeout(r,delay));
    }
    return cmp;
}

async function insertionSort(arr){
    let cmp=0;
    let a=arr.slice();
    const n=a.length;
    for(let i=1;i<n;i++){
        let key=a[i];
        let j=i-1;
        while(j>=0 && a[j]>key){
            cmp++;
            a[j+1]=a[j];
            array=a.slice();
            drawArray([j,j+1]);
            await new Promise(r=>setTimeout(r,delay));
            j--;
        }
        a[j+1]=key;
        array=a.slice();
        drawArray([j+1]);
        await new Promise(r=>setTimeout(r,delay));
    }
    return cmp;
}

async function quickSort(arr){
    let cmp=0;
    let a=arr.slice();
    async function qs(start,end){
        if(start>=end) return;
        let pivot=a[end];
        let i=start;
        for(let j=start;j<end;j++){
            cmp++;
            array=a.slice();
            drawArray([i,j,end]);
            await new Promise(r=>setTimeout(r,delay));
            if(a[j]<pivot){
                [a[i],a[j]]=[a[j],a[i]];
                i++;
            }
        }
        [a[i],a[end]]=[a[end],a[i]];
        await qs(start,i-1);
        await qs(i+1,end);
    }
    await qs(0,a.length-1);
    array=a.slice();
    drawArray();
    return cmp;
}

async function mergeSort(arr){
    let cmp=0;
    let a=arr.slice();
    async function ms(l,r){
        if(r-l<=1) return a.slice(l,r);
        const m=Math.floor((l+r)/2);
        const left=await ms(l,m);
        const right=await ms(m,r);
        let merged=[],i=0,j=0;
        while(i<left.length && j<right.length){
            cmp++;
            if(left[i]<right[j]){
                merged.push(left[i]);
                i++;
            } else {
                merged.push(right[j]);
                j++;
            }
        }
        merged=merged.concat(left.slice(i)).concat(right.slice(j));
        for(let k=l;k<r;k++) a[k]=merged[k-l];
        array=a.slice();
        drawArray();
        await new Promise(r=>setTimeout(r,delay));
        return merged;
    }
    await ms(0,a.length);
    array=a.slice();
    drawArray();
    return cmp;
}

async function runAll(){
    generateArray();
    compareCounts=[]; times=[];
    const algos=['버블','선택','삽입','퀵','병합'];
    const funcs=[bubbleSort,selectionSort,insertionSort,quickSort,mergeSort];
    
    for(let i=0;i<funcs.length;i++){
        array=originalArray.slice();
        const start=performance.now();
        const cmp=await funcs[i](array);
        const end=performance.now();
        compareCounts.push(cmp);
        times.push((end-start).toFixed(2));
    }

    const ctx=document.getElementById('chart').getContext('2d');
    new Chart(ctx,{
        type:'bar',
        data:{
            labels:algos,
            datasets:[
                {label:'실행 시간(ms)', data:times, backgroundColor:'rgba(54,162,235,0.6)'},
                {label:'비교 횟수', data:compareCounts, backgroundColor:'rgba(255,99,132,0.6)'}
            ]
        },
        options:{responsive:true,scales:{y:{beginAtZero:true}}}
    });
}

window.onload=generateArray;
