import React, { useState, useEffect } from 'react';
import qz from 'qz-tray';

const PrintComponent = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [printers, setPrinters] = useState([]);

    useEffect(() => {
        const connectToQZTray = async () => {
            try {
                if (!qz.websocket.isActive()) {
                    await qz.websocket.connect();
                    setIsConnected(true);

                    // Obtiene el nombre de las impresoras disponibles
                    const defaultPrinter = await qz.printers.find();
                    setPrinters([defaultPrinter]); // Aquí podrías añadir más lógica para obtener otras impresoras
                }
            } catch (error) {
                console.error('Error de conexión con QZ Tray:', error);
            }
        };

        connectToQZTray();

        return () => {
            if (qz.websocket.isActive()) {
                qz.websocket.disconnect().then(() => {
                    setIsConnected(false);
                });
            }
        };
    }, []);

    const printReceipt = (printer) => {
        const config = qz.configs.create(printer);
        const data = [
            '\x1B\x40', // Inicializa la impresora
            '\x1B\x61\x01', // Centra el texto
            'Hola Mahely esta es una prueba\n',
            'Factura de prueba\n',
            '\x1B\x61\x00', // Alinea a la izquierda
            '-----------------------------\n',
            'Subtotal: $100.00\n',
            'ISV: $100.00\n',
            'Total: $100.00\n',
            '\x1B\x64\x05', // Alimenta 5 líneas
            '\x1D\x56\x41', // Corte parcial de papel
            '\x1B\x64\x05', // Alimenta más líneas para garantizar limpieza del buffer
        ];

        qz.print(config, data)
            .then(() => {
                console.log('Impresión completada');
            })
            .catch((error) => {
                console.error('Error al imprimir:', error);
            });
    };

    return (
        <div>
            <h2>Impresión de factura</h2>
            {isConnected ? (
                <div>
                    {printers.length > 0 && console.log(printers[0])}
                    <p>Conectado a QZ Tray. Impresoras disponibles:</p>
                    <ul>
                        {printers.length > 0 && printers[0].map((printer, index) => (
                            <>
                                <br />
                                <li key={index}>
                                    <button onClick={() => printReceipt(printer)}>{printer}</button>
                                </li>
                            </>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Esperando conexión con QZ Tray...</p>
            )}
        </div>
    );
};

export default PrintComponent;
