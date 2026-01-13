// Convierte números a palabras (para enteros)
function numberToWords(num) {
    const unidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const decenas = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    const centenas = ["", "cien", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];
    const especiales = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];

    let result = "";

    if (num === 0) return "cero";

    // Manejar miles
    if (num >= 1000) {
        const miles = Math.floor(num / 1000); // Obtener los miles
        if (miles === 1) {
            result += "mil "; // Caso especial para "mil"
        } else {
            result += numberToWords(miles) + " mil "; // Recursión para miles
        }
        num = num % 1000; // Resto después de los miles
    }

    // Manejar centenas
    if (num >= 100) {
        if (num === 100) {
            result += "cien "; // Caso especial para "cien"
        } else if (num < 200) {
            result += "ciento "; // Caso especial para los números entre 100 y 199
        } else {
            result += centenas[Math.floor(num / 100)] + " ";
        }
        num = num % 100; // Resto después de las centenas
    }

    // Manejar decenas
    if (num >= 20) {
        if (num === 20) {
            result += "veinte "; // Evitar "veinte y" y usar solo "veinte"
        } else {
            result += decenas[Math.floor(num / 10)] + " ";
            if (num % 10 !== 0) {
                result += "y "; // Sólo para los números entre 21 y 29
            }
        }
        num = num % 10; // Resto después de las decenas
    } else if (num >= 10) {
        result += especiales[num - 10] + " "; // Casos especiales del 10 al 19
        num = 0; // Ya no hay unidades
    }

    // Manejar unidades
    if (num > 0) {
        result += unidades[num] + " ";
    }

    return result.trim(); // Eliminar espacios adicionales
}

// Convierte números con decimales a palabras
function numberToWordsWithDecimals(number) {
    const entero = Math.floor(number); // Parte entera
    const decimal = Math.round((number - entero) * 100); // Parte decimal redondeada a dos dígitos

    let result = `${numberToWords(entero)} lempira`; // Convertir la parte entera
    if (entero !== 1) { // Si no es 1, usar "lempiras"
        result += "s";
    }
    
    if (decimal > 0) {
        result += ` con ${numberToWords(decimal)} centavo`; // Convertir los centavos
        if (decimal !== 1) { // Si no es 1, usar "centavos"
            result += "s";
        }
    }
    return result;
}

// Exportación (opcional, si trabajas con módulos)
export { numberToWords, numberToWordsWithDecimals };
