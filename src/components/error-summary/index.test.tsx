import { render, screen, fireEvent } from "@/test/test-utils";
import { ErrorSummary } from "./index";

describe("ErrorSummary", () => {
  it("should not render when there are no errors", () => {
    render(<ErrorSummary errors={{}} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("should render when there are errors", () => {
    render(<ErrorSummary errors={{ field1: "Error 1" }} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should display correct error count and messages", () => {
    render(
      <ErrorSummary
        errors={{ field1: "Error message 1", field2: "Error message 2" }}
      />
    );

    expect(
      screen.getByRole("heading", { name: /encontramos 2 erros/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Error message 1")).toBeInTheDocument();
    expect(screen.getByText("Error message 2")).toBeInTheDocument();
  });

  it("should move focus to heading on mount", () => {
    render(<ErrorSummary errors={{ field1: "Error" }} />);
    const heading = screen.getByRole("heading", {
      name: /encontramos 1 erro/i,
    });
    expect(document.activeElement).toBe(heading);
  });

  it("should move focus to input when error link is clicked", () => {
    render(
      <div>
        <input id="field1" />
        <ErrorSummary errors={{ field1: "Error message 1" }} />
      </div>
    );

    const link = screen.getByText("Error message 1");
    fireEvent.click(link);

    const input = document.getElementById("field1");
    expect(document.activeElement).toBe(input);
  });
});
