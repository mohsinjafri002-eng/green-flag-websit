const scoreButtons = [...document.querySelectorAll("[data-score]")];
const scoreNumber = document.getElementById("scoreNumber");
const ratingLabel = document.getElementById("ratingLabel");
const submitBtn = document.getElementById("submitBtn");
const note = document.getElementById("note");
const count = document.getElementById("count");
const success = document.getElementById("success");
const errorBox = document.getElementById("error");
let selectedScore = null;

const labels = {
  1: "Oof. A redemption arc is possible.",
  2: "A few green leaves, a little work to do.",
  3: "Currently buffering…",
  4: "Potential spotted. Evidence pending.",
  5: "Half green, half mystery.",
  6: "A promising shade of green.",
  7: "Pretty green, not gonna lie.",
  8: "Green flag energy is strong.",
  9: "Almost suspiciously wholesome.",
  10: "Certified, premium, limited-edition green flag."
};

scoreButtons.forEach(button => button.addEventListener("click", () => {
  selectedScore = Number(button.dataset.score);
  scoreButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  scoreNumber.textContent = selectedScore;
  ratingLabel.textContent = labels[selectedScore];
  errorBox.textContent = "";
}));

note.addEventListener("input", () => count.textContent = note.value.length);

submitBtn.addEventListener("click", async () => {
  errorBox.textContent = "";
  if (!selectedScore) {
    errorBox.textContent = "Pick a score first — the suspense is not the point.";
    document.querySelector(".rating-wrap").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const payload = {
    score: selectedScore,
    reasons: [...document.querySelectorAll(".trait input:checked")].map(input => input.value),
    name: document.getElementById("name").value,
    note: note.value
  };

  submitBtn.disabled = true;
  submitBtn.querySelector("span").textContent = "Sending your verdict…";
  try {
    const response = await fetch("/.netlify/functions/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Something went wrong. Please try again.");
    success.classList.add("show");
    submitBtn.querySelector("span").textContent = "Verdict submitted";
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    errorBox.textContent = "Couldn't send the review. Make sure the website is online and try again.";
    submitBtn.disabled = false;
    submitBtn.querySelector("span").textContent = "Submit my official verdict";
  }
});