let originalArray = [];
let array = [];
let delay = 20;
const charts = {};

const algoColors = {
    bubble: "#007bff",
    selection: "#28a745",
    insertion: "#ffc107",
    quick: "#dc3545",
    merge: "#6f42c1"
};

const algoNames = ["버블", "선택", "삽입", "퀵", "병합"];
const algoList = ["bubble", "selection", "insertion", "quick", "merge"];
let overallChartData = {};

function $id(id) { return document.getElementById(id); }

function generateArray() {
    const inputVal = Number($id("arraySize").value);
    const size = Number.isInteger(inputVal) ? Math.max(5, Math.min(200, inputVal)) : 30;

    originalArray = Array.from({ length: size }, (_, i) => i + 1);
    for (let i = size - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [originalArray[i], originalArray[j]] = [originalArray[j], originalArray[i]];
    }

    array = originalArray.slice();
    overallChartData = {};
    initAllCharts();
    drawArray();
    $id("status").innerText = "현재 알고리즘: 없음";
}

function drawArray(highlight = [], finalColor = null, currentAlgoColor = '#007bff') {
    const container = $id("arrayContainer");
    container.innerHTML = "";
    if (!array || array.length === 0) return;

    const max = Math.max(...array, 1);
    const containerWidth = container.clientWidth || 800;
    const barWidth = Math.max(2, Math.floor(containerWidth / array.length) - 2);

    array.forEach((value, index) => {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.flex = `0 0 ${barWidth}px`;
        const h = Math.max(4, Math.round((value / max) * (container.clientHeight - 10)));
        bar.style.height = `${h}px`;

        if (finalColor) {
            bar.style.backgroundColor = finalColor;
        } else if (highlight && highlight.includes(index)) {
            bar.style.backgroundColor = "#dc3545";
        } else {
            bar.style.background = `linear-gradient(to top, ${currentAlgoColor}, ${currentAlgoColor}80)`;
        }

        const num = document.createElement("span");
        num.innerText = value;
        bar.appendChild(num);

        container.appendChild(bar);
    });
}

function initChart(canvasId, algoName, algoColor) {
    const canvas = $id(canvasId);
    if (!canvas) return;

    if (charts[canvasId]) charts[canvasId].destroy();

    const ctx = canvas.getContext("2d");
    charts[canvasId] = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [{
                label: algoName,
                data: [],
                borderColor: algoColor,
                tension: 0.1,
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { type: "linear", min: 0, title: { display: true, text: "시간(ms)" } },
                y: { beginAtZero: true, title: { display: true, text: "비교 횟수" } }
            }
        }
    });
}

