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

                console.log("ANTES DE EJECUTAR FUNCION");

                const dashboard = await import("./modules/dashboard.js");

                console.log("MODULO IMPORTADO", dashboard);

                console.log("FUNCION:", dashboard.renderDashboard);

                await dashboard.renderDashboard();

                console.log("DESPUES DE EJECUTAR FUNCION");

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
            case "inventario":

                const inventario = await import("./modules/inventario.js");

                inventario.initInventario();

            break;
            case "mantenimientos":

                const mantenimientos = await import("./modules/mantenimientos.js");

                mantenimientos.initMantenimientos();

                break;
            case "bitacora":

                const bitacora = await import("./modules/bitacora.js");

                bitacora.initBitacora();

                break;
            case "calendario":

                const calendario = await import("./modules/calendario.js");

                calendario.initCalendario();

                break;
            case "reportes":

                const reportes = await import("./modules/reportes.js");

                reportes.initReportes();

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