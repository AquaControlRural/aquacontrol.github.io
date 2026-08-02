const menu = [
    {
        texto: "Dashboard",
        icono: "bi-speedometer2",
        vista: "dashboard"
    },
    {
        texto: "Usuarios",
        icono: "bi-people-fill",
        vista: "usuarios"
    },
    {
        texto: "Comunidades",
        icono: "bi-houses-fill",
        vista: "comunidades"
    },
    {
        texto: "Pozos",
        icono: "bi-water",
        vista: "pozos"
    },
    {
        texto: "Bombas",
        icono: "bi-gear-fill",
        vista: "bombas"
    },
    {
        texto: "Inventario",
        icono: "bi-box-seam",
        vista: "inventario"
    },
    {
        texto: "Mantenimientos",
        icono: "bi-tools",
        vista: "mantenimientos"
    },
    {
        texto: "Bitácora",
        icono: "bi-journal-text",
        vista: "bitacora"
    },
    {
        texto: "Calendario",
        icono: "bi-calendar-event",
        vista: "calendario"
    },
    {
        texto: "Reportes",
        icono: "bi-file-earmark-bar-graph",
        vista: "reportes"
    }
];

const menuDesktop = document.getElementById("menuDesktop");
const menuMovil = document.getElementById("menuMovil");

function crearMenu(contenedor) {

    contenedor.innerHTML = "";

    menu.forEach(item => {

        contenedor.innerHTML += `
            <li class="nav-item">

                <a href="#"
                   class="nav-link menu-link"
                   data-view="${item.vista}">

                    <i class="bi ${item.icono} me-2"></i>

                    ${item.texto}

                </a>

            </li>
        `;

    });

}

crearMenu(menuDesktop);
crearMenu(menuMovil);