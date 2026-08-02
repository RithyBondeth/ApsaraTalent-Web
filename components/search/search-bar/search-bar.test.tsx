import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));

vi.mock("@/components/ui/select", async () => {
  const ReactModule = await import("react");
  const Context = ReactModule.createContext<((value: string) => void) | null>(null);
  return {
    Select: ({
      onValueChange,
      children,
    }: {
      onValueChange: (value: string) => void;
      children: React.ReactNode;
    }) => <Context.Provider value={onValueChange}>{children}</Context.Provider>,
    SelectTrigger: ({ children }: { children: React.ReactNode }) => {
      const change = ReactModule.useContext(Context);
      return (
        <button type="button" aria-label="location" onClick={() => change?.("Phnom Penh")}>
          {children}
        </button>
      );
    },
    SelectContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SelectItem: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  };
});

vi.mock("@radix-ui/react-select", () => ({ SelectValue: () => null }));
vi.mock("@/components/ui/creatable-combobox", () => ({
  CreatableCombobox: ({ onChange }: { onChange: (value: string) => void }) => (
    <button type="button" onClick={() => onChange("remote")}>
      jobType
    </button>
  ),
}));

import SearchBar from "./index";

type FormValues = { keyword: string; location: string; jobType: string };

function Harness({ onValues }: { onValues: (values: FormValues) => void }) {
  const form = useForm<FormValues>({
    defaultValues: { keyword: "Engineer", location: "all", jobType: "all" },
  });
  return (
    <>
      <SearchBar<FormValues>
        register={form.register}
        setValue={form.setValue}
        initialLocation="all"
        initialJobType="all"
        isEmployee
      />
      <button type="button" onClick={() => onValues(form.getValues())}>
        inspect
      </button>
    </>
  );
}

describe("SearchBar", () => {
  it("focuses and selects the keyword through the command shortcut", async () => {
    render(<Harness onValues={vi.fn()} />);
    const input = screen.getByPlaceholderText("jobTitleKeywords") as HTMLInputElement;

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }),
    );
    expect(input).toHaveFocus();
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe("Engineer".length);
  });

  it("writes location and job-type choices into the parent form", async () => {
    const onValues = vi.fn();
    const user = userEvent.setup();
    render(<Harness onValues={onValues} />);

    await user.click(screen.getByRole("button", { name: "location" }));
    await user.click(screen.getByRole("button", { name: "jobType" }));
    await user.click(screen.getByRole("button", { name: "inspect" }));
    expect(onValues).toHaveBeenCalledWith({
      keyword: "Engineer",
      location: "Phnom Penh",
      jobType: "remote",
    });
  });
});
