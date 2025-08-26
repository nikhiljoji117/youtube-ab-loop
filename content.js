function createLoopPanel(video) {
  const loopPanel = document.createElement("div");
  loopPanel.style.position = "fixed";
  loopPanel.style.bottom = "20px";
  loopPanel.style.right = "20px";
  loopPanel.style.zIndex = "10000";
  loopPanel.style.background = "black";
  loopPanel.style.padding = "10px";
  loopPanel.style.borderRadius = "8px";
  loopPanel.style.color = "white";
  loopPanel.style.fontSize = "14px";
  loopPanel.style.display = "none"; // hidden by default
  loopPanel.style.alignItems = "center";
  loopPanel.style.flexWrap = "wrap";
  loopPanel.style.gap = "5px";
  loopPanel.id = "ab-loop-panel";

  function createInput(labelText) {
    const label = document.createElement("label");
    label.textContent = labelText;
    label.style.marginRight = "5px";
    return label;
  }

  function createNumberInput(max) {
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = max;
    input.value = "0";
    input.style.width = "40px";
    return input;
  }

  const duration = video.duration;
  const useHours = duration >= 3600;
  const useMinutes = duration >= 60;

  const startH = useHours ? createNumberInput(23) : null;
  const startM = useMinutes ? createNumberInput(59) : null;
  const startS = createNumberInput(59);
  const endH = useHours ? createNumberInput(23) : null;
  const endM = useMinutes ? createNumberInput(59) : null;
  const endS = createNumberInput(59);

  const toggle = document.createElement("input");
  toggle.type = "checkbox";
  toggle.style.width = "40px";
  toggle.style.height = "20px";
  toggle.style.accentColor = "red";

  const labelStart = createInput("Start:");
  const labelEnd = createInput("End:");

  loopPanel.appendChild(labelStart);
  if (startH) loopPanel.appendChild(startH);
  if (startM) {
    loopPanel.appendChild(document.createTextNode(" : "));
    loopPanel.appendChild(startM);
  }
  loopPanel.appendChild(document.createTextNode(" : "));
  loopPanel.appendChild(startS);

  loopPanel.appendChild(labelEnd);
  if (endH) loopPanel.appendChild(endH);
  if (endM) {
    loopPanel.appendChild(document.createTextNode(" : "));
    loopPanel.appendChild(endM);
  }
  loopPanel.appendChild(document.createTextNode(" : "));
  loopPanel.appendChild(endS);

  loopPanel.appendChild(toggle);
  document.body.appendChild(loopPanel);

  // Loop logic
  setInterval(() => {
    if (!toggle.checked) return;

    const startTime =
      (useHours ? parseInt(startH?.value || 0) * 3600 : 0) +
      (useMinutes ? parseInt(startM?.value || 0) * 60 : 0) +
      parseInt(startS.value || 0);

    const endTime =
      (useHours ? parseInt(endH?.value || 0) * 3600 : 0) +
      (useMinutes ? parseInt(endM?.value || 0) * 60 : 0) +
      parseInt(endS.value || 0);

    if (endTime > startTime &&
      (video.currentTime > endTime || video.currentTime < startTime)) {
      video.currentTime = startTime;
    }
  }, 300);
}

function createMiniToggleButton() {
  const container = document.querySelector('#top-level-buttons-computed') || document.querySelector("#menu-container");
  if (!container) return;

  const button = document.createElement("button");
  button.textContent = "🔁 Loop";
  button.style.background = "#222";
  button.style.color = "#fff";
  button.style.border = "1px solid #888";
  button.style.borderRadius = "4px";
  button.style.padding = "4px 8px";
  button.style.marginLeft = "8px";
  button.style.cursor = "pointer";
  button.style.fontSize = "14px";

  button.addEventListener("click", () => {
    const panel = document.querySelector("#ab-loop-panel");
    if (panel) {
      panel.style.display = panel.style.display === "none" ? "flex" : "none";
    }
  });

  container.appendChild(button);
}

function waitForVideoAndUI() {
  const video = document.querySelector("video");
  const menuReady = document.querySelector('#top-level-buttons-computed') || document.querySelector("#menu-container");

  if (video && video.duration > 0 && menuReady) {
    createLoopPanel(video);
    createMiniToggleButton();
  } else {
    setTimeout(waitForVideoAndUI, 1000);
  }
}

waitForVideoAndUI();
