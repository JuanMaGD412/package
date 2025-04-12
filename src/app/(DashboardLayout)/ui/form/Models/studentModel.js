// studentModel.js

// Aquí podemos definir el tipo de datos, si es necesario
export type Estudiante = {
    id: number;
    Nombre: string;
    Apellido1: string;
    Apellido2: string;
    TipoDocumento: string;
    DocumentoId: string;
    rol: string;
    NombreAcudiente: string;
    Apellido1Acudiente: string;
    Apellido2Acudiente: string;
    TelefonoAcudiente: string;
    EmailAcudiente: string;
  };
  
  // Aquí va la lógica para manejar los estudiantes
  export const addStudent = (students, estudiante) => {
    return [...students, estudiante];
  };
  
  export const updateStudentRol = (students, index, rol) => {
    return students.map((student, i) =>
      i === index ? { ...student, rol } : student
    );
  };
  
  export const getStudentsByGrade = async (grade) => {
    // Simulamos una llamada a una API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, Nombre: "Juan", Apellido1: "Pérez", Apellido2: "González", TipoDocumento: "DNI", DocumentoId: "12345678", rol: "afectado", NombreAcudiente: "Ana", Apellido1Acudiente: "González", Apellido2Acudiente: "Lopez", TelefonoAcudiente: "987654321", EmailAcudiente: "ana@example.com" },
          // Otros estudiantes
        ]);
      }, 1000);
    });
  };
  