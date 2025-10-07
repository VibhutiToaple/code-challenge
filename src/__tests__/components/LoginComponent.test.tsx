import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";

import LoginComponent from "../../components/LoginComponent";
import { USERNAME, PASSWORD } from "@utils/constants";

describe("<LoginComponent />", () => {
  it("calls onLoginSuccess on correct credentials", async () => {
    const mockSuccess = vi.fn();
    render(<LoginComponent onLoginSuccess={mockSuccess} />);

    // Fill username and password inputs
    await userEvent.type(screen.getByPlaceholderText(/username/i), USERNAME);
    await userEvent.type(screen.getByPlaceholderText(/password/i), PASSWORD);

    // Click Login button
    const button = screen.getByRole("button", { name: /login/i });
    await userEvent.click(button);

    // Wait for async validation and side effects
    await waitFor(() => expect(mockSuccess).toHaveBeenCalledTimes(1), {
      timeout: 2000,
    });
  });

  it("shows error on invalid credentials", async () => {
    render(<LoginComponent onLoginSuccess={vi.fn()} />);

    await userEvent.type(screen.getByPlaceholderText(/username/i), "wronguser");
    await userEvent.type(screen.getByPlaceholderText(/password/i), "badpass");

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    // Wait for error message to appear
    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
  });
});
