
// Wrap the logic in a function to be called later.
function initializeProfileForm() {
  const profilePictureInput = document.getElementById("profile-picture-input");
  const profilePreview = document.getElementById("profile-preview");

  // A safety check: if the element doesn't exist, exit the function.
  if (!profilePictureInput) {
    return;
  }

  profilePictureInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePreview.setAttribute("src", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
}
