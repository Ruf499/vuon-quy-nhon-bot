const state = {
  step: 1,
  goal: null,
  use: null,
  input: null,
  telegram: "",
  email: ""
};

const steps = document.querySelectorAll(".step");

const stepLabel = document.getElementById("stepLabel");
const progressLabel = document.getElementById("progressLabel");

const backBtn = document.getElementById("backBtn");
const continueBtn = document.getElementById("continueBtn");

const telegramInput = document.getElementById("telegram");
const emailInput = document.getElementById("email");

const portfolioFile = document.getElementById("portfolioFile");
const fileName = document.getElementById("fileName");

const progress = {
  1: "33% completed",
  2: "67% completed",
  3: "100% completed"
};


// -----------------------------
// Render current step
// -----------------------------

function render() {
  steps.forEach((step) => {
    const stepNumber = Number(step.dataset.step);

    step.classList.toggle(
      "active",
      stepNumber === state.step
    );
  });

  stepLabel.textContent = `Step ${state.step} of 3`;
  progressLabel.textContent = progress[state.step];

  backBtn.hidden = state.step === 1;

  continueBtn.textContent =
    state.step === 3
      ? "Submit"
      : "Continue";

  telegramInput.value = state.telegram;
  emailInput.value = state.email;

  restoreSelections();
}


// -----------------------------
// Restore selected buttons
// -----------------------------

function restoreSelections() {
  document
    .querySelectorAll('[data-group="goal"] .choice-card')
    .forEach((button) => {
      button.classList.toggle(
        "selected",
        button.dataset.value === state.goal
      );
    });

  document
    .querySelectorAll('[data-group="use"] .pill')
    .forEach((button) => {
      button.classList.toggle(
        "selected",
        button.dataset.value === state.use
      );
    });

  document
    .querySelectorAll('[data-group="input"] .pill')
    .forEach((button) => {
      button.classList.toggle(
        "selected",
        button.dataset.value === state.input
      );
    });
}


// -----------------------------
// Select option
// -----------------------------

function selectOne(group, value, element) {
  state[group] = value;

  document
    .querySelectorAll(`[data-group="${group}"] button`)
    .forEach((button) => {
      button.classList.toggle(
        "selected",
        button === element
      );
    });
}


// -----------------------------
// Goal selection
// -----------------------------

document
  .querySelectorAll('[data-group="goal"] .choice-card')
  .forEach((card) => {
    card.addEventListener("click", () => {
      selectOne(
        "goal",
        card.dataset.value,
        card
      );
    });
  });


// -----------------------------
// Usage selection
// -----------------------------

document
  .querySelectorAll('[data-group="use"] .pill')
  .forEach((pill) => {
    pill.addEventListener("click", () => {
      selectOne(
        "use",
        pill.dataset.value,
        pill
      );
    });
  });


// -----------------------------
// Input method selection
// -----------------------------

document
  .querySelectorAll('[data-group="input"] .pill')
  .forEach((pill) => {
    pill.addEventListener("click", () => {
      selectOne(
        "input",
        pill.dataset.value,
        pill
      );
    });
  });


// -----------------------------
// Text fields
// -----------------------------

telegramInput.addEventListener("input", (event) => {
  state.telegram = event.target.value;
});

emailInput.addEventListener("input", (event) => {
  state.email = event.target.value;
});


// -----------------------------
// File selection
// -----------------------------

if (portfolioFile) {
  portfolioFile.addEventListener("change", () => {
    if (portfolioFile.files.length > 0) {
      fileName.textContent =
        portfolioFile.files[0].name;
    } else {
      fileName.textContent =
        "PDF, DOC, DOCX, JPG or PNG";
    }
  });
}


// -----------------------------
// Validate current step
// -----------------------------

function validateStep() {
  if (state.step === 1 && !state.goal) {
    alert("Please select an option.");
    return false;
  }

  if (state.step === 2 && !state.use) {
    alert("Please select how you plan to use the app.");
    return false;
  }

  if (state.step === 3 && state.email) {
    const emailValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        state.email
      );

    if (!emailValid) {
      alert("Please enter a valid email address.");
      return false;
    }
  }

  return true;
}


// -----------------------------
// Submit application
// -----------------------------

async function submitApplication() {
  continueBtn.disabled = true;
  continueBtn.textContent = "Sending...";

  try {
    const formData = new FormData();

    formData.append(
      "telegram",
      state.telegram
    );

    formData.append(
      "goal",
      state.goal || ""
    );

    formData.append(
      "use",
      state.use || ""
    );

    formData.append(
      "input",
      state.input || ""
    );

    formData.append(
      "email",
      state.email
    );

    if (
      portfolioFile &&
      portfolioFile.files.length > 0
    ) {
      formData.append(
        "file",
        portfolioFile.files[0]
      );
    }

    const response = await fetch(
      "/api/submit",
      {
        method: "POST",
        body: formData
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || "Submission failed"
      );
    }

    continueBtn.textContent = "Submitted ✓";

    alert(
      "Thank you! Your application has been submitted."
    );

  } catch (error) {
    console.error(error);

    alert(
      "Something went wrong. Please try again."
    );

    continueBtn.disabled = false;
    continueBtn.textContent = "Submit";
  }
}


// -----------------------------
// Continue / Submit button
// -----------------------------

continueBtn.addEventListener("click", async () => {
  if (!validateStep()) {
    return;
  }

  if (state.step < 3) {
    state.step++;

    render();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    return;
  }

  await submitApplication();
});


// -----------------------------
// Back button
// -----------------------------

backBtn.addEventListener("click", () => {
  if (state.step <= 1) {
    return;
  }

  state.step--;

  render();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


// -----------------------------
// Initial render
// -----------------------------

render();
