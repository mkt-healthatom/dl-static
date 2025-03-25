// Obtiene el parámetro de la URL
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Control de errores
function handleError() {
  const errorMessage = document.querySelector(".consulta-error-message");
  errorMessage.style.display = "block";

  document.querySelector(".consulta-headline-wrapper").style.display = "none";
  document.querySelector(".consulta-table-wrapper").style.display = "none";
  document.querySelector(".blue-large-outline-button").style.display = "none";
}

// Consulta webhook y actualiza datos
async function fetchAndDisplayCodeData() {
    const code = getUrlParam("c");
  
    if (!code) {
      handleError();
      return;
    }
  
    // 🔐 Esperar que Turnstile esté cargado
    const turnstileInterval = setInterval(async () => {
      if (window.turnstile && window.turnstile.getResponse) {
        clearInterval(turnstileInterval);
  
        const turnstileToken = window.turnstile.getResponse();
  
        if (!turnstileToken) {
          handleError();
          return;
        }
  
        try {
          const webhookUrl = "https://marketingha.app.n8n.cloud/webhook-test/910ad57d-8e93-44ac-aa9e-4e4ade2a0f4b";
          const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code,
              token: turnstileToken, // 🟢 Enviamos el token a n8n
            }),
          });
  
          if (!response.ok) {
            throw new Error("Error al consultar el código.");
          }
  
          const data = await response.json();
  
          if (!data.data.code) {
            handleError();
            return;
          }
  
          document.querySelector('[code-validation="code_requested"]').textContent =
            data.data.code || "No disponible";
          document.querySelector('[code-validation="code_status"]').textContent =
            capitalizeFirstLetter(data.data.code_status) || "No disponible";
          document.querySelector('[code-validation="code_date"]').textContent =
            formatDate(data.data.code_lifespan) || "No disponible";
          document.querySelector('[code-validation="code_limit"]').textContent =
            data.data["code_usage-limit"] || "No disponible";
          document.querySelector('[code-validation="code_email"]').textContent =
            data.data.request_email || "No disponible";
  
          const statusButton = document.getElementById("status_action");
          if (data.data.code_status.toLowerCase() === "activo") {
            statusButton.style.display = "block";
          } else {
            statusButton.style.display = "none";
          }
        } catch (error) {
          handleError();
        }
      }
    }, 100);
  }  

// Maneja redención de código y actualiza datos
async function changeCodeStatus() {
  const code = getUrlParam("c");

  if (!code) {
      alert("No se encontró el código para cambiar su estado.");
      return;
  }

  const redemptionMessage = document.querySelector(".consulta-redencion-status-message");

  try {
      const webhookUrl = "https://marketingha.app.n8n.cloud/webhook/9168704b-df1a-47cb-9252-c677c0a17030";
      const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
      });

      if (!response.ok) {
          throw new Error("Error al cambiar el estado del código.");
      }

      const data = await response.json();

      if (data.status !== "success") {
          throw new Error("El beneficio no pudo redimirse correctamente, comunícate con nosotros.");
      }

      document.querySelector('[code-validation="code_requested"]').textContent =
          data.data.code || "No disponible";
      document.querySelector('[code-validation="code_status"]').textContent =
          capitalizeFirstLetter(data.data.code_status) || "No disponible";
      document.querySelector('[code-validation="code_date"]').textContent =
          formatDate(data.data.code_lifespan) || "No disponible";
      document.querySelector('[code-validation="code_limit"]').textContent =
          data.data["code_usage-limit"] || "No disponible";
      document.querySelector('[code-validation="code_email"]').textContent =
          data.data.request_email || "No disponible";

      redemptionMessage.style.display = "block";

  } catch (error) {
      redemptionMessage.textContent = "El beneficio no pudo redimirse correctamente, comunícate con nosotros.";
      redemptionMessage.style.display = "block";
  }
}

// Formateo de fecha
function formatDate(dateString) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

// Formateo de elemento Status
function capitalizeFirstLetter(string) {
  if (!string) return null;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener("DOMContentLoaded", fetchAndDisplayCodeData);
document.getElementById("status_action").addEventListener("click", changeCodeStatus);
