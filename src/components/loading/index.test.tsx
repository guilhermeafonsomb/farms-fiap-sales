import { render } from "@/test/test-utils";
import { Loading } from ".";

describe("Loading test", () => {
  it("should render loading", () => {
    const { getByText } = render(<Loading />);
    expect(getByText("Carregando...")).toBeInTheDocument();
  });
});
