import { Modal, Table, Button } from "flowbite-react";
import useComunidad from "../../../../service/comunidad";

const ModalComunidad = ({ isOpen, onClose, selectedGrade, onVincular, actores }) => {
  const { data: estudiantes, loading, error } = useComunidad(selectedGrade);

  const manejarVinculacion = (est) => {
    const yaVinculado = actores.some(actor => actor.documento_id === est.documentoid);
    if (yaVinculado) {
      alert("Este estudiante ya ha sido vinculado.");
      return;
    }
    onVincular(est);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="5xl">
      <Modal.Header>Comunidad del grado {selectedGrade}</Modal.Header>
      <Modal.Body>
        {loading && <p>Cargando...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
          <Table>
            <Table.Head>
              <Table.HeadCell>Documento</Table.HeadCell>
              <Table.HeadCell>Nombre</Table.HeadCell>
              <Table.HeadCell>Apellido 1</Table.HeadCell>
              <Table.HeadCell>Apellido 2</Table.HeadCell>
              <Table.HeadCell>Acción</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {estudiantes.map((est) => (
                <Table.Row key={est.id}>
                  <Table.Cell>{est.documentoid}</Table.Cell>
                  <Table.Cell>{est.nombre}</Table.Cell>
                  <Table.Cell>{est.apellido1}</Table.Cell>
                  <Table.Cell>{est.apellido2}</Table.Cell>
                  <Table.Cell>
                    <Button size="xs" color="blue" onClick={() => manejarVinculacion(est)}>
                      Vincular
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComunidad;
