const dashboardCards = [

    {
        titulo: "Pozos Activos",
        valor: 18,
        icono: "bi-water",
        color: "primary",
        descripcion: "Operando correctamente"
    },

    {
        titulo: "Bombas Activas",
        valor: 24,
        icono: "bi-gear-fill",
        color: "success",
        descripcion: "En funcionamiento"
    },

    {
        titulo: "Mantenimientos",
        valor: 5,
        icono: "bi-tools",
        color: "warning",
        descripcion: "Programados"
    },

    {
        titulo: "Fallas",
        valor: 2,
        icono: "bi-exclamation-triangle-fill",
        color: "danger",
        descripcion: "Pendientes"
    }

];
const rol = await obtenerRolUsuario(usuario.uid);


console.log("Rol actual:", rol);
function crearTarjetas(){

    const contenedor = document.getElementById("cardsContainer");

    contenedor.innerHTML = "";

    dashboardCards.forEach(card=>{

        contenedor.innerHTML += `

        <div class="col-12 col-sm-6 col-xl-3">

            <div class="dashboard-card">

                <div class="card-icon bg-${card.color}">

                    <i class="bi ${card.icono}"></i>

                </div>

                <div class="card-content">

                    <small>${card.titulo}</small>

                    <h2>${card.valor}</h2>

                    <span>${card.descripcion}</span>

                </div>

            </div>

        </div>

        `;

    });

}

crearTarjetas();