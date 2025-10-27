const form = document.getElementById("contact-form");
      const feedback = document.getElementById("form-feedback");
      const button = form.querySelector("button");
      const emailInput = document.getElementById("email");
      const emailError = document.getElementById("email-error");
  
      // validate email on blur
      emailInput.addEventListener("blur", validateEmail);
      emailInput.addEventListener("input", validateEmail);
  
      function validateEmail() {
        const value = emailInput.value.trim();
        const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
        if (!valid && value.length > 0) {
          emailError.style.display = "block";
          emailInput.style.borderColor = "red";
          return false;
        } else {
          emailError.style.display = "none";
          emailInput.style.borderColor = "#ccc";
          return true;
        }
      }
  
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!validateEmail()) return;
  
        button.disabled = true;
        button.textContent = "Sending...";
        feedback.style.display = "none";
  
        const formData = new FormData(form);
  
        try {
          const response = await fetch("https://getform.io/f/bdrdwxvb", {
            method: "POST",
            body: formData
          });
  
          if (response.ok) {
            form.reset();
            feedback.innerHTML = `
              <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                <path class="checkmark__check" fill="none" d="M14 27l7 7 16-16"/>
              </svg>
              <div class="msg success">Your message was sent successfully ✅</div>
            `;
            feedback.style.display = "block";
          } else {
            throw new Error("Send failed");
          }
        } catch (err) {
          feedback.innerHTML = `<div class="msg error">❌ Failed to send message.</div>`;
          feedback.style.display = "block";
        }
  
        setTimeout(() => {
          button.disabled = false;
          button.textContent = "Send Message";
          feedback.style.display = "none";
          feedback.innerHTML = "";
        }, 4000);
      });