const dt = 0.1;
let t = 0, isRunning = false, integralAccum = 0, intervalId = null;
const labels = [], data = [];

const ctx = document.getElementById("liveChart").getContext("2d");
const liveChart = new Chart(ctx, {
  type: "line",
  data: {
    labels,
    datasets: [{
      label: "Jugadores conectados",
      data,
      borderColor: "rgba(102,192,244,0.95)",
      backgroundColor: "rgba(102,192,244,0.12)",
      pointRadius: 0,
      tension: 0.4,
      fill: true
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400, easing: "easeOutQuad" },
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: "rgba(140,152,165,0.8)", maxRotation: 0 },
        grid:  { color: "rgba(42,71,94,0.3)" }
      },
      y: {
        ticks: { color: "rgba(140,152,165,0.8)" },
        grid:  { color: "rgba(42,71,94,0.3)" },
        beginAtZero: true
      }
    }
  }
});

function f(t) {
  const base = 20 + 10 * Math.sin(Math.PI * t / 24);
  if (t <= 8) {
    return Math.max(0, base);
  } else if (t <= 18) {
    const peak = 80 * Math.exp(-Math.pow((t - 14) / 3, 2));
    return Math.max(0, base + peak);
  } else {
    const peak = 40 * Math.exp(-Math.pow((t - 21) / 2, 2));
    return Math.max(0, base + peak);
  }
}

function simulationStep() {
  if (t > 24) { stopSimulation(); return; }

  const playersNow = f(t);
  integralAccum += playersNow * dt;

  labels.push(t.toFixed(1) + "h");
  data.push(playersNow);
  liveChart.update("none");

  document.getElementById("currentPlayers").textContent   = Math.round(playersNow);
  document.getElementById("currentTimeLabel").textContent = "t = " + t.toFixed(1) + " h";
  document.getElementById("integralValue").textContent    = Math.round(integralAccum);
  if (t > 0)
    document.getElementById("avgValue").textContent = Math.round(integralAccum / t);

  t = +(t + dt).toFixed(1);
}

function startSimulation() {
  if (isRunning) return;
  isRunning = true;
  document.getElementById("toggleBtn").textContent = "⏸ Pausar";
  document.getElementById("toggleBtn").classList.add("paused");
  intervalId = setInterval(simulationStep, 400);
}

function stopSimulation() {
  isRunning = false;
  document.getElementById("toggleBtn").textContent = "▶ Reanudar";
  document.getElementById("toggleBtn").classList.remove("paused");
  clearInterval(intervalId);
}

document.getElementById("toggleBtn").addEventListener("click", () => {
  if (isRunning) stopSimulation();
  else           startSimulation();
});
