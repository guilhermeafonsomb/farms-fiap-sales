import { render } from "@/test/test-utils";
import { Button } from ".";

describe("Button tests", () => {
  test("should render the component", () => {
    const { getByText } = render(<Button>Button</Button>);
    expect(getByText("Button")).toBeInTheDocument();
  });
});
