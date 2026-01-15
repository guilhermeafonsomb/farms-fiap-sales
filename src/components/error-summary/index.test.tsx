import { render, screen, fireEvent } from "@/test/test-utils";
import { ErrorSummary } from "./index";

describe("ErrorSummary", () => {
  it("should not render when there are no errors", () => {
    const { queryByRole } = render(<ErrorSummary errors={{}} />);
    expect(queryByRole("alert")).not.toBeInTheDocument();
  });

  it("should render when there are errors", () => {
    const { getByRole } = render(
      <ErrorSummary errors={{ field1: "Error 1" }} />
    );
    expect(getByRole("alert")).toBeInTheDocument();
  });

  it("should display correct error count and messages", () => {
    const { getByRole, getByText } = render(
      <ErrorSummary
        errors={{ field1: "Error message 1", field2: "Error message 2" }}
      />
    );

    expect(
      getByRole("heading", { name: /encontramos 2 erros/i })
    ).toBeInTheDocument();
    expect(getByText("Error message 1")).toBeInTheDocument();
    expect(getByText("Error message 2")).toBeInTheDocument();
  });

  it("should move focus to heading on mount", () => {
    const { getByRole } = render(<ErrorSummary errors={{ field1: "Error" }} />);
    const heading = getByRole("heading", {
      name: /encontramos 1 erro/i,
    });
    expect(document.activeElement).toBe(heading);
  });

  it("should move focus to input when error link is clicked", () => {
    const { getByText } = render(
      <div>
        <input id="field1" />
        <ErrorSummary errors={{ field1: "Error message 1" }} />
      </div>
    );

    const link = getByText("Error message 1");
    fireEvent.click(link);

    const input = document.getElementById("field1");
    expect(document.activeElement).toBe(input);
  });
});
