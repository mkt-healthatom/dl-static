function redirect() {
    // Obtiene el valor del input y el mensaje de error
    const code = document.getElementById("code").value;
    const errorMessage = document.getElementById("error-message");

    // Si el campo es vacío muestra error, si se completa el campo oculta error
    if (!code) {
      errorMessage.style.display = "block";
      return;
    }

    errorMessage.style.display = "none";

    // Redirección con parámetro de consulta
    window.location.href = `/validar/consulta?c=${encodeURIComponent(code)}`;
}