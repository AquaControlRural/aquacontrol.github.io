document.addEventListener("DOMContentLoaded", () => {

    cargarVista("dashboard");

    document.addEventListener("click", (e) => {

        const enlace = e.target.closest(".menu-link");

        if(!enlace) return;

        e.preventDefault();

        const vista = enlace.dataset.view;

        cargarVista(vista);

        // Cerrar el menú en móviles
        const offcanvas = document.getElementById("sidebarMovil");

        if(offcanvas){

            const instancia = bootstrap.Offcanvas.getInstance(offcanvas);

            if(instancia){

                instancia.hide();

            }

        }

    });

});