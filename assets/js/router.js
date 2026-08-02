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
        // Quitar selección anterior
        document.querySelectorAll(".menu-link").forEach(link => {

            link.classList.remove("menu-activo");

        });

        // Activar menú actual
        document
            .getElementById(`menu-${vista}`)
            ?.classList.add("menu-activo");
        switch (vista) {

            case "dashboard":

                const dashboard = await import("./modules/dashboard.js");

                dashboard.renderDashboard();

                break;

            case "usuarios":

                const usuarios = await import("./modules/usuarios.js");

                usuarios.initUsuarios();

                break;
            case "comunidades":

                const comunidades = await import("./modules/comunidades.js");

                comunidades.initComunidades();

                break;
            case "pozos":

                const pozos = await import("./modules/pozos.js");

                pozos.initPozos();

                break;
            case "bombas":

                const bombas = await import("./modules/bombas.js");

                bombas.initBombas();

                break;
            case "mantenimientos":

                const mantenimientos = await import("./modules/mantenimientos.js");

                mantenimientos.initMantenimientos();

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