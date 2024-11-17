const tiempos_servicios = {
    motores: 12,
    cigueñales: 6,
    casquetes: 4,
    bujes_levas: 4,
    culatas: 8,
    valvulas: 3,
    guias: 4,
    bielas: 6,
    tapas_bancada: 5,
    resortes: 2,
    esparragos: 1,
    encamizar_bloque: 5,
    rectificar_bloque: 6,
    pulir_bloque: 3,
    pulir_cigueñal: 3,
    cepillar_culatas: 4,
    culatas_anillos: 2,
    bases_valvulas: 3,
    rimar_guias: 2,
    rimar_bielas: 2,
    cambio_guias: 3,
    cambio_buje: 2,
    rebajar_buje: 1,
    circulo_bancada: 2,
    devolvedor_aceite: 1,
    rebajar_pistones: 2,
    cambio_pinon: 2,
    ensamblaje_bielas: 3,
    lavado_motor: 1
};

const maquinas = {
    Mandriladora_Vertical_De_Cilindros: { horasPorDia: 8 },
    Taladro_Vertical: { horasPorDia: 8 },
    Maquina_Rectificadora_del_Cigueñal: { horasPorDia: 8 },
    Adaptadora_Y_Rectificadora_De_Culatas: { horasPorDia: 8 },
    Torno_De_1500_MM: { horasPorDia: 8 },
    Mandriladora_Rectificadora_De_Valvulas: { horasPorDia: 8 },
    Mandriladora_Vertical_De_Bancadas: { horasPorDia: 8 },
    Mandriladora_Vertical_De_Bielas: { horasPorDia: 8 }
};

const distribucionMaquinas = {
    motores: {
        Mandriladora_Vertical_De_Cilindros: 4,
        Taladro_Vertical: 2,
        Torno_De_1500_MM: 3,
        Adaptadora_Y_Rectificadora_De_Culatas: 3
    },
    cigueñales: {
        Maquina_Rectificadora_del_Cigueñal: 4,
        Torno_De_1500_MM: 2
    },
    casquetes: {
        Mandriladora_Vertical_De_Cilindros: 2,
        Torno_De_1500_MM: 2
    },
      bujes_levas: {
        Mandriladora_Rectificadora_De_Valvulas: 2,
        Adaptadora_Y_Rectificadora_De_Culatas: 2
    },
    culatas: {
        Adaptadora_Y_Rectificadora_De_Culatas: 6,
        Taladro_Vertical: 2
    },
    valvulas: {
        Mandriladora_Rectificadora_De_Valvulas: 3
    },
    guias: {
        Mandriladora_Rectificadora_De_Valvulas: 2,
        Taladro_Vertical: 2
    },
    bielas: {
        Mandriladora_Vertical_De_Bielas: 4,
        Torno_De_1500_MM: 2
    },
    tapas_bancada: {
        Mandriladora_Vertical_De_Bancadas: 3,
        Torno_De_1500_MM: 2
    },
    resortes: {
        Mandriladora_Rectificadora_De_Valvulas: 2
    },
    esparragos: {
        Taladro_Vertical: 1
    },
    encamizar_bloque: {
        Mandriladora_Vertical_De_Cilindros: 5
    },
    rectificar_bloque: {
        Mandriladora_Vertical_De_Bancadas: 6
    },
    pulir_bloque: {
        Torno_De_1500_MM: 3
    },
    pulir_cigueñal: {
        Maquina_Rectificadora_del_Cigueñal: 3
    },
    cepillar_culatas: {
        Adaptadora_Y_Rectificadora_De_Culatas: 4
    },
    culatas_anillos: {
        Mandriladora_Rectificadora_De_Valvulas: 2
    },
    bases_valvulas: {
        Mandriladora_Rectificadora_De_Valvulas: 3
    },
    rimar_guias: {
        Mandriladora_Rectificadora_De_Valvulas: 2
    },
    rimar_bielas: {
        Mandriladora_Vertical_De_Bielas: 2
    },
};

function obtenerOrdenesDeLocalStorage() {
    const ordenesReparacion = JSON.parse(localStorage.getItem("ordenesReparacion")) || [];
    const ordenesCompletadas = JSON.parse(localStorage.getItem("ordenesCompletadas")) || [];
    return { ordenesReparacion, ordenesCompletadas };
}

document.addEventListener("DOMContentLoaded", () => {
    cargarOrdenesGuardadas();
    cargarOrdenesCompletadas();
    mostrarOrdenesPaginadas('reparacion');  // Cargar órdenes de reparación
    mostrarOrdenesPaginadas('realizadas');

    // Recalcular las órdenes cada 24 horas (1 día)
    setInterval(() => {
        document.getElementById("listaOrdenes").innerHTML = "";
        cargarOrdenesGuardadas();
    }, 86400000); // 24 horas en milisegundos
});


// Paso 1: Contador de órdenes vencidas
let contadorOrdenesVencidas = 0;

// Función para cargar órdenes y verificar vencidas
function cargarOrdenesGuardadas() {
    const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    
    // Reiniciar el contador de órdenes vencidas
    contadorOrdenesVencidas = 0;

    // Limpiar la lista de órdenes para evitar duplicados
    document.getElementById("listaOrdenes").innerHTML = "";

    // Recorrer y mostrar cada orden
    ordenes.forEach(orden => {
        mostrarOrden(orden);
        
        // Verifica si la orden está vencida y cuenta solo las actuales
        const tiempoRestante = calcularDiasHorasMinutosRestantes(orden.fechaHora);
        const esVencida = 
            tiempoRestante.dias === 0 && tiempoRestante.horas === 0 && 
            tiempoRestante.minutos === 0 && tiempoRestante.segundos === 0 && 
            orden.estado === "pendiente";

        if (esVencida) contadorOrdenesVencidas++;
    });

    // Mostrar alerta si hay órdenes vencidas
    if (contadorOrdenesVencidas > 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Órdenes Vencidas',
            text: `Tienes ${contadorOrdenesVencidas} orden(es) vencida(s) en la sección de reparaciones.`,
            confirmButtonText: 'Aceptar'
        });
    }
}


// Llama a cargarOrdenesGuardadas al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarOrdenesGuardadas();
    mostrarOrdenesPaginadas('reparacion');  // Cargar órdenes de reparación
    mostrarOrdenesPaginadas('realizadas');  // Cargar órdenes realizadas
});


function cargarOrdenesCompletadas() {
    const ordenesCompletadas = JSON.parse(localStorage.getItem("ordenesCompletadas")) || [];
    ordenesCompletadas
        .sort((a, b) => new Date(a.fechaCompletada) - new Date(b.fechaCompletada))
        .forEach(mostrarOrdenCompletada);
}


