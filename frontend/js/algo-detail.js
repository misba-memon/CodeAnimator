document.addEventListener("DOMContentLoaded", () => {
  const storedUserId = localStorage.getItem("userId");
  if (storedUserId) {
    document.getElementById("userId").value = storedUserId;
  }
  const params = new URLSearchParams(window.location.search);
  const algoName = params.get("algo");

  if (!algoName) {
    alert("No algorithm specified!");
    return;
  }

  document.getElementById("algo-title").textContent = `Algorithm: ${algoName}`;

  let currentStep = 0; // current step index (not line number)
  let iframe;

  fetch(`/api/algorithm?name=${encodeURIComponent(algoName)}`)
    .then(res => res.json())
    .then(data => {
      // Show code with line numbers
      const codeSection = document.getElementById("code-section");
      const lines = data.code.split("\n");
      codeSection.innerHTML = lines
        .map((line, i) => `<span id="line-${i + 1}">${line || "\u00A0"}</span>`)
        .join("");
      // After rendering code
const codeSpans = codeSection.querySelectorAll("span");
const codeScrollWidth = codeSection.scrollWidth;
codeSpans.forEach(span => {
  span.style.display = "block";           // keep lines separate
  span.style.width = codeScrollWidth + "px"; // extend line fully
  span.style.whiteSpace = "pre";          // preserve spaces/tabs
});

      // Load iframe with visual
      document.getElementById("visual-section").innerHTML =
        `<iframe id="visual-frame" src="${data.visual_html}" width="100%" height="500"></iframe>`;

      document.getElementById("explanation-section").textContent = data.explanation;
      document.getElementById("algorithmId").value = data.id;

      iframe = document.getElementById("visual-frame");

      // Listen for step-to-line mapping from iframe
      window.addEventListener("message", event => {
        if (event.data && event.data.stepLineMap) {
          stepLineMap = event.data.stepLineMap; // received mapping from algo iframe
          moveArrow(currentStep);
        }
      });

      // After iframe loads, send initial step 0
      iframe.addEventListener("load", () => {
        sendStepToIframe(currentStep);
      });
    });

  // Holds step to code line mapping from iframe
  let stepLineMap = [];

  // Prev button
  document.getElementById('prevLine').addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      moveArrow(currentStep);
      sendStepToIframe(currentStep);
    }
  });

  // Next button
  document.getElementById('nextLine').addEventListener('click', () => {
    // Total steps known from stepLineMap length
    if (stepLineMap.length === 0) return;
    if (currentStep < stepLineMap.length - 1) {
      currentStep++;
      moveArrow(currentStep);
      sendStepToIframe(currentStep);
    }
  });

  // Move arrow (highlight code line for current step)
  function moveArrow(step) {
    // Remove old highlight
    document.querySelectorAll("#code-section span").forEach(span => {
      span.classList.remove("current-line");
    });

    if (stepLineMap.length === 0) return;

    const lineNumber = stepLineMap[step]; // line number for this step (1-based)
    const activeLine = document.getElementById(`line-${lineNumber}`);
    if (activeLine) {
      activeLine.classList.add("current-line");
      // Scroll code-section if needed (optional)
      activeLine.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // Send step index to iframe to trigger animation
  function sendStepToIframe(step) {
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ step }, "*");
    }
  }
});
document.getElementById("feedbackForm").addEventListener("submit", (e) => {
  e.preventDefault(); // prevent default form submit

  const userId = document.getElementById("userId").value; // set this on login
  const algorithmId = document.getElementById("algorithmId").value;
  const feedbackText = document.getElementById("feedbackText").value;

  if (!algorithmId || !userId) {
    alert("User or Algorithm not set properly!");
    return;
  }

  fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, algorithmId, feedbackText })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("feedbackMsg").textContent = data.message;
      document.getElementById("feedbackText").value = "";
    })
    .catch(err => console.error(err));
});

