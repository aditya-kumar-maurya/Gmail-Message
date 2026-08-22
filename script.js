document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const slipDate = document.getElementById("slipDate");
  if (slipDate) {
    const now = new Date();
    slipDate.textContent = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const dial = document.getElementById("rotaryDial");
  const readout = document.getElementById("dialReadout");
  const PHONE_NUMBER = "9305364359";
  let dialedIndex = 0;
  let resetTimer = null;

  if (dial && readout) {
    const buttons = dial.querySelectorAll(".dial__num");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const expected = PHONE_NUMBER[dialedIndex];
        const pressed = btn.dataset.num;

        btn.classList.add("is-active");
        setTimeout(() => btn.classList.remove("is-active"), 220);

        if (pressed === expected) {
          dialedIndex += 1;
          readout.textContent = PHONE_NUMBER.slice(0, dialedIndex) || "—";

          if (dialedIndex === PHONE_NUMBER.length) {
            readout.textContent = "CALL ME";
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
              window.location.href = "tel:+91" + PHONE_NUMBER;
              dialedIndex = 0;
              readout.textContent = "—";
            }, 700);
            return;
          }
        } else {
          dialedIndex = 0;
          readout.textContent = "—";
        }

        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          dialedIndex = 0;
          readout.textContent = "—";
        }, 4000);
      });
    });
  }

  const form = document.getElementById("messageForm");
  const submitLabel = document.getElementById("submitLabel");
  const note = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector(".slip__submit");

      submitBtn.disabled = true;
      submitLabel.textContent = "Ringing...";
      note.textContent = "";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          submitLabel.textContent = "Message left";
          note.style.color = "var(--brass)";
          note.textContent = "Got it — I'll call you back soon.";
          form.reset();
        } else {
          throw new Error("Submission failed");
        }
      } catch (err) {
        submitLabel.textContent = "Send message";
        note.style.color = "var(--rust)";
        note.textContent = "Line dropped — please try again.";
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
});