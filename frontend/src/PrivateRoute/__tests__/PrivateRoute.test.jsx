import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";
import { AuthContext } from "../../contexts/AuthProvider";

function renderWithAuth(value) {
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter>
        <PrivateRoute>
          <div>secret</div>
        </PrivateRoute>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

test("renders children when authenticated", () => {
  renderWithAuth({ user: { email: "a@b.com", role: "admin" }, loading: false });
  expect(screen.getByText("secret")).toBeInTheDocument();
});

