import { ReactElement } from "react";

export default function (element: unknown): element is ReactElement {
  return (
    !!element &&
    typeof element === "object" &&
    "$$typeof" in element &&
    (element.$$typeof as Symbol) === Symbol.for("react.element")
  );
}
