import { render, screen, waitFor } from "@testing-library/react";
import AuthProvider, { AuthContext } from "../AuthProvider";

function Consumer() {
  return (
    <AuthContext.Consumer>
      {(v) => <div data-testid="state">{v.loading ? "loading" : v.user ? v.user.email : "anon"}</div>}
    </AuthContext.Consumer>
  );
}

test("starts as anon when no token", async () => {
  localStorage.removeItem("bookstore_token");

  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );

  await waitFor(() => {
    expect(screen.getByTestId("state")).toHaveTextContent("anon");
  });
});

