const subscribeForm = document.getElementById("subscribe-form");
const subscribeEmail = document.getElementById("subscribe-email");
const subscribeFeedback = document.getElementById("subscribe-feedback");
const bellIcon = subscribeForm.querySelector("i");

function validateSubscribeEmail() {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(subscribeEmail.value.trim());
}

subscribeForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateSubscribeEmail()) {
    subscribeFeedback.textContent = "❌ Enter a valid email.";
    subscribeFeedback.style.display = "block";
    subscribeFeedback.style.color = "red";
    return;
  }

  bellIcon.classList.add("bell-ring");
  setTimeout(() => bellIcon.classList.remove("bell-ring"), 500);

  const formData = new FormData(subscribeForm);

  try {
    const response = await fetch("https://getform.io/f/bdrdwxvb", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      subscribeForm.reset();
      subscribeFeedback.textContent = "✅ Subscribed successfully!";
      subscribeFeedback.style.color = "green";
    } else {
      throw new Error();
    }
  } catch {
    subscribeFeedback.textContent = "❌ Please try again later.";
    subscribeFeedback.style.color = "red";
  }

  subscribeFeedback.style.display = "block";
  setTimeout(() => (subscribeFeedback.style.display = "none"), 4000);
});