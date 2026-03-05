// EEG Monitoring System with 4 Separate Channel Graphs
let eegChart1, eegChart2, eegChart3, eegChart4, bandChart;
let eegData = [[], [], [], []];
let bandValues = [10, 15, 35, 25, 15];
let isScanning = false;
let timeStep = 0;
let sessionTime = 0;

function initEEGCharts() {
    // Initialize data arrays
    for (let i = 0; i < 4; i++) {
        eegData[i] = Array(100).fill(0);
    }

    // Channel colors
    const channelColors = ['#5e5ce6', '#0071e3', '#34c759', '#ff9500'];
    const channelLabels = ['Channel 1', 'Channel 2', 'Channel 3', 'Channel 4'];

    // Create 4 separate charts
    const createChannelChart = (canvasId, channelIndex) => {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(100).fill(''),
                datasets: [{
                    label: channelLabels[channelIndex],
                    data: eegData[channelIndex],
                    borderColor: channelColors[channelIndex],
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { 
                        min: -100, 
                        max: 100, 
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: { font: { size: 10 } }
                    },
                    x: { display: false }
                },
                plugins: { 
                    legend: { display: false }
                },
                animation: false
            }
        });
    };

    eegChart1 = createChannelChart('eegChart1', 0);
    eegChart2 = createChannelChart('eegChart2', 1);
    eegChart3 = createChannelChart('eegChart3', 2);
    eegChart4 = createChannelChart('eegChart4', 3);

    // Band chart (unchanged)
    const bandCtx = document.getElementById('bandChart').getContext('2d');
    bandChart = new Chart(bandCtx, {
        type: 'bar',
        data: {
            labels: ['Delta', 'Theta', 'Alpha', 'Beta', 'Gamma'],
            datasets: [{
                data: bandValues,
                backgroundColor: ['#5856d6', '#0071e3', '#34c759', '#ff9500', '#ff2d55'],
                borderRadius: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100, display: false },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function startLiveScan() {
    if (isScanning) return;
    isScanning = true;
    addConsoleLog('[SCAN] Initializing real-time neural link...');

    setInterval(() => {
        timeStep++;

        // Update all 4 channels
        for (let i = 0; i < 4; i++) {
            const val = Math.sin(timeStep * 0.2 + i) * 40 + (Math.random() - 0.5) * 60;
            eegData[i].push(val);
            eegData[i].shift();
        }

        // Update all charts
        eegChart1.data.datasets[0].data = eegData[0];
        eegChart1.update('none');
        
        eegChart2.data.datasets[0].data = eegData[1];
        eegChart2.update('none');
        
        eegChart3.data.datasets[0].data = eegData[2];
        eegChart3.update('none');
        
        eegChart4.data.datasets[0].data = eegData[3];
        eegChart4.update('none');

        // Update band values
        if (timeStep % 10 === 0) {
            bandValues = bandValues.map(v => Math.max(10, Math.min(60, v + (Math.random() - 0.5) * 5)));
            bandChart.data.datasets[0].data = bandValues;
            bandChart.update('none');
        }

        // Calculate stress and update brain
        const avgSignal = eegData.reduce((sum, ch) => sum + Math.abs(ch[ch.length - 1]), 0) / 4;
        const stress = Math.min(100, Math.max(0, (avgSignal / 40) * 100));
        
        document.getElementById('stress').textContent = Math.round(stress) + '%';
        
        if (stress < 30) {
            document.getElementById('stressLabel').textContent = 'Low Stress';
        } else if (stress < 60) {
            document.getElementById('stressLabel').textContent = 'Moderate Stress';
        } else {
            document.getElementById('stressLabel').textContent = 'High Stress / Cognitive Load';
        }

        // Update brain visualization
        if (typeof updateStressVisualization === 'function') {
            updateStressVisualization(stress);
        }

        // Update heart rate
        const hr = Math.round(70 + stress * 0.3 + (Math.random() - 0.5) * 5);
        document.getElementById('heartRate').textContent = hr;

        // Update signal quality
        const quality = Math.round(95 + (Math.random() - 0.5) * 6);
        document.getElementById('signalQuality').textContent = quality;

        // Update session time
        sessionTime++;
        const mins = Math.floor(sessionTime / 60);
        const secs = sessionTime % 60;
        document.getElementById('duration').textContent = 
            String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');

        // Log every 30 seconds
        if (sessionTime % 30 === 0) {
            addConsoleLog(`[DATA] Stress: ${Math.round(stress)}% | HR: ${hr} BPM | Quality: ${quality}%`);
        }
    }, 1000);
}

function replayDataset() {
    addConsoleLog('[REPLAY] Loading historical EEG dataset...');
    setTimeout(() => {
        addConsoleLog('[REPLAY] Dataset loaded - 256 samples @ 250Hz');
        startLiveScan();
    }, 1500);
}
