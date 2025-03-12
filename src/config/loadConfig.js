export function loadConfig() {
    const fileName = import.meta.env.VITE_CONFIG_FILE || 'Default-Config';
    console.log(`Loading config file: ${fileName}`); 
    return fileName;
  }
  