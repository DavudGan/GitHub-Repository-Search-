import { render, screen, fireEvent } from "@testing-library/react";

import repositoryStore from "../../Store/RepositoryStore";
import RepositoryList from "../../RepositoryList/RepositoryList";

jest.mock("../../Store/RepositoryStore");

const mockRepositories = [
  {
    id: "1",
    name: "Repo 1",
    stargazerCount: 10,
    updatedAt: "2024-10-01",
    description: "Test repository 1",
    primaryLanguage: { name: "JavaScript" },
    licenseInfo: { name: "MIT" },
  },
  {
    id: "2",
    name: "Repo 2",
    stargazerCount: 5,
    updatedAt: "2024-10-01",
    description: "Test repository 2",
    primaryLanguage: { name: "Python" },
    licenseInfo: { name: "MIT" },
  },
];

beforeEach(() => {
  repositoryStore.repositories = mockRepositories;
  repositoryStore.loading = false;
  repositoryStore.hasNextPage = true;
});

describe("RepositoryList", () => {
  test("Корректно рендерится компонент RepositoryList", () => {
    render(<RepositoryList />);

    expect(screen.getByText(/Repositories/i)).toBeInTheDocument();
  });

  test("Отображает список репозиториев", () => {
    render(<RepositoryList />);

    expect(screen.getByText("Repo 1")).toBeInTheDocument();
    expect(screen.getByText("Repo 2")).toBeInTheDocument();
  });

  test("Вызывает функцию удаления при нажатии кнопки удаления", () => {
    const deleteMock = jest.fn();
    repositoryStore.delete = deleteMock;

    render(<RepositoryList />);

    fireEvent.click(screen.getAllByLabelText(/delete/i)[0]);

    expect(deleteMock).toHaveBeenCalledWith(mockRepositories[0]);
  });

  test("Открывает модальное окно редактирования при нажатии кнопки редактирования", () => {
    render(<RepositoryList />);

    fireEvent.click(screen.getAllByLabelText(/create/i)[0]);

    expect(screen.getByText(/Сохранить/i)).toBeInTheDocument();
  });

  test("Показывает индикатор загрузки во время загрузки", () => {
    repositoryStore.loading = true;

    render(<RepositoryList />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