function initOverallChart() {
    const canvas = $id("overallChart");
    if (!canvas) return;
    if (charts["overallChart"]) charts["overallChart"].destroy();
    
    const ctx = canvas.getContext("2d");
    charts["overallChart"] = new Chart(ctx, {
        type: "line",
        data: {
            datasets: algoList.map((algo, i) => ({
                label: algoNames[i],
                data: [],
                borderColor: algoColors[algo],
                tension: 0.1,
                fill: false,
                pointRadius: 0
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: { legend: { display: true } },
            scales: {
                x: { type: "linear", min: 0, title: { display: true, text: "시간(ms)" } },
                y: { beginAtZero: true, title: { display: true, text: "비교 횟수" } }
            }
        }
    });
}

function initAllCharts() {
    algoList.forEach((algo, i) => {
        initChart(`${algo}Chart`, `${algoNames[i]} 정렬`, algoColors[algo]);
    });
    initOverallChart();
}

function updateChart(algoName, cmp, time) {
    const chartId = `${algoName}Chart`;
    if (!charts[chartId]) return;
    charts[chartId].data.datasets[0].data.push({ x: time, y: cmp });
    charts[chartId].update("none");
}

function updateOverallChart(algoName, cmp, time) {
    const algoIndex = algoList.indexOf(algoName);
    if (!charts["overallChart"] || algoIndex === -1) return;
    charts["overallChart"].data.datasets[algoIndex].data.push({ x: time, y: cmp });
    charts["overallChart"].update("none");
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function bubbleSort(a) {
    const algoName = "bubble";
    const algoColor = algoColors[algoName];
    a = a.slice();
    const start = performance.now();
    let cmp = 0;
    for (let i = 0; i < a.length - 1; i++) {
        for (let j = 0; j < a.length - i - 1; j++) {
            cmp++;
            array = a.slice();
            drawArray([j, j + 1], algoColor, algoColor);
            updateChart(algoName, cmp, performance.now() - start);
            updateOverallChart(algoName, cmp, performance.now() - start);
            await sleep(delay);
            if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
        }
    }
    array = a.slice();
    drawArray([], algoColor, algoColor);
    $id("status").innerText = `버블 정렬 완료 | 비교: ${cmp} | 시간: ${(performance.now() - start).toFixed(2)}ms`;
}

async function selectionSort(a) {
    const algoName = "selection";
    const algoColor = algoColors[algoName];
    a = a.slice();
    const start = performance.now();
    let cmp = 0;
    for (let i = 0; i < a.length - 1; i++) {
        let min = i;
        for (let j = i + 1; j < a.length; j++) {
            cmp++;
            array = a.slice();
            drawArray([min, j], algoColor, algoColor);
            updateChart(algoName, cmp, performance.now() - start);
            updateOverallChart(algoName, cmp, performance.now() - start);
            await sleep(delay);
            if (a[j] < a[min]) min = j;
        }
        [a[i], a[min]] = [a[min], a[i]];
    }
    array = a.slice();
    drawArray([], algoColor, algoColor);
    $id("status").innerText = `선택 정렬 완료 | 비교: ${cmp} | 시간: ${(performance.now() - start).toFixed(2)}ms`;
}

async function insertionSort(a) {
    const algoName = "insertion";
    const algoColor = algoColors[algoName];
    a = a.slice();
    const start = performance.now();
    let cmp = 0;
    for (let i = 1; i < a.length; i++) {
        let key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) {
            cmp++;
            a[j + 1] = a[j];
            array = a.slice();
            drawArray([j, j + 1], algoColor, algoColor);
            updateChart(algoName, cmp, performance.now() - start);
            updateOverallChart(algoName, cmp, performance.now() - start);
            await sleep(delay);
            j--;
        }
        a[j + 1] = key;
    }
    array = a.slice();
    drawArray([], algoColor, algoColor);
    $id("status").innerText = `삽입 정렬 완료 | 비교: ${cmp} | 시간: ${(performance.now() - start).toFixed(2)}ms`;
}

async function quickSort(a) {
    const algoName = "quick";
    const algoColor = algoColors[algoName];
    a = a.slice();
    const start = performance.now();
    let cmp = 0;
    async function qs(l, r) {
        if (l >= r) return;
        let pivot = a[r], i = l;
        for (let j = l; j < r; j++) {
            cmp++;
            array = a.slice();
            drawArray([i, j, r], algoColor, algoColor);
            updateChart(algoName, cmp, performance.now() - start);
            updateOverallChart(algoName, cmp, performance.now() - start);
            await sleep(delay);
            if (a[j] < pivot) { [a[i], a[j]] = [a[j], a[i]]; i++; }
        }
        [a[i], a[r]] = [a[r], a[i]];
        await qs(l, i - 1);
        await qs(i + 1, r);
    }
    await qs(0, a.length - 1);
    array = a.slice();
    drawArray([], algoColor, algoColor);
    $id("status").innerText = `퀵 정렬 완료 | 비교: ${cmp} | 시간: ${(performance.now() - start).toFixed(2)}ms`;
}

async function mergeSort(a) {
    const algoName = "merge";
    const algoColor = algoColors[algoName];
    a = a.slice();
    const start = performance.now();
    let cmp = 0;
    async function ms(l, r) {
        if (r - l <= 1) return a.slice(l, r);
        const m = Math.floor((l + r) / 2);
        const left = await ms(l, m);
        const right = await ms(m, r);
        let merged = [], i = 0, j = 0;
        while (i < left.length && j < right.length) {
            cmp++;
            merged.push(left[i] < right[j] ? left[i++] : right[j++]);
            array = a.slice();
            drawArray([], algoColor, algoColor);
            updateChart(algoName, cmp, performance.now() - start);
            updateOverallChart(algoName, cmp, performance.now() - start);
            await sleep(delay);
        }
        merged = merged.concat(left.slice(i)).concat(right.slice(j));
        for (let k = l; k < r; k++) a[k] = merged[k - l];
        return merged;
    }
    await ms(0, a.length);
    array = a.slice();
    drawArray([], algoColor, algoColor);
    $id("status").innerText = `병합 정렬 완료 | 비교: ${cmp} | 시간: ${(performance.now() - start).toFixed(2)}ms`;
}

async function runAll() {
    try {
        $id("runBtn").disabled = true;
        $id("newBtn").disabled = true;
        initAllCharts();
        
        for (let i = 0; i < algoList.length; i++) {
            const currentAlgo = algoList[i];
            array = originalArray.slice();
            $id("status").innerText = `현재 알고리즘: ${algoNames[i]} 정렬`;

            if (currentAlgo === "bubble") await bubbleSort(array);
            else if (currentAlgo === "selection") await selectionSort(array);
            else if (currentAlgo === "insertion") await insertionSort(array);
            else if (currentAlgo === "quick") await quickSort(array);
            else if (currentAlgo === "merge") await mergeSort(array);
            
            await sleep(500);
        }
        $id("status").innerText = "모든 정렬 완료!";
        drawArray([], 'linear-gradient(to top, #007bff,#66b3ff)'); // 기본 색상으로 되돌리기
    } catch (err) {
        console.error(err);
        $id("status").innerText = "오류 발생 — 콘솔 확인";
    } finally {
        $id("runBtn").disabled = false;
        $id("newBtn").disabled = false;
    }
}

window.addEventListener("load", () => {
    $id("runBtn").addEventListener("click", runAll);
    $id("newBtn").addEventListener("click", generateArray);
    $id("arraySize").addEventListener("change", generateArray);
    generateArray();
});
