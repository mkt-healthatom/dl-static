  let turnstileToken = null;

  function onTurnstileSuccess(token) {
    turnstileToken = token;
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = false;
    submitBtn.classList.remove("deactivated");
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Copia el valor del label oculto al input oculto
    const beneficioLabel = document.getElementById("beneficio-id");
    const beneficioInput = document.getElementById("beneficio");

    if (beneficioLabel && beneficioInput) {
      beneficioInput.value = beneficioLabel.textContent.trim();
    }

    // Manejo del envío del formulario
    document.getElementById("benefitForm").addEventListener("submit", async function (e) {
      e.preventDefault();

      if (!turnstileToken) return;

      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        country: document.getElementById("country").value,
        benefit_id: document.getElementById("beneficio").value,
        "cf-turnstile-response": turnstileToken,
      };

      try {
        const response = await fetch("https://marketingha.app.n8n.cloud/webhook-test/42ec7358-0e62-46b4-a518-1aeebaeefa91", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Error al enviar la solicitud");

        // Mostrar mensaje de éxito y ocultar formulario
        document.querySelector(".beneficio-form-block").style.display = "none";
        document.querySelector(".beneficio-form-success-wrapper").style.display = "block";

      } catch (err) {
        console.error("Error al enviar el formulario:", err);
      }
    });
  });