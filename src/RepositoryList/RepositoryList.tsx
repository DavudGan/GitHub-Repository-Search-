import { useEffect, useRef, useCallback, useState } from "react";
import { observer } from "mobx-react-lite";
import repositoryStore from "../Store/RepositoryStore";
import { Repository } from "../Store/RepositoryStore";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import Modal from '../Modal/Modal'

const RepositoryList = observer(() => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);

  useEffect(() => {
    repositoryStore.fetchRepositories("react");
  }, [repositoryStore.fetchRepositories]);

  const lastRepositoryRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (repositoryStore.loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && repositoryStore.hasNextPage) {
          repositoryStore.fetchRepositories("react");
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [
      repositoryStore.loading,
      repositoryStore.fetchRepositories,
      repositoryStore.hasNextPage,
    ]
  );

  const handleEdit = (repo: Repository) => {
    setSelectedRepository(repo);
    setEditOpen(true);
  };
  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Repositories
      </Typography>
      <Box>
        {repositoryStore.repositories.map((repo, index: number) => (
          <Card
            key={repo.id}
            ref={
              index === repositoryStore.repositories.length - 10
                ? lastRepositoryRef
                : null
            }
            sx={{
              marginBottom: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CardContent>
              <Typography variant="h6">{repo.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {repo.description || "No description available"}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              ✰: {repo.stargazerCount}
              </Typography>
            </CardContent>
            <Box display="flex">
              <IconButton
                edge="end"
                aria-label="delete"
                sx={{ marginRight: 2 }}
                onClick={()=>repositoryStore.delete(repo)}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="create"
                sx={{ marginRight: 2 }}
                onClick={()=>handleEdit(repo)}
              >
                <CreateIcon />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Box>
      {repositoryStore.loading && (
        <Box display="flex" justifyContent="center" marginY={2}>
          <CircularProgress />
        </Box>
      )}
      
        <Modal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          repo={selectedRepository}
        />
      
    </Box>
  );
});

export default RepositoryList;
