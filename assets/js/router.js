async function cargarVista(vista) {

    const contenedor = document.getElementById("contenidoPrincipal");

    try {

        const respuesta = await fetch(`views/${vista}.html`);

        if (!respuesta.ok) {

            throw new Error("Vista no encontrada");

        }

        contenedor.innerHTML = await respuesta.text();

        document.getElementById("breadcrumb").textContent =
            vista.charAt(0).toUpperCase() + vista.slice(1);

        // Ejecutar el JS correspondiente a la vista
        switch (vista) {

            case "dashboard":

                const dashboard = await import("./modules/dashboard.js");

                dashboard.renderDashboard();

                break;

            case "usuarios":

                // const usuarios = await import("./modules/usuarios.js");
                // usuarios.init();

                break;

        }

    } catch (error) {

        console.error(error);

        contenedor.innerHTML = `
            <div class="alert alert-danger">
                Error al cargar la vista.
            </div>
        `;

    }

}

window.cargarVista = cargarVista;