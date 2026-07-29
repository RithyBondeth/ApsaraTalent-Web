import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "./date-picker";

vi.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) =>
    key === "selectDate" ? "Select date" : key,
}));

vi.mock("next/dynamic", () => ({
  default: () =>
    function CalendarStub(props: {
      onSelect: (date: Date | undefined) => void;
    }) {
      return (
        <button
          type="button"
          onClick={() => props.onSelect(new Date(2026, 6, 28))}
        >
          Choose July 28
        </button>
      );
    },
}));

describe("DatePicker", () => {
  it("mounts the deferred calendar on demand and returns the selected date", async () => {
    const user = userEvent.setup();
    const onDateChange = vi.fn();
    render(<DatePicker date={undefined} onDateChange={onDateChange} />);

    expect(
      screen.queryByRole("button", { name: "Choose July 28" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Select date" }));
    await user.click(
      await screen.findByRole("button", { name: "Choose July 28" }),
    );

    expect(onDateChange).toHaveBeenCalledWith(new Date(2026, 6, 28));
    expect(
      screen.queryByRole("button", { name: "Choose July 28" }),
    ).not.toBeInTheDocument();
  });
});
