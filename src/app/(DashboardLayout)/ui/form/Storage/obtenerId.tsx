export const obtenerId = async (): Promise<string> => {
    try {
      const response = await fetch("/api/casos/lastId");
      const data = await response.json();
  
      if (!data.lastId) {
        return "000001";
      }
  
      const nextId = parseInt(data.lastId, 10) + 1;
      return nextId.toString().padStart(6, "0");
    } catch (error) {
      console.error("Error obteniendo último Id_Caso:", error);
      return "000001";
    }
  };
  