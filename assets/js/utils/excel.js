import { imagenBase64 } from "./image.js";

export async function exportarExcel(config){

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "AquaControl Rural";
    workbook.lastModifiedBy = "AquaControl Rural";
    workbook.created = new Date();
    workbook.modified = new Date();

    const hoja = workbook.addWorksheet(config.hoja);

    hoja.properties.defaultRowHeight = 22;

    hoja.pageSetup = {

        orientation: "landscape",

        paperSize: 9,

        fitToPage: true,

        fitToWidth: 1,

        margins: {

            left: 0.3,

            right: 0.3,

            top: 0.5,

            bottom: 0.5,

            header: 0.3,

            footer: 0.3

        }

    };

    //-----------------------------------------
    // LOGO
    //-----------------------------------------

    const logo64 = await imagenBase64("assets/img/logo.png");

    const logo = workbook.addImage({

        base64: logo64,

        extension: "png"

    });

    hoja.addImage(logo,{

        tl:{col:0,row:0},

        ext:{

            width:70,

            height:70

        }

    });

    //-----------------------------------------
    // TITULO
    //-----------------------------------------

    hoja.mergeCells("B1:F1");

    const titulo = hoja.getCell("B1");

    titulo.value = "AquaControl Rural";

    titulo.font = {

        size:22,

        bold:true,

        color:{argb:"1565C0"}

    };

    titulo.alignment = {

        horizontal:"center",

        vertical:"middle"

    };

    //-----------------------------------------
    // SUBTITULO
    //-----------------------------------------

    hoja.mergeCells("B2:F2");

    const subtitulo = hoja.getCell("B2");

    subtitulo.value = config.titulo;

    subtitulo.font = {

        size:15,

        bold:true,

        color:{argb:"37474F"}

    };

    subtitulo.alignment = {

        horizontal:"center"

    };

    //-----------------------------------------
    // DESCRIPCION
    //-----------------------------------------

    hoja.mergeCells("B3:F3");

    const descripcion = hoja.getCell("B3");

    descripcion.value="Sistema Web para la Gestión y Mantenimiento de Sistemas de Agua";

    descripcion.font={

        italic:true,

        size:11,

        color:{argb:"777777"}

    };

    descripcion.alignment={

        horizontal:"center"

    };

    //-----------------------------------------
    // FECHA
    //-----------------------------------------

    hoja.getCell("A5").value="Fecha";

    hoja.getCell("A5").font={bold:true};

    hoja.getCell("B5").value=new Date().toLocaleDateString("es-MX");

    hoja.getCell("D5").value="Hora";

    hoja.getCell("D5").font={bold:true};

    hoja.getCell("E5").value=new Date().toLocaleTimeString("es-MX");


/*=========================================
TABLA
=========================================*/

const columnas = Object.keys(config.datos[0]);

hoja.addRow([]);
hoja.addRow(columnas);

const filaEncabezado = hoja.getRow(7);

filaEncabezado.height = 25;

filaEncabezado.eachCell((cell) => {

    cell.font = {

        bold: true,

        color: { argb: "FFFFFFFF" }

    };

    cell.fill = {

        type: "pattern",

        pattern: "solid",

        fgColor: { argb: "1976D2" }

    };

    cell.alignment = {

        horizontal: "center",

        vertical: "middle"

    };

    cell.border = {

        top: { style: "thin" },

        left: { style: "thin" },

        bottom: { style: "thin" },

        right: { style: "thin" }

    };

});


/*=========================================
DATOS
=========================================*/

config.datos.forEach((registro, index) => {

    const fila = hoja.addRow(Object.values(registro));

    fila.height = 22;

    fila.eachCell((cell) => {

        cell.border = {

            top: { style: "thin" },

            left: { style: "thin" },

            bottom: { style: "thin" },

            right: { style: "thin" }

        };

        cell.alignment = {

            vertical: "middle"

        };

        // Filas alternadas
        if(index % 2 == 0){

            cell.fill = {

                type: "pattern",

                pattern: "solid",

                fgColor: {

                    argb: "F5F9FF"

                }

            };

        }

    });

});


/*=========================================
AUTOAJUSTE REAL
=========================================*/

hoja.columns.forEach((column) => {

    let max = 12;

    column.eachCell({ includeEmpty: true }, (cell) => {

        const texto = cell.value
            ? cell.value.toString()
            : "";

        if(texto.length > max){

            max = texto.length;

        }

    });

    column.width = Math.min(max + 4, 40);

});


/*=========================================
FILTRO
=========================================*/

hoja.autoFilter = {

    from: {

        row: 7,

        column: 1

    },

    to: {

        row: 7,

        column: columnas.length

    }

};


/*=========================================
CONGELAR ENCABEZADO
=========================================*/

hoja.views = [

    {

        state: "frozen",

        ySplit: 7

    }

];


/*=========================================
PIE DE PAGINA
=========================================*/

hoja.headerFooter.oddFooter =

"&LGenerado por AquaControl Rural&RPágina &P de &N";


/*=========================================
DESCARGAR
=========================================*/

const buffer = await workbook.xlsx.writeBuffer();

saveAs(

    new Blob([buffer]),

    config.archivo

);
}