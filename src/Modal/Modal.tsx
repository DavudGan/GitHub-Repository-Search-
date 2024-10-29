import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Repository } from "../Store/data_store";
import repositoryStore from "../Store/data_store"; 

interface EditRepositoryProps {
  open: boolean;
  onClose: () => void;
  repo: Repository | null;
}

const EditRepository = ({ open, onClose, repo }: EditRepositoryProps) => {
  const [name, setName] = useState(repo?.name || "");
  const [description, setDescription] = useState(repo?.description || "");

  useEffect(() => {
    if (repo) {
      setName(repo.name);
      setDescription(repo.description || "");
    }
  }, [repo]);

  const handleSave = () => {
    if (repo) {
      repositoryStore.edit(repo, name, description);
      onClose(); 
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Редактировать репозиторий</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Название"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Описание"
          type="text"
          fullWidth
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Отмена</Button>
        <Button onClick={handleSave} color="primary">Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRepository;