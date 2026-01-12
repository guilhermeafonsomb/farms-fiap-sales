import { render } from "@/test/test-utils";
import { Button } from "./Button";

describe("Button tests", () => {
  test("should render the component", () => {
    const { getByText } = render(<Button>Button</Button>);
    expect(getByText("Button")).toBeInTheDocument();
  });
});
