// ======================================================
// pdfReportes.js
// Reporte PDF AquaControl Rural
// ======================================================


import { imagenBase64 } from "./image.js";




// ======================================================
// EXPORTAR PDF
// ======================================================


export async function exportarPDF(reporte){


const { jsPDF } = window.jspdf;


const doc = new jsPDF({

    orientation:"landscape",

    unit:"mm",

    format:"a4"

});



const fecha =
new Date()
.toLocaleString("es-MX");




// ======================================================
// PORTADA
// ======================================================


try{


const logo =
await imagenBase64(
"assets/img/logo.png"
);



doc.addImage(

logo,

"PNG",

15,

10,

30,

30

);



}catch(e){

console.log(
"No se pudo cargar logo"
);

}




doc.setFontSize(22);

doc.setTextColor(
21,
101,
192
);


doc.text(

"AquaControl Rural",

60,

25

);




doc.setFontSize(16);

doc.setTextColor(
50,
50,
50
);


doc.text(

"Centro de Reportes",

60,

35

);




doc.setFontSize(11);


doc.text(

`Generado: ${fecha}`,

60,

45

);





// ======================================================
// RESUMEN
// ======================================================


doc.setFontSize(15);


doc.text(

"Resumen General",

15,

65

);



let resumen =
reporte.resumen.datos;



doc.autoTable({


startY:70,


head:[

[
"Modulo",
"Cantidad"

]

],



body:

resumen.map(r=>[

r.modulo,

r.cantidad

]),



theme:"grid"


});






// Nueva pagina


doc.addPage();




// ======================================================
// MANTENIMIENTOS
// ======================================================


crearTabla(

doc,

"Mantenimientos",

reporte.mantenimientos.datos

);






// ======================================================
// INVENTARIO
// ======================================================


doc.addPage();



crearTabla(

doc,

"Inventario",

reporte.inventario.datos

);







// ======================================================
// BOMBAS
// ======================================================


doc.addPage();



crearTabla(

doc,

"Bombas",

reporte.bombas.datos

);






// ======================================================
// BITACORA
// ======================================================


doc.addPage();



crearTabla(

doc,

"Bitácora",

reporte.bitacora.datos

);





// ======================================================
// PAGINAS
// ======================================================


const paginas =
doc.internal.getNumberOfPages();



for(
let i=1;
i<=paginas;
i++
){


doc.setPage(i);



doc.setFontSize(9);



doc.text(

`AquaControl Rural - Página ${i} de ${paginas}`,

15,

200

);



}




doc.save(

"AquaControl_Reportes.pdf"

);



}







// ======================================================
// CREAR TABLAS
// ======================================================


function crearTabla(

doc,

titulo,

datos

){



doc.setFontSize(16);



doc.text(

titulo,

15,

20

);




if(

!datos ||

datos.length===0

){


doc.text(

"Sin información",

15,

35

);


return;

}




const columnas =
Object.keys(
datos[0]
);



doc.autoTable({



startY:30,



head:[columnas],



body:

datos.map(
d=>
Object.values(d)
),



theme:"grid",



styles:{

fontSize:8

}



});



}