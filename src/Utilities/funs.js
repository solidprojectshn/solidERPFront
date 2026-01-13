export function numberToWords(num) {
    if (num === 0) return 'cero';
    
    const belowTwenty = [
        'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
        'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete',
        'dieciocho', 'diecinueve'
    ];
    
    const tens = [
        '', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'
    ];
    
    const thousands = [
        '', 'mil', 'millón', 'mil millones'
    ];
    
    let words = '';
    
    function convertToWords(n) {
        if (n < 20) return belowTwenty[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' y ' + belowTwenty[n % 10] : '');
        if (n < 1000) return belowTwenty[Math.floor(n / 100)] + 'cientos' + (n % 100 !== 0 ? ' ' + convertToWords(n % 100) : '');
        return '';
    }
    
    let thousandIndex = 0;
    
    while (num > 0) {
        let chunk = num % 1000;
        if (chunk > 0) {
            words = convertToWords(chunk) + (thousands[thousandIndex] ? ' ' + thousands[thousandIndex] : '') + (words ? ' ' + words : '');
        }
        num = Math.floor(num / 1000);
        thousandIndex++;
    }
    
    return words.trim();
}
