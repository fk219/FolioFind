import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminRoute from "../AdminRoute";
import { AuthContext } from "../../contexts/AuthProvider";

function renderAt(value) {
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/login" element={<div>login page</div>} />
          <Route path="/" element={<div>home page</div>} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>ledger</div>
              </AdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

test("renders the ledger for an admin", () => {
  renderAt({ user: { email: "admin@example.com", role: "admin" }, loading: false });
  expect(screen.getByText("ledger")).toBeInTheDocument();
});

test("sends signed-out visitors to login", () => {
  renderAt({ user: null, loading: false });
  expect(screen.getByText("login page")).toBeInTheDocument();
});

test("sends readers away from the admin ledger", () => {
  renderAt({ user: { email: "reader@example.com", role: "user" }, loading: false });
  expect(screen.getByText("home page")).toBeInTheDocument();
});

test("waits for the auth check", () => {
  renderAt({ user: null, loading: true });
  expect(screen.getByText(/opening the ledger/i)).toBeInTheDocument();
});
