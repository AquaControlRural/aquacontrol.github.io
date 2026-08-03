import {
    escuchar
} from "../services/database.js";

let calendario;

export function initCalendario() {

    const calendarEl = document.getElementById("calendar");

    calendario = new FullCalendar.Calendar(calendarEl, {
        locale: "es",
        initialView: "dayGridMonth",
        height: "auto",

        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
        },

        buttonText: {
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día"
        },

        events: [],   // ← Aquí va la coma

        eventClick(info) {

            const e = info.event;

            Swal.fire({
                title: e.title,
                html: `
                    <b>Pozo:</b> ${e.extendedProps.pozo}<br>
                    <b>Tipo:</b> ${e.extendedProps.tipo}<br>
                    <b>Técnico:</b> ${e.extendedProps.tecnico}<br>
                    <b>Estado:</b> ${e.extendedProps.estado}<br>
                    <b>Costo:</b> $${e.extendedProps.costo}<br><br>
                    ${e.extendedProps.descripcion}
                `,
                icon: "info"
            });

        }

    });

    calendario.render();

    cargarEventos();

}

function cargarEventos() {

    escuchar("mantenimientos", (datos) => {

        calendario.removeAllEvents();

        if (!datos) return;

        Object.entries(datos).forEach(([id, mantenimiento]) => {

            calendario.addEvent({

                id,

                title: `🔧 ${mantenimiento.bombaNombre}`,

                start: mantenimiento.fecha,

                color: obtenerColor(mantenimiento.estado),

                extendedProps: {

                    pozo: mantenimiento.pozoNombre,

                    tecnico: mantenimiento.tecnico,

                    tipo: mantenimiento.tipo,

                    descripcion: mantenimiento.descripcion,

                    estado: mantenimiento.estado,

                    costo: mantenimiento.costo

                }

            });
        });

    });

}

function obtenerColor(estado) {

    switch (estado) {

        case "Pendiente":
            return "#ffc107";

        case "En proceso":
            return "#0d6efd";

        case "Finalizado":
            return "#198754";

        default:
            return "#6c757d";

    }

}