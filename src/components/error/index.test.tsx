import { fireEvent, render, vi } from "@/test/test-utils";
import { Error } from "./index";

describe("Error tests", () => {
  it("should render error message", () => {
    const { getByRole, getByText } = render(<Error />);

    const errorHeading = getByRole("heading", {
      name: /erro ao carregar dados/i,
    });
    expect(errorHeading).toBeInTheDocument();

    const errorMessage = getByText(
      "Ocorreu um erro ao buscar os dados. Por favor, tente novamente."
    );
    expect(errorMessage).toBeInTheDocument();

    const reloadButton = getByRole("button", {
      name: /recarregar página/i,
    });
    expect(reloadButton).toBeInTheDocument();
  });

  it("should reload page when clicking reload button", () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadMock },
      writable: true,
    });

    const { getByRole } = render(<Error />);
    const reloadButton = getByRole("button", { name: "Recarregar página" });

    fireEvent.click(reloadButton);

    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});
