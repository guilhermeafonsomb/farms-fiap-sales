import { render } from "@/test/test-utils";
import { Input } from ".";

describe("Input tests", () => {
  test("should render the component", () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="test placeholder" />
    );

    expect(getByPlaceholderText("test placeholder")).toBeInTheDocument();
  });
});