async function agregarOrden() {
    const cliente = document.getElementById("cliente").value.trim();
    const cedula = document.getElementById("cedula").value.trim();
    const varios = document.getElementById("varios").value.trim();
    const fechaHora = new Date().toLocaleString('es-CO', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true
    });

    let tiempo_estimado = 0;
    const serviciosSeleccionados = [];

  
    if (!cliente) {
        Swal.fire({
            icon: 'error',
            title: 'Nombre del Cliente',
            text: 'Debe ingresar un nombre de cliente.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    if (!cedula) {
        Swal.fire({
            icon: 'error',
            title: 'Cédula del Cliente',
            text: 'Debe ingresar la cédula del cliente.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }


    for (const servicio in tiempos_servicios) {
        const inputElement = document.getElementById(servicio);
        const cantidad = parseInt(inputElement?.value) || 0;
        
        if (cantidad < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Cantidad Inválida',
                text: 'Las cantidades no pueden ser negativas.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
        
        if (cantidad > 0) {
            tiempo_estimado += cantidad * tiempos_servicios[servicio];
            serviciosSeleccionados.push({ servicio, cantidad });
        }
    }

    // Agregar servicios seleccionados por checkbox
    const trabajos = [
        'encamizar_bloque', 'rectificar_bloque', 'pulir_bloque', 
        'pulir_cigueñal', 'cepillar_culatas', 'culatas_anillos', 
        'bases_valvulas', 'rimar_guias', 'rimar_bielas', 'cambio_guias',
        'cambio_buje', 'rebajar_buje', 'circulo_bancada', 
        'devolvedor_aceite', 'rebajar_pistones', 'cambio_pinon',
        'ensamblaje_bielas', 'lavado_motor'
    ];

    trabajos.forEach(trabajo => {
        const checkbox = document.getElementById(trabajo);
        if (checkbox && checkbox.checked) {
            tiempo_estimado += tiempos_servicios[trabajo];
            serviciosSeleccionados.push({ servicio: trabajo, cantidad: 1 });
        }
    });

    // Validar que se haya seleccionado al menos un servicio
    if (!serviciosSeleccionados.length) {
        Swal.fire({
            icon: 'error',
            title: 'Seleccionar Servicios',
            text: 'Debe seleccionar al menos un servicio.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Antes de agregar la orden, calcular ocupación futura y validar si excede el 100%
    const ocupacionFutura = calcularOcupacionMaquinas(); 
    let maquinaExcedida = null;
    let excesoDetectado = false;

    for (const servicio of serviciosSeleccionados) {
        const distribucion = distribucionMaquinas[servicio.servicio];
        for (const maquina in distribucion) {
            const horasRequeridas = distribucion[maquina] * servicio.cantidad;
            const ocupacionMaquina = ocupacionFutura[maquina] + (horasRequeridas / (maquinas[maquina].horasPorDia * 3)) * 100;

            // Verificar si se supera el 100%
            if (ocupacionMaquina > 100) {
                maquinaExcedida = maquina;
                excesoDetectado = true;  // Marcamos que hay exceso de capacidad
                break;  // Salimos del bucle una vez detectado
            }

            // Verificar si la capacidad llega exactamente al 100%
            if (ocupacionMaquina === 100) {
                await Swal.fire({
                    icon: 'info',
                    title: 'Capacidad Máxima Alcanzada',
                    text: `La máquina ${maquina} ha alcanzado su capacidad máxima (${ocupacionMaquina.toFixed(2)}%).`,
                    confirmButtonText: 'Aceptar'
                });
            }

            // Verificar si se supera el 70%
            if (ocupacionMaquina >= 70 && ocupacionMaquina <= 99) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Advertencia',
                    text: `La máquina ${maquina} está alcanzando su capacidad máxima (${ocupacionMaquina.toFixed(2)}%).`,
                    confirmButtonText: 'Aceptar'
                });
            }
        }

        if (excesoDetectado) break;  // Salimos del bucle exterior si hay exceso
    }

    // Si alguna máquina supera el 100%, no agregar la orden
    if (excesoDetectado) {
        await Swal.fire({
            icon: 'error',
            title: 'Máquina Excedida',
            text: `No se puede agregar la orden porque la máquina ${maquinaExcedida} ha alcanzado su límite de capacidad.`,
            confirmButtonText: 'Aceptar'
        });
        return;  // Salimos de la función sin agregar la orden ni mostrar mensajes de éxito
    }

    // Crear la nueva orden
    const nuevaOrden = {
        cliente,
        cedula,
        tiempo_estimado,
        fechaHora,
        varios,
        servicios: serviciosSeleccionados,
        estado: "pendiente"
    };

    const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    ordenes.push(nuevaOrden);
    localStorage.setItem("ordenes", JSON.stringify(ordenes));

    // Mostrar notificación de éxito
    Swal.fire({
        icon: 'success',
        title: 'Orden Agregada',
        text: 'La orden se ha agregado correctamente.',
        confirmButtonText: 'Aceptar'
    });

    // Actualizar interfaz
    mostrarOrden(nuevaOrden);
    mostrarOrdenesPaginadas('reparacion');
    mostrarOcupacionMaquinas(); 
    mostrarServiciosDisponibles();
    generarGraficoServiciosPorDia();
    generarGraficoOrdenesCompletadas();
    
    // Reiniciar el formulario
    document.getElementById('servicioForm').reset();
}



// Función para mostrar ocupación de las máquinas en la página con barras de progreso mejoradas
function mostrarOcupacionMaquinas() {
    const ocupacion = calcularOcupacionMaquinas();
    const ocupacionDiv = document.getElementById("ocupacionMaquinas");
    ocupacionDiv.innerHTML = ''; // Limpiar contenido anterior

    for (const maquina in ocupacion) {
        const porcentaje = ocupacion[maquina].toFixed(2);

        const ocupacionHTML = `
            <div>
                <p><strong>${maquina}:</strong></p>
                <div class="occupancy-bar-container">
                    <div class="occupancy-bar" style="width: ${Math.min(porcentaje, 100)}%; background: ${obtenerColorPorcentaje(porcentaje)};">
                        <span class="occupancy-bar-label">${porcentaje}%</span>
                    </div>
                </div>
            </div>
        `;
        ocupacionDiv.innerHTML += ocupacionHTML;
    }
}

// Función para obtener el color según el porcentaje de ocupación
function obtenerColorPorcentaje(porcentaje) {
    if (porcentaje <= 70) {
        return 'linear-gradient(to right, #4caf50, #8bc34a)'; // Verde
    } else if (porcentaje >= 70 && porcentaje < 100) {
        return 'linear-gradient(to right, #ffeb3b, #ffc107)'; // Amarillo
    } else {
        return 'linear-gradient(to right, #f44336, #e91e63)'; // Rojo
    }
}

//----------------------------------------------------------------------------------------------------

// Función para mostrar cuántos servicios se pueden realizar con la ocupación actual
function mostrarServiciosDisponibles() {
    const ocupacion = calcularOcupacionMaquinas();
    const capacidadesDiv = document.getElementById("capacidadesMaquinas");
    capacidadesDiv.innerHTML = ''; // Limpiar contenido anterior

    for (const servicio in distribucionMaquinas) {
        let cantidadMaxima = Infinity; // Suponemos inicialmente que se puede hacer un número infinito

        // Verificamos cuántas veces se puede realizar este servicio basándonos en las máquinas disponibles
        for (const maquina in distribucionMaquinas[servicio]) {
            const horasServicio = distribucionMaquinas[servicio][maquina];
            const capacidadRestante = maquinas[maquina].horasPorDia * 3 - (ocupacion[maquina] / 100 * maquinas[maquina].horasPorDia * 3);
            
            // Calcular cuántas veces se puede realizar este servicio en esta máquina
            const cantidadPosible = Math.floor(capacidadRestante / horasServicio);

            // La cantidad máxima posible estará limitada por la máquina con menor capacidad
            if (cantidadPosible < cantidadMaxima) {
                cantidadMaxima = cantidadPosible;
            }
        }

        // Si la cantidad máxima es mayor que 0, mostramos el servicio como disponible
        if (cantidadMaxima > 0) {
            capacidadesDiv.innerHTML += `<p><strong>${capitalizar(servicio)}:</strong> Se pueden realizar ${cantidadMaxima}</p>`;
            habilitarServicio(servicio, true);  // Habilitamos el servicio en el formulario
        } else {
            // Si no hay capacidad, mostramos el mensaje y deshabilitamos el servicio en el formulario
            capacidadesDiv.innerHTML += `<p><strong>${capitalizar(servicio)}:</strong> No se puede realizar por falta de capacidad</p>`;
            habilitarServicio(servicio, false);  // Deshabilitamos el servicio en el formulario
        }
    }
}

// Función para habilitar o deshabilitar servicios en el formulario según disponibilidad
function habilitarServicio(servicio, habilitar) {
    const inputCantidad = document.getElementById(servicio);
    const checkbox = document.getElementById(servicio);

    if (inputCantidad) {
        inputCantidad.disabled = !habilitar;  // Deshabilitar si no hay capacidad
    }

    if (checkbox && checkbox.type === "checkbox") {
        checkbox.disabled = !habilitar;  // Deshabilitar el checkbox si no hay capacidad
    }
}

// Función para capitalizar los nombres de los servicios
function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Llamar a esta función cada vez que se actualicen las ocupaciones
document.addEventListener("DOMContentLoaded", () => {
    mostrarOcupacionMaquinas(); // Mostrar ocupación al cargar la página
    mostrarServiciosDisponibles(); // Mostrar los servicios que se pueden realizar
});


// Llamar a esta función cada vez que se actualicen las ocupaciones
document.addEventListener("DOMContentLoaded", () => {
    mostrarOcupacionMaquinas();
});


// Llamar a esta función al cargar la página y cuando se actualicen las órdenes
document.addEventListener("DOMContentLoaded", () => {
    mostrarOcupacionMaquinas(); // Mostrar al cargar la página

    // Recalcular y mostrar ocupación al cargar las órdenes
    cargarOrdenesGuardadas = () => {
        const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
        ordenes.forEach(mostrarOrden);
        mostrarOcupacionMaquinas(); // Actualizar ocupación
    };
});


function calcularDiasHorasMinutosRestantes(fechaCreacionStr) {
    const ahora = new Date(); // Fecha y hora actuales
    const fechaCreacion = convertirFechaADate(fechaCreacionStr); // Convertimos la fecha

    if (isNaN(fechaCreacion)) {
        console.error("Fecha inválida:", fechaCreacionStr);
        return { dias: NaN, horas: NaN, minutos: NaN, segundos: NaN };
    }

    const milisegundosPorDia = 1000 * 60 * 60 * 24;
    const tiempoFinal = fechaCreacion.getTime() + (3 * milisegundosPorDia) - 1000;

    const milisegundosRestantes = tiempoFinal - ahora.getTime();

    if (milisegundosRestantes <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0 };

    const dias = Math.floor(milisegundosRestantes / milisegundosPorDia);
    const horas = Math.floor((milisegundosRestantes % milisegundosPorDia) / (1000 * 60 * 60));
    const minutos = Math.floor((milisegundosRestantes % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((milisegundosRestantes % (1000 * 60)) / 1000);

    return { dias, horas, minutos, segundos };
}


function convertirFechaADate(fechaStr) {
    const [dia, mes, año] = fechaStr.split('/').map(Number); // Aseguramos que los valores sean numéricos
    return new Date(año, mes - 1, dia); // Mes en Date va de 0 a 11
}

function actualizarTiempoRestanteEnOrden(elementoOrden, fechaHora) {
    const intervalo = setInterval(() => {
        const tiempoRestante = calcularDiasHorasMinutosRestantes(fechaHora);
        const tiempoElemento = elementoOrden.querySelector('.dias-restantes');

        // Intentamos obtener el select de estado
        const selectEstado = elementoOrden.querySelector('select'); 

        // Verificamos si el select existe antes de continuar
        if (!selectEstado) {
            console.warn("Select de estado no encontrado.");
            clearInterval(intervalo); // Detenemos el intervalo para evitar errores
            return;
        }

        const estado = selectEstado.value; // Ahora estamos seguros de que no es null

        // Validamos si el tiempo ha llegado a 0
        const esTiempoAgotado =
            tiempoRestante.dias === 0 &&
            tiempoRestante.horas === 0 &&
            tiempoRestante.minutos === 0 &&
            tiempoRestante.segundos === 0;

        if (esTiempoAgotado) {
            if (estado === "pendiente") {
                // Cambiar texto a "Vencida" y aplicar clase CSS
                tiempoElemento.innerText = "Vencida";
                elementoOrden.classList.add('vencida');
            }
            clearInterval(intervalo); // Detener el temporizador
        } else {
            // Actualizamos el tiempo restante en pantalla
            tiempoElemento.innerText = 
                `${tiempoRestante.dias} días, ${tiempoRestante.horas} horas, ` +
                `${tiempoRestante.minutos} minutos, ${tiempoRestante.segundos} segundos`;
        }
    }, 1000); // Actualiza cada segundo
}

/*

function mostrarOrden(orden) {
    const lista = document.getElementById("listaOrdenes");
    const li = document.createElement("li");
    li.classList.add("orden-item");
    li.setAttribute("data-fecha", orden.fechaHora);

    // Asignar clase según el estado
    switch (orden.estado) {
        case "en_progreso":
            li.classList.add("en-progreso");
            break;
        case "completado":
            li.classList.add("completado");
            break;
        default:
            li.classList.add("pendiente");
            break;
    }

    li.innerHTML = `
    <div class="orden-detalle">
        <p><strong>Cliente:</strong> ${orden.cliente}</p>
        <p><strong>Tiempo Estimado:</strong> ${orden.tiempo_estimado} horas</p>
        <p><strong>Fecha:</strong> ${orden.fechaHora}</p>
        <span class="dias-restantes"></span>

        <!-- Selector de Estado -->
        <label for="estado-${orden.fechaHora}">Estado:</label>
        <select id="estado-${orden.fechaHora}" class="estado-select" onchange="actualizarEstadoOrden('${orden.fechaHora}')">
            <option value="pendiente" ${orden.estado === "pendiente" ? "selected" : ""}>Pendiente</option>
            <option value="en_progreso" ${orden.estado === "en_progreso" ? "selected" : ""}>En Progreso</option>
            <option value="completado" ${orden.estado === "completado" ? "selected" : ""}>Completado</option>
        </select>
    </div>
    <button class="detalle-btn" onclick="mostrarDetalleOrden('${orden.fechaHora}')">Detalle</button>
    <button class="completar-btn" onclick="marcarOrdenCompletada('${orden.fechaHora}')">Marcar como Completada</button>
    <button class="eliminar-btn" onclick="eliminarOrden('${orden.fechaHora}')">Eliminar</button>
    `;

    lista.appendChild(li);

    // Iniciar el temporizador para esta orden
    actualizarTiempoRestanteEnOrden(li, orden.fechaHora);
}
*/

function mostrarOrden(orden) {
    const lista = document.getElementById("listaOrdenes");
    const li = document.createElement("li");
    li.classList.add("orden-item");
    li.setAttribute("data-fecha", orden.fechaHora);

    switch (orden.estado) {
        case "en_progreso":
            li.classList.add("en-progreso");
            break;
        case "completado":
            li.classList.add("completado");
            break;
        default:
            li.classList.add("pendiente");
            break;
    }

    li.innerHTML = `
    <div class="orden-detalle">
        <p><strong>Cliente:</strong> ${orden.cliente}</p>
        <p><strong>Tiempo Estimado:</strong> ${orden.tiempo_estimado} horas</p>
        <p><strong>Fecha:</strong> ${orden.fechaHora}</p>
        <span class="dias-restantes"></span>

        <!-- Selector de Estado -->
        <label for="estado-${orden.fechaHora}">Estado:</label>
        <select id="estado-${orden.fechaHora}" class="estado-select" onchange="actualizarEstadoOrden('${orden.fechaHora}')">
            <option value="pendiente" ${orden.estado === "pendiente" ? "selected" : ""}>Pendiente</option>
            <option value="en_progreso" ${orden.estado === "en_progreso" ? "selected" : ""}>En Progreso</option>
            <option value="completado" ${orden.estado === "completado" ? "selected" : ""}>Completado</option>
        </select>

    </div>
    <button class="detalle-btn" onclick="mostrarDetalleOrdenReparacion('${orden.fechaHora}')">Detalle</button>
    <button class="completar-btn" onclick="marcarOrdenCompletada('${orden.fechaHora}')">Marcar como Completada</button>
    <button class="eliminar-btn" onclick="eliminarOrden('${orden.fechaHora}')">Eliminar</button>
    `;
    lista.appendChild(li);

    actualizarTiempoRestanteEnOrden(li, orden.fechaHora);
}

function mostrarOrdenCompletada(orden) {
    const lista = document.getElementById("listaOrdenesCompletadas");
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="orden-detalle">
            <p><strong>Cliente:</strong> ${orden.cliente}</p>
            <p><strong>Tiempo Estimado:</strong> ${orden.tiempo_estimado} horas</p>
            <p><strong>Fecha Ingreso:</strong> ${orden.fechaHora}</p>
            <p><strong>Fecha Completada:</strong> ${orden.fechaCompletada}</p>
            ${orden.varios ? `<p><strong>Varios:</strong> ${orden.varios}</p>` : ""}
        </div>
        <button class="detalle-btn" onclick="mostrarDetalleOrdenRealizada('${orden.fechaHora}')">Detalle</button>
    `;
    lista.appendChild(li);
}

let paginaActualReparacion = 1;  // Página actual de las órdenes de reparación
let paginaActualRealizadas = 1;  // Página actual de las órdenes realizadas
const ordenesPorPagina = 3;  // Cantidad de órdenes a mostrar por página

function mostrarOrdenesPaginadas(tipo) {
    const listaElement = tipo === 'reparacion' ? "listaOrdenes" : "listaOrdenesCompletadas";
    const paginaActual = tipo === 'reparacion' ? paginaActualReparacion : paginaActualRealizadas;
    const ordenes = JSON.parse(localStorage.getItem(tipo === 'reparacion' ? "ordenes" : "ordenesCompletadas")) || [];
    
    // Calcular los índices de inicio y fin de las órdenes a mostrar
    const inicio = (paginaActual - 1) * ordenesPorPagina;
    const fin = inicio + ordenesPorPagina;
    const ordenesPaginadas = ordenes.slice(inicio, fin);

    // Limpiar la lista antes de mostrar las órdenes de la página actual
    document.getElementById(listaElement).innerHTML = "";
    ordenesPaginadas.forEach(tipo === 'reparacion' ? mostrarOrden : mostrarOrdenCompletada);

    // Mostrar los controles de paginación
    mostrarControlesPaginacion(tipo, ordenes.length);
}

function mostrarControlesPaginacion(tipo, totalOrdenes) {
    const listaElement = tipo === 'reparacion' ? "listaOrdenes" : "listaOrdenesCompletadas";
    const paginaActual = tipo === 'reparacion' ? paginaActualReparacion : paginaActualRealizadas;
    const totalPaginas = Math.ceil(totalOrdenes / ordenesPorPagina);

    // Actualizar el indicador de la paginación
    const paginacionIndicador = tipo === 'reparacion' 
        ? document.getElementById("paginacionIndicadorReparacion") 
        : document.getElementById("paginacionIndicadorRealizadas");

    paginacionIndicador.textContent = `Página ${paginaActual} de ${totalPaginas}`;

    // Eliminar el contenedor de paginación existente si existe
    const controlesExistentes = document.querySelector(`#${listaElement} + .pagination-container`);
    if (controlesExistentes) {
        controlesExistentes.remove();
    }

    // Crear el nuevo contenedor de paginación con botones en línea
    let paginacionHTML = `
        <div class="pagination-container">
            <button onclick="cambiarPagina('${tipo}', ${paginaActual - 1})" ${paginaActual === 1 ? 'disabled' : ''}>Anterior</button>
            <button onclick="cambiarPagina('${tipo}', ${paginaActual + 1})" ${paginaActual === totalPaginas ? 'disabled' : ''}>Siguiente</button>
        </div>`;

    // Agregar el nuevo contenedor de paginación al final de la lista de órdenes
    document.getElementById(listaElement).insertAdjacentHTML('afterend', paginacionHTML);
}



function cambiarPagina(tipo, pagina) {
    if (tipo === 'reparacion') {
        paginaActualReparacion = pagina;
    } else {
        paginaActualRealizadas = pagina;
    }
    mostrarOrdenesPaginadas(tipo);
}


// Coloca esta función en `Script.js`
let ordenAscendente = true; // Variable para alternar entre ascendente y descendente

function ordenarPorNombre(tipo) {
    const listaElement = tipo === 'reparacion' ? "listaOrdenes" : "listaOrdenesCompletadas";
    const ordenes = JSON.parse(localStorage.getItem(tipo === 'reparacion' ? "ordenes" : "ordenesCompletadas")) || [];

    ordenes.sort((a, b) => {
        const nombreA = a.cliente.toLowerCase();
        const nombreB = b.cliente.toLowerCase();
        return ordenAscendente ? nombreA.localeCompare(nombreB) : nombreB.localeCompare(nombreA);
    });

    ordenAscendente = !ordenAscendente;

    // Limpiar la lista y mostrar en el nuevo orden
    document.getElementById(listaElement).innerHTML = "";
    ordenes.forEach(tipo === 'reparacion' ? mostrarOrden : mostrarOrdenCompletada);
}



// agregamos calcularOcupacionMaquinas ---------------------------------------------------------------

// Función para calcular ocupación de las máquinas
function calcularOcupacionMaquinas() {
    const maquinasOcupadas = {}; // Guardará las horas ocupadas por máquina
    const maquinasTotales = {};  // Total de horas por máquina (8 horas por día, 3 días)

    // Inicializar cada máquina con sus horas totales (8 horas por día * 3 días)
    for (const maquina in maquinas) {
        maquinasOcupadas[maquina] = 0; // Comienza sin horas ocupadas
        maquinasTotales[maquina] = maquinas[maquina].horasPorDia * 3; // 3 días
    }

    // Recorrer todas las órdenes pendientes o en progreso
    const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    ordenes.forEach(orden => {
        if (orden.estado === "pendiente" || orden.estado === "en_progreso") {
            orden.servicios.forEach(servicio => {
                const distribucion = distribucionMaquinas[servicio.servicio];
                for (const maquina in distribucion) {
                    const horasServicio = distribucion[maquina] * servicio.cantidad;
                    maquinasOcupadas[maquina] += horasServicio;
                }
            });
        }
    });

    // Calcular el porcentaje de ocupación de cada máquina
    const ocupacionMaquinas = {};
    for (const maquina in maquinasOcupadas) {
        ocupacionMaquinas[maquina] = (maquinasOcupadas[maquina] / maquinasTotales[maquina]) * 100;
    }

    return ocupacionMaquinas;
}


// Función para mostrar los servicios que cada máquina puede hacer
function mostrarCapacidadesMaquinas() {
    const ocupacion = calcularOcupacionMaquinas();
    const capacidadesDiv = document.getElementById("capacidadesMaquinas");
    capacidadesDiv.innerHTML = ''; // Limpiar contenido anterior

    for (const maquina in maquinas) {
        const capacidadRestante = maquinas[maquina].horasPorDia * 3 - (ocupacion[maquina] / 100 * maquinas[maquina].horasPorDia * 3);
        
        // Obtener los servicios que esta máquina puede hacer
        const serviciosDisponibles = [];
        for (const servicio in distribucionMaquinas) {
            if (distribucionMaquinas[servicio][maquina]) {
                const horasServicio = distribucionMaquinas[servicio][maquina];
                const cantidadPosible = Math.floor(capacidadRestante / horasServicio);
                if (cantidadPosible > 0) {
                    serviciosDisponibles.push(`${cantidadPosible} ${servicio}`);
                }
            }
        }

        // Mostrar la información de cada máquina y los servicios que puede realizar
        const capacidadHTML = `
            <p><strong>${maquina}:</strong> ${serviciosDisponibles.length ? serviciosDisponibles.join(', ') : 'Sin capacidad para realizar más servicios'}</p>
        `;
        capacidadesDiv.innerHTML += capacidadHTML;
    }
}


function marcarOrdenCompletada(fechaHora) {
    const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    const ordenCompletada = ordenes.find(orden => orden.fechaHora === fechaHora);

    if (ordenCompletada) {
        // Verificar si la orden estaba vencida
        const tiempoRestante = calcularDiasHorasMinutosRestantes(ordenCompletada.fechaHora);
        const esVencida = 
            tiempoRestante.dias === 0 && tiempoRestante.horas === 0 && 
            tiempoRestante.minutos === 0 && tiempoRestante.segundos === 0 && 
            ordenCompletada.estado === "pendiente";
        
        // Actualizamos la fecha de completación y el estado
        ordenCompletada.fechaCompletada = new Date().toLocaleString('es-CO', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: true
        });

        // Actualizamos localStorage
        const ordenesCompletadas = JSON.parse(localStorage.getItem("ordenesCompletadas")) || [];
        ordenesCompletadas.push(ordenCompletada);
        localStorage.setItem("ordenesCompletadas", JSON.stringify(ordenesCompletadas));

        const nuevasOrdenes = ordenes.filter(orden => orden.fechaHora !== fechaHora);
        localStorage.setItem("ordenes", JSON.stringify(nuevasOrdenes));

        // Disminuir el contador de órdenes vencidas si se completó una
        if (esVencida) contadorOrdenesVencidas--;

        // Actualizar la interfaz y alerta
        document.getElementById("listaOrdenes").innerHTML = "";
        cargarOrdenesGuardadas();
        mostrarOrdenesPaginadas('reparacion');
        mostrarOrdenesPaginadas('realizadas');

        // Mostrar la alerta de actualizada
        if (contadorOrdenesVencidas > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Órdenes Vencidas',
                text: `Tienes ${contadorOrdenesVencidas} orden(es) vencida(s) restante(s).`,
                confirmButtonText: 'Aceptar'
            });
        }

    } else {
        Swal.fire({
            icon: 'error',
            title: 'Orden no encontrada',
            text: 'No se pudo encontrar la orden para completar.',
            confirmButtonText: 'Aceptar'
        });
    }
}

// Mostrar detalles de una orden

/*

function mostrarDetalleOrden(fechaHora) {
    const orden = obtenerOrdenPorFecha(fechaHora);
    if (orden) {
        document.getElementById('detalleCliente').textContent = orden.cliente;
        document.getElementById('detalleTiempo').textContent = `${orden.tiempo_estimado} horas`;
        document.getElementById('detalleFecha').textContent = orden.fechaHora;
        document.getElementById('detalleVarios').textContent = orden.varios || 'N/A';
        document.getElementById('detalleFechaCompletada').textContent = orden.fechaCompletada || 'No completada';

        const listaServicios = document.getElementById('detalleServicios');
        listaServicios.innerHTML = '';
        orden.servicios.forEach(s => {
            const li = document.createElement('li');
            li.textContent = `${capitalizar(s.servicio)}: ${s.cantidad}`;
            listaServicios.appendChild(li);
        });               

        document.getElementById('detalleOrden').style.display = 'block';
    }
}

function cerrarDetalle() {
    document.getElementById('detalleOrden').style.display = 'none';
}

*/

// Función para mostrar detalles de una orden en reparación
function mostrarDetalleOrdenReparacion(fechaHora) {
    const orden = obtenerOrdenPorFecha(fechaHora, false); // false indica órdenes en reparación
    if (orden) {
        document.getElementById('detalleClienteReparacion').textContent = orden.cliente;
        document.getElementById('detalleCedulaReparacion').textContent = orden.cedula || 'N/A'; // Cambiado el ID
        document.getElementById('detalleTiempoReparacion').textContent = `${orden.tiempo_estimado} horas`;
        document.getElementById('detalleFechaReparacion').textContent = orden.fechaHora;
        document.getElementById('detalleVariosReparacion').textContent = orden.varios || 'N/A';

        const listaServicios = document.getElementById('detalleServiciosReparacion');
        listaServicios.innerHTML = '';
        orden.servicios.forEach(s => {
            const li = document.createElement('li');
            li.textContent = `${capitalizar(s.servicio)}: ${s.cantidad}`;
            listaServicios.appendChild(li);
        });

        document.getElementById('detalleOrdenReparacion').style.display = 'block';
    }
}


// Función para mostrar detalles de una orden realizada
function mostrarDetalleOrdenRealizada(fechaHora) {
    const orden = obtenerOrdenPorFecha(fechaHora, true); // true indica que es una orden realizada
    if (orden) {
        // Información del cliente, tiempos y fechas
        document.getElementById('detalleClienteRealizada').textContent = orden.cliente;
        document.getElementById('detalleCedulaRealizada').textContent = orden.cedula || 'N/A';
        document.getElementById('detalleTiempoEstimadoRealizada').textContent = `${orden.tiempo_estimado} horas`;
        document.getElementById('detalleFechaRealizada').textContent = orden.fechaHora;
        document.getElementById('detalleFechaCompletadaRealizada').textContent = orden.fechaCompletada || 'No completada';
        document.getElementById('detalleVariosRealizada').textContent = orden.varios || 'N/A';

        const listaServicios = document.getElementById('detalleServiciosRealizada');
        listaServicios.innerHTML = '';
        orden.servicios.forEach(s => {
            const li = document.createElement('li');
            li.textContent = `${capitalizar(s.servicio)}: ${s.cantidad}`;
            listaServicios.appendChild(li);
        });

        // Calcular y mostrar el tiempo real
        if (orden.fechaCompletada) {
            const tiempoReal = calcularTiempoReal(orden.fechaHora, orden.fechaCompletada);
            document.getElementById('detalleTiempoReal').textContent = 
                `${tiempoReal.dias} días, ${tiempoReal.horas} horas, ${tiempoReal.minutos} minutos y ${tiempoReal.segundos} segundos`;

            // Verificar si el tiempo real es estrictamente mayor a 3 días
            const estadoCumplimiento = (tiempoReal.dias > 3 || 
                                        (tiempoReal.dias === 3 && (tiempoReal.horas > 0 || tiempoReal.minutos > 0 || tiempoReal.segundos > 0)))
                                        ? "Vencida" : "Cumplido a Tiempo";

            document.getElementById('detalleEstadoRealizada').textContent = estadoCumplimiento;

            // Asignar la clase "vencida" si el tiempo real es mayor a 3 días
            if (estadoCumplimiento === "Vencida") {
                document.getElementById('detalleEstadoRealizada').classList.add('vencida');
            } else {
                document.getElementById('detalleEstadoRealizada').classList.remove('vencida');
            }
        }

        document.getElementById('detalleOrdenRealizada').style.display = 'block';
    }
}

// Funciones para cerrar los detalles
function cerrarDetalleReparacion() {
    document.getElementById('detalleOrdenReparacion').style.display = 'none';
}

function cerrarDetalleRealizada() {
    document.getElementById('detalleOrdenRealizada').style.display = 'none';
}


// Mostrar orden completada en la lista
function mostrarOrdenCompletada(orden) {
    const lista = document.getElementById("listaOrdenesCompletadas");
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="orden-detalle">
            <p><strong>Cliente:</strong> ${orden.cliente}</p>
            <p><strong>Tiempo Estimado:</strong> ${orden.tiempo_estimado} horas</p>
            <p><strong>Fecha Ingreso:</strong> ${orden.fechaHora}</p>
            <p><strong>Fecha Completada:</strong> ${orden.fechaCompletada}</p>
            ${orden.varios ? `<p><strong>Varios:</strong> ${orden.varios}</p>` : ""}
        </div>
        <button class="detalle-btn" onclick="mostrarDetalleOrdenRealizada('${orden.fechaHora}')">Detalle</button>
    `;
    lista.appendChild(li);
}

// Obtener una orden por fecha

/*

function obtenerOrdenPorFecha(fechaHora) {
    const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    const ordenesCompletadas = JSON.parse(localStorage.getItem("ordenesCompletadas")) || [];
    return ordenes.find(o => o.fechaHora === fechaHora) || ordenesCompletadas.find(o => o.fechaHora === fechaHora);
}

*/

function obtenerOrdenPorFecha(fechaHora, esCompletada) {
    const ordenes = JSON.parse(localStorage.getItem(esCompletada ? "ordenesCompletadas" : "ordenes")) || [];
    return ordenes.find(o => o.fechaHora === fechaHora);
}


// Búsqueda de órdenes
function buscarOrden() {
    const termino = normalizeString(document.getElementById("buscador").value);
    const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    const resultados = ordenes.filter(orden => normalizeString(orden.cliente).includes(termino));

    document.getElementById("listaOrdenes").innerHTML = "";
    resultados.forEach(mostrarOrden);
}

function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Función para normalizar una fecha (quitar horas, minutos y segundos)
function normalizarFecha(fecha) {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setHours(0, 0, 0, 0); // Establece la hora a las 00:00:00
    return nuevaFecha;
}

function filtrarOrdenesPorFecha() {
    const fechaInicioInput = document.getElementById("fechaInicio").value;
    const fechaFinInput = document.getElementById("fechaFin").value;

    const fechaInicio = fechaInicioInput ? new Date(fechaInicioInput) : null;
    const fechaFin = fechaFinInput ? new Date(fechaFinInput) : null;

    const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];

    const ordenesFiltradas = ordenes.filter(orden => {
        const fechaOrden = convertirFechaADate(orden.fechaHora);

        if (fechaInicio && fechaFin) {
            return fechaOrden >= fechaInicio && fechaOrden <= fechaFin;
        } else if (fechaInicio) {
            return fechaOrden >= fechaInicio;
        } else if (fechaFin) {
            return fechaOrden <= fechaFin;
        }
        return true;  // Mostrar todas si no hay filtros
    });

    document.getElementById("listaOrdenes").innerHTML = "";
    ordenesFiltradas.forEach(mostrarOrden);
}

function filtrarOrdenesPorEstado() {
    const estadoSeleccionado = document.getElementById("filtro-estado").value;
    const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    const lista = document.getElementById("listaOrdenes");

    lista.innerHTML = ""; // Limpiar la lista

    // Filtrar y mostrar las órdenes que coincidan con el estado seleccionado
    ordenes
        .filter(orden => estadoSeleccionado === "todos" || orden.estado === estadoSeleccionado)
        .forEach(mostrarOrden);
}

function filtrarOrdenesCompletadasPorFecha() {
    const fechaInicioInput = document.getElementById("fechaInicioCompletadas").value;
    const fechaFinInput = document.getElementById("fechaFinCompletadas").value;

    const fechaInicio = fechaInicioInput ? new Date(fechaInicioInput) : null;
    const fechaFin = fechaFinInput ? new Date(fechaFinInput) : null;

    const ordenesCompletadas = JSON.parse(localStorage.getItem("ordenesCompletadas")) || [];

    const ordenesFiltradas = ordenesCompletadas.filter(orden => {
        const fechaOrden = convertirFechaADate(orden.fechaHora);

        if (fechaInicio && fechaFin) {
            return fechaOrden >= fechaInicio && fechaOrden <= fechaFin;
        } else if (fechaInicio) {
            return fechaOrden >= fechaInicio;
        } else if (fechaFin) {
            return fechaOrden <= fechaFin;
        }
        return true;  // Mostrar todas si no hay filtros
    });

    document.getElementById("listaOrdenesCompletadas").innerHTML = "";
    ordenesFiltradas.forEach(mostrarOrdenCompletada);
}

// Limpiar los filtros y reiniciar las listas
function limpiarFiltrosReparacion() {
    document.getElementById("fechaInicio").value = '';
    document.getElementById("fechaFin").value = '';
    document.getElementById("filtro-estado").value = 'todos';

    // Reiniciar la página a la primera
    paginaActualReparacion = 1;

    // Recarga todas las órdenes en reparación y actualiza la paginación
    cargarOrdenesGuardadas();
    mostrarOrdenesPaginadas('reparacion');
}

function limpiarFiltrosRealizadas() {
    document.getElementById("fechaInicioCompletadas").value = '';
    document.getElementById("fechaFinCompletadas").value = '';

    // Reiniciar la página a la primera
    paginaActualRealizadas = 1;

    // Recarga todas las órdenes completadas y actualiza la paginación
    cargarOrdenesCompletadas();
    mostrarOrdenesPaginadas('realizadas');
}

function convertirFechaADate(fechaStr) {
    // Asegura que se reemplaza bien la separación entre fecha y hora
    const [fecha, hora] = fechaStr.split(', ');
    const [dia, mes, año] = fecha.split('/').map(Number); // Convertimos a números
    const [horaStr, periodo] = hora.split(' ');
    let [horas, minutos, segundos] = horaStr.split(':').map(Number);

    // Ajustar la hora según AM/PM
    if (periodo === 'p. m.' && horas < 12) horas += 12;
    if (periodo === 'a. m.' && horas === 12) horas = 0;

    return new Date(año, mes - 1, dia, horas, minutos, segundos);
}


function buscarOrdenCompletada() {
    const termino = normalizeString(document.getElementById("buscadorCompletadas").value);
    const ordenesCompletadas = JSON.parse(localStorage.getItem("ordenesCompletadas")) || [];

    const resultados = ordenesCompletadas.filter(orden => 
        normalizeString(orden.cliente).includes(termino)
    );

    document.getElementById("listaOrdenesCompletadas").innerHTML = "";
    resultados.forEach(mostrarOrdenCompletada);
}

function eliminarOrden(fechaHora) {
    // Confirmación de eliminación como en el primer código
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
            const ordenAEliminar = ordenes.find(orden => orden.fechaHora === fechaHora);

            if (ordenAEliminar) {
                // Verificar si la orden estaba vencida
                const tiempoRestante = calcularDiasHorasMinutosRestantes(ordenAEliminar.fechaHora);
                const esVencida = 
                    tiempoRestante.dias === 0 && tiempoRestante.horas === 0 && 
                    tiempoRestante.minutos === 0 && tiempoRestante.segundos === 0 && 
                    ordenAEliminar.estado === "pendiente";

                // Filtrar la orden eliminada y actualizar localStorage
                ordenes = ordenes.filter(orden => orden.fechaHora !== fechaHora);
                localStorage.setItem("ordenes", JSON.stringify(ordenes));

                // Disminuir el contador de órdenes vencidas si se eliminó una orden vencida
                if (esVencida) contadorOrdenesVencidas--;

                // Actualizar la interfaz
                document.getElementById("listaOrdenes").innerHTML = "";
                cargarOrdenesGuardadas();
                mostrarOrdenesPaginadas('reparacion');
                mostrarOcupacionMaquinas();
                mostrarServiciosDisponibles();
                generarGraficoServiciosPorDia();
                generarGraficoOrdenesCompletadas();

                // Mostrar mensaje de éxito de eliminación
                Swal.fire(
                    'Eliminado!',
                    'La orden ha sido eliminada correctamente.',
                    'success'
                );
            } else {
                // Alerta en caso de que no se encuentre la orden
                Swal.fire({
                    icon: 'error',
                    title: 'Orden no encontrada',
                    text: 'No se pudo encontrar la orden para eliminar.',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    });
}


function actualizarEstadoOrden(fechaHora) {
    const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    const orden = ordenes.find(o => o.fechaHora === fechaHora);

    if (orden) {
        const nuevoEstado = document.getElementById(`estado-${fechaHora}`).value;
        console.log(`Nuevo estado: ${nuevoEstado}`);  // Verificar el estado
        orden.estado = nuevoEstado;
        localStorage.setItem("ordenes", JSON.stringify(ordenes));

        // Actualizar el estilo del elemento en tiempo real
        const li = document.querySelector(`li[data-fecha="${fechaHora}"]`);
        if (li) {
            console.log("Elemento encontrado:", li); // Asegúrate de que selecciona el <li>
            li.classList.remove("pendiente", "en-progreso", "completado"); // Limpiar clases previas
            li.classList.add(nuevoEstado.replace('_', '-')); // Añadir la clase correspondiente
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    // Detectar el tema preferido del usuario
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Cargar el tema desde localStorage o usar el esquema preferido
    const currentTheme = localStorage.getItem("theme") || (prefersDarkScheme.matches ? "dark" : "light");
    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    // Cambiar tema al hacer clic en el botón
    const themeToggleButton = document.querySelector(".checkbox");

    if (themeToggleButton) {
        themeToggleButton.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            // Guardar la preferencia del usuario
            const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
            localStorage.setItem("theme", theme);

            // Recargar órdenes con paginación para aplicar los estilos correctos
            mostrarOrdenesPaginadas('reparacion');
            mostrarOrdenesPaginadas('realizadas');
            
            // Refrescar la paginación
            mostrarControlesPaginacion('reparacion', JSON.parse(localStorage.getItem("ordenes")).length);
            mostrarControlesPaginacion('realizadas', JSON.parse(localStorage.getItem("ordenesCompletadas")).length);
        });
    }
});


// Funciones anteriores...

function formatearTiempoReal(fechaInicioStr, fechaFinStr) {
    const tiempoReal = calcularTiempoReal(fechaInicioStr, fechaFinStr);
    
    if (tiempoReal.dias > 0) {
        return `${tiempoReal.dias} días, ${tiempoReal.horas} horas, ${tiempoReal.minutos} minutos y ${tiempoReal.segundos} segundos`;
    } else if (tiempoReal.horas > 0) {
        return `${tiempoReal.horas} horas, ${tiempoReal.minutos} minutos y ${tiempoReal.segundos} segundos`;
    } else if (tiempoReal.minutos > 0) {
        return `${tiempoReal.minutos} minutos y ${tiempoReal.segundos} segundos`;
    } else {
        return `${tiempoReal.segundos} segundos`;
    }
}


function calcularTiempoReal(fechaInicioStr, fechaFinStr) {
    const fechaInicio = convertirFechaADate(fechaInicioStr);
    const fechaFin = convertirFechaADate(fechaFinStr);

    const diferenciaMilisegundos = fechaFin - fechaInicio;

    // Calcular días, horas, minutos y segundos
    const dias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenciaMilisegundos % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferenciaMilisegundos % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferenciaMilisegundos % (1000 * 60)) / 1000);

    return {
        dias,
        horas,
        minutos,
        segundos
    };
}



// Función para descargar órdenes en formato CSV

function generarRutaDeTrabajo(serviciosSeleccionados) {
    return serviciosSeleccionados.map(servicio => {
        const maquinasInvolucradas = distribucionMaquinas[servicio.servicio];
        
        // Construimos la ruta con máquinas y sus horas dedicadas
        const ruta = maquinasInvolucradas
            ? Object.entries(maquinasInvolucradas)
                  .map(([maquina, horas]) => `${maquina} (${horas * servicio.cantidad} horas)`)
                  .join(" ➔ ")
            : "Sin ruta definida";
        
        // Formateamos cada servicio en una línea con su ruta
        return `${capitalizar(servicio.servicio)}: ${ruta}`;
    }).join("\r\n");  // Utilizamos \r\n para Alt+Enter en Excel
}

function obtenerOrdenesFiltradas(tipo) {
    const todasOrdenes = JSON.parse(localStorage.getItem(tipo)) || [];
    const filtroEstado = tipo === 'ordenes' ? document.getElementById("filtro-estado").value : 'todos';
    const fechaInicio = tipo === 'ordenes' ? document.getElementById("fechaInicio").value : document.getElementById("fechaInicioCompletadas").value;
    const fechaFin = tipo === 'ordenes' ? document.getElementById("fechaFin").value : document.getElementById("fechaFinCompletadas").value;
    const buscador = tipo === 'ordenes' ? document.getElementById("buscador").value.toLowerCase() : document.getElementById("buscadorCompletadas").value.toLowerCase();

    return todasOrdenes.filter(orden => {
        // Filtrar por estado si es diferente de 'todos'
        if (filtroEstado !== 'todos' && orden.estado !== filtroEstado) return false;

        // Filtrar por rango de fechas
        const fechaOrden = new Date(orden.fechaHora);
        if (fechaInicio && fechaOrden < new Date(fechaInicio)) return false;
        if (fechaFin && fechaOrden > new Date(fechaFin)) return false;

        // Filtrar por nombre (buscador)
        if (buscador && !orden.cliente.toLowerCase().includes(buscador)) return false;

        return true;
    });
}


function descargarOrdenes(tipo) {
    try {
        // Obtener datos filtrados en lugar de todas las órdenes
        const datos = obtenerOrdenesFiltradas(tipo);  // Utiliza la función de filtro
        const wb = XLSX.utils.book_new();  // Crear un nuevo libro de trabajo

        let encabezados;
        if (tipo === "ordenes") {
            encabezados = ["Cliente", "Cédula", "Tiempo Estimado", "Fecha Creación", "Varios", "Servicios", "Ruta de Trabajo"];
        } else if (tipo === "ordenesCompletadas") {
            encabezados = ["Cliente", "Cédula", "Tiempo Estimado", "Fecha Creación", "Fecha Completada", "Tiempo Real", "Estado de Cumplimiento", "Varios", "Servicios"];
        }

        const datosAExportar = datos.map(orden => {
            const serviciosFormat = orden.servicios.map(s => `${s.servicio} (Cantidad: ${s.cantidad})`).join(", ");
            const tiempoEstimadoConHoras = `${orden.tiempo_estimado} horas`;

            if (tipo === "ordenes") {
                const rutaTrabajo = generarRutaDeTrabajo(orden.servicios);
                return [
                    orden.cliente,
                    orden.cedula,
                    tiempoEstimadoConHoras,
                    orden.fechaHora,
                    orden.varios || "",
                    serviciosFormat,
                    rutaTrabajo
                ];
            } else if (tipo === "ordenesCompletadas") {
                const tiempoReal = formatearTiempoReal(orden.fechaHora, orden.fechaCompletada || new Date().toLocaleString('es-CO'));

                // Calcular estado de cumplimiento basado en la lógica estricta de días
                const tiempoRealObj = calcularTiempoReal(orden.fechaHora, orden.fechaCompletada);
                const estadoCumplimiento = (tiempoRealObj.dias > 3 || 
                                            (tiempoRealObj.dias === 3 && (tiempoRealObj.horas > 0 || tiempoRealObj.minutos > 0 || tiempoRealObj.segundos > 0)))
                                            ? "Vencida" : "Cumplido a Tiempo";

                return [
                    orden.cliente,
                    orden.cedula,
                    tiempoEstimadoConHoras,
                    orden.fechaHora,
                    orden.fechaCompletada || "",
                    tiempoReal,
                    estadoCumplimiento,
                    orden.varios || "",
                    serviciosFormat
                ];
            }
        });

        const ws = XLSX.utils.aoa_to_sheet([encabezados, ...datosAExportar]);
        XLSX.utils.book_append_sheet(wb, ws, tipo === "ordenes" ? "Órdenes de Reparación" : "Órdenes Realizadas");

        XLSX.writeFile(wb, `${tipo === "ordenes" ? "Ordenes_Reparacion" : "Ordenes_Realizadas"}.xlsx`);
    } catch (error) {
        console.error("Error en la función de descarga:", error);
        alert("Ocurrió un problema al intentar descargar las órdenes.");
    }
}




// Función para convertir objetos de órdenes a CSV
function convertirAFormatoCSV(data) {
    if (!data.length) return '';

    // Aseguramos encabezados claros
    const encabezados = ['Cliente', 'Tiempo Estimado', 'Fecha Hora', 'Varios', 'Servicios', 'Estado', 'Fecha Completada'];
    const filas = data.map(orden => {
        const serviciosLista = orden.servicios
            .map(s => `${s.servicio} (Cantidad: ${s.cantidad})`)
            .join('; ');
        
        // Formatear fecha y hora para eliminar caracteres extraños
        const fechaHora = new Date(orden.fechaHora).toLocaleString('es-CO', { hour12: true });
        const fechaCompletada = orden.fechaCompletada ? new Date(orden.fechaCompletada).toLocaleString('es-CO', { hour12: true }) : '';

        return [
            orden.cliente,
            orden.tiempo_estimado,
            fechaHora,
            orden.varios || '',
            serviciosLista,
            orden.estado,
            fechaCompletada
        ].map(campo => JSON.stringify(campo || '')).join(',');
    });

    return [encabezados.join(','), ...filas].join('\n');
}

let lineChartInstance = null;

function generarGraficoServiciosPorDia() {
    if (lineChartInstance) {
        lineChartInstance.destroy();  // Destruir el gráfico anterior si existe
    }

    const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    const ordenesCompletadas = JSON.parse(localStorage.getItem("ordenesCompletadas")) || [];
    const todasOrdenes = [...ordenes, ...ordenesCompletadas];

    const serviciosPorFecha = {};

    todasOrdenes.forEach(orden => {
        const fecha = orden.fechaHora.split(', ')[0];  // Extraer solo la fecha
        if (!serviciosPorFecha[fecha]) {
            serviciosPorFecha[fecha] = 0;  // Inicializar el contador en 0
        }
        
        // Sumar la cantidad de cada servicio en lugar de solo contar los servicios
        orden.servicios.forEach(servicio => {
            serviciosPorFecha[fecha] += servicio.cantidad;  // Sumar la cantidad específica de cada servicio
        });
    });

    const fechas = Object.keys(serviciosPorFecha).sort((a, b) => 
        new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-'))
    );
    const cantidades = fechas.map(fecha => serviciosPorFecha[fecha]);

    const ctx = document.getElementById('serviciosPorDiaChart').getContext('2d');
    lineChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,  // Fechas en el eje X
            datasets: [{
                label: 'Servicios Registrados por Día',
                data: cantidades,  // Cantidad de servicios en el eje Y
                borderColor: 'rgba(54, 162, 235, 1)',  // Color de la línea
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',  // Color de los puntos
                pointBorderColor: '#fff',  // Bordes de los puntos
                pointRadius: 5,  // Tamaño de los puntos
                pointHoverRadius: 7,  // Aumentar tamaño al pasar el mouse
                borderWidth: 2,  // Grosor de la línea
                fill: false,  // Elimina el área sombreada debajo de la línea
                tension: 0.3  // Suaviza la línea
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Servicios Ingresados por Día',  // Título del gráfico
                    color: '#333',
                    font: {
                        size: 18,
                        family: 'Arial',
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                legend: {
                    display: true,
                    labels: {
                        color: '#333',
                        font: { size: 14 }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Fecha',
                        color: '#333',
                        font: { size: 16, weight: 'bold' }
                    },
                    grid: { display: false }  // Ocultar líneas de la cuadrícula del eje X
                },
                y: {
                    title: {
                        display: true,
                        text: 'Cantidad de Servicios',
                        color: '#333',
                        font: { size: 16, weight: 'bold' }
                    },
                    grid: { color: 'rgba(200, 200, 200, 0.2)' },  // Líneas de la cuadrícula del eje Y
                    beginAtZero: true  // Comenzar desde 0 en el eje Y
                }
            }
        }
    });
}


// Llamamos a la función al cargar la página
document.addEventListener("DOMContentLoaded", generarGraficoServiciosPorDia);

let pieChartInstance = null;

function generarGraficoOrdenesCompletadas() {
    if (pieChartInstance) {
        pieChartInstance.destroy();  // Destruir gráfico anterior si existe
    }

    const ordenesCompletadas = JSON.parse(localStorage.getItem("ordenesCompletadas")) || [];
    let completadasATiempo = 0;
    let incumplidas = 0;

    ordenesCompletadas.forEach(orden => {
        const fechaCreacion = convertirFechaADate(orden.fechaHora);
        const fechaCompletada = convertirFechaADate(orden.fechaCompletada);

        // Calculamos la diferencia en días, horas, minutos y segundos
        const diferencia = fechaCompletada - fechaCreacion;
        const diferenciaDias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const diferenciaHoras = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diferenciaMinutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const diferenciaSegundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        // Verificamos si la orden se completó a tiempo o incumplió con lógica estricta
        const estaATiempo = 
            diferenciaDias < 3 || 
            (diferenciaDias === 3 && diferenciaHoras === 0 && diferenciaMinutos === 0 && diferenciaSegundos === 0);

        if (estaATiempo) {
            completadasATiempo++;
        } else {
            incumplidas++;
        }
    });

    const ctx = document.getElementById('ordenesCompletadasChart').getContext('2d');
    pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Completadas a Tiempo', 'Incumplidas'],
            datasets: [{
                data: [completadasATiempo, incumplidas],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.8)', // Verde claro con transparencia
                    'rgba(255, 99, 132, 0.8)'  // Rojo claro con transparencia
                ],
                borderColor: [
                    'rgba(76, 175, 80, 1)',    // Borde verde
                    'rgba(255, 99, 132, 1)'    // Borde rojo
                ],
                hoverBackgroundColor: [
                    'rgba(102, 187, 106, 0.9)', // Verde más claro al hacer hover
                    'rgba(255, 154, 162, 0.9)'  // Rojo más claro al hacer hover
                ],
                hoverBorderColor: '#fff',
                borderWidth: 2,  // Grosor del borde
                hoverOffset: 10  // Efecto de "salto" al pasar el mouse
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#333',
                        font: {
                            size: 16,
                            family: 'Arial',
                            style: 'italic'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    padding: 10,
                    callbacks: {
                        label: (tooltipItem) => {
                            const label = tooltipItem.label || '';
                            const value = tooltipItem.raw || 0;
                            const total = completadasATiempo + incumplidas;
                            const porcentaje = ((value / total) * 100).toFixed(2);
                            return `${label}: ${value} (${porcentaje}%)`;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Estado de Órdenes Completadas',
                    font: {
                        size: 18,
                        weight: 'bold',
                        family: 'Arial'
                    },
                    color: '#333'
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    });
}


// Llamamos a la función al cargar la página
document.addEventListener("DOMContentLoaded", generarGraficoOrdenesCompletadas);

function generarOrdenesDePrueba() {
    // Limpia las órdenes previas
    localStorage.removeItem("ordenesCompletadas");
    const ordenesPrueba = [];

    // Crear órdenes completadas a tiempo y otras incumplidas con servicios
    const ordenesDeEjemplo = [
        {
            cliente: "Cliente 1",
            cedula: "123456",
            tiempo_estimado: 10,
            fechaHora: "10/10/2024, 02:00:00 p. m.", // Orden vieja, incumplida
            fechaCompletada: "13/10/2024, 02:01:00 p. m.", // Completada tarde
            varios: "Observación de cliente 1",
            estado: "completado",
            servicios: [
                { servicio: "rectificar_bloque", cantidad: 1 },
                { servicio: "pulir_cigueñal", cantidad: 1 }
            ]
        },
        {
            cliente: "Cliente 2",
            cedula: "654321",
            tiempo_estimado: 5,
            fechaHora: "11/10/2024, 02:00:00 p. m.", // Orden completada a tiempo
            fechaCompletada: "13/10/2024, 02:00:00 p. m.", // Completada a tiempo
            varios: "Observación de cliente 2",
            estado: "completado",
            servicios: [
                { servicio: "cambio_guias", cantidad: 3 },
                { servicio: "ensamblaje_bielas", cantidad: 1 }
            ]
        },
        {
            cliente: "Cliente 3",
            cedula: "987654",
            tiempo_estimado: 7,
            fechaHora: "20/10/2024, 09:00:00 a. m.", // Orden incumplida
            fechaCompletada: "25/10/2024, 09:00:00 a. m.", // Incumplida
            varios: "Observación de cliente 3",
            estado: "completado",
            servicios: [
                { servicio: "lavado_motor", cantidad: 2 },
                { servicio: "cepillar_culatas", cantidad: 1 },
                { servicio: "ensamblaje_bielas", cantidad: 1 }
            ]
        },
        {
            cliente: "Cliente 4",
            cedula: "765432",
            tiempo_estimado: 6,
            fechaHora: "21/10/2024, 08:00:00 a. m.", // Orden cumplida
            fechaCompletada: "23/10/2024, 08:00:00 a. m.", // Completada a tiempo
            varios: "Observación de cliente 4",
            estado: "completado",
            servicios: [
                { servicio: "rectificar_bloque", cantidad: 1 },
                { servicio: "pulir_cigueñal", cantidad: 2 },
                { servicio: "cepillar_culatas", cantidad: 1 },
                { servicio: "ensamblaje_bielas", cantidad: 1 }

            ]
        }
    ];

    // Agregar estas órdenes al localStorage
    ordenesPrueba.push(...ordenesDeEjemplo);
    localStorage.setItem("ordenesCompletadas", JSON.stringify(ordenesPrueba));

    // Actualizar gráficos
    generarGraficoOrdenesCompletadas();  // Gráfico de torta
    generarGraficoServiciosPorDia();  // Gráfico de servicios por día

    Swal.fire({
        icon: 'success',
        title: 'Órdenes de Prueba Generadas',
        text: 'Se han agregado órdenes de prueba correctamente.',
        confirmButtonText: 'Aceptar'
    });
}

