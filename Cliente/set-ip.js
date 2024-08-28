import os from 'os';
import fs from 'fs';
import path from 'path';

// Función para obtener la dirección IP del adaptador inalámbrico
const getWirelessIp = () => {
  const interfaces = os.networkInterfaces();
  for (const [ifaceName, ifaceDetails] of Object.entries(interfaces)) {
    // Filtra interfaces que podrían ser inalámbricas (puede ser necesario ajustar según tu entorno)
    if (/Wi-Fi|wlan|Wireless/i.test(ifaceName)) {
      for (const alias of ifaceDetails) {
        if (alias.family === 'IPv4' && !alias.internal) {
          return alias.address;
        }
      }
    }
  }
  return '127.0.0.1'; // Retorno predeterminado si no se encuentra otra IP inalámbrica
};

// Ruta al archivo .env
const envPath = path.join(process.cwd(), '.env');

// Leer el contenido actual del archivo .env
let envContent = fs.readFileSync(envPath, 'utf8');

// Obtener la IP del adaptador inalámbrico
const wirelessIp = getWirelessIp();
const newEnvContent = envContent.replace(/VITE_API_URL=http:\/\/.*:3001/, `VITE_API_URL=http://${wirelessIp}:3001`);

// Escribir el nuevo contenido en el archivo .env
fs.writeFileSync(envPath, newEnvContent);

console.log(`IP inalámbrica actualizada en .env: http://${wirelessIp}:3001`);
