const passwordBtn = document.querySelector("#passwordBtn");
passwordBtn.addEventListener("click", function() {
  const passwordInput = document.getElementById("password");
  const type = passwordInput.getAttribute("type");

  if (type == "password") {
    passwordInput.setAttribute("type", "text");
    passwordBtn.innerHTML = "Hide Password";
  } else {
    passwordInput.setAttribute("type", "password");
    passwordBtn.innerHTML = "Show Password";
  }
});
