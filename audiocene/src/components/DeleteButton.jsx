import { useDeleteRecording } from "../features/recordings/useDeleteRecording";
import Button from "./Button";
import Modal from "./Modal";
import styled from "styled-components";

const DeleteContent = styled.div`
  display: flex;
  margin-top: 40px;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const DeleteButtons = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 40px;
  width: 100%;
  justify-content: space-between;
`;

function DeleteButton({ id }) {
  const { isDeleting, deleteRecording } = useDeleteRecording();

  return (
    <Modal>
      <Modal.Open opens="delete-confirm">
        {(openModal) => (
          <Button variant="tertiary" onClick={openModal}>
            Delete
          </Button>
        )}
      </Modal.Open>
      <Modal.Window name="delete-confirm">
        {({ onCloseModal }) => (
          <DeleteContent>
            <h3>Delete Recording?</h3>
            <div>This action cannot be undone</div>
            <DeleteButtons>
              <Button onClick={onCloseModal}>Cancel</Button>
              <Button
                variant="warning"
                onClick={() => deleteRecording({ id })}
                disabled={isDeleting}
              >
                Delete
              </Button>
            </DeleteButtons>
          </DeleteContent>
        )}
      </Modal.Window>
    </Modal>
  );
}

export default DeleteButton;
