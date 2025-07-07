// script.js
const profilePictureInput = document.getElementById('profile-picture-input');
const profilePreview = document.getElementById('profile-preview');

profilePictureInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePreview.setAttribute('src', e.target.result);
        }
        reader.readAsDataURL(file);
    }
});