document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form[id^="upload-form"]');

    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const fileInput = this.querySelector('input[type="file"]');
            const file = fileInput.files[0];
            const nameInput = this.querySelector('input[type="text"]');
            const choirInput = this.querySelector('select');
            
            if (file && nameInput.value && choirInput.value) {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = URL.createObjectURL(file); // Esto es para visualizar el archivo localmente. En un entorno real, se necesitaría subir el archivo al servidor.
                link.textContent = `${nameInput.value} - ${choirInput.options[choirInput.selectedIndex].text}`;
                link.target = "_blank";
                
                listItem.appendChild(link);
                const libraryList = this.parentElement.nextElementSibling.querySelector('ul');
                libraryList.appendChild(listItem);
                
                // Aquí puedes agregar el código para subir el archivo al servidor
                // y almacenarlo. Por ejemplo, usando fetch o XMLHttpRequest.
            }
        });
    });
});
