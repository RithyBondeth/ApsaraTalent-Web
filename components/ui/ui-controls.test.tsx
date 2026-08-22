import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { ThemeCard } from "@/components/setting/appearance-section/theme-card";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";

describe("shared UI controls", () => {
  it("forwards button interaction and supports child composition", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();

    render(
      <Button asChild variant="link">
        <a href="/profile">Profile</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
      "data-ui-button",
    );
  });

  it("renders input adornments and accessible validation state", () => {
    render(
      <Input
        aria-label="Email"
        prefix={<span>prefix</span>}
        suffix={<span>suffix</span>}
        validationMessage={{ type: "required", message: "Email is required" }}
      />,
    );
    const input = screen.getByLabelText("Email");
    const validationMessage = screen.getByText("Email is required");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", validationMessage.id);
    expect(validationMessage).toHaveAttribute("role", "alert");
    expect(screen.getByText("prefix")).toBeInTheDocument();
    expect(screen.getByText("suffix")).toBeInTheDocument();
  });

  it("connects textarea validation feedback to the field", () => {
    render(
      <Textarea
        aria-label="Description"
        validationMessage="Description is required"
      />,
    );
    const textarea = screen.getByLabelText("Description");
    const validationMessage = screen.getByText("Description is required");
    expect(textarea).toHaveAttribute("aria-describedby", validationMessage.id);
    expect(validationMessage).toHaveAttribute("role", "alert");
  });

  it("uses auth back-button defaults while preserving caller behavior", () => {
    const onClick = vi.fn();
    render(<AuthBackButton onClick={onClick}>Back</AuthBackButton>);
    const button = screen.getByRole("button", { name: "Back" });
    expect(button).toHaveAttribute("type", "button");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it.each(["light", "dark", "system"] as const)(
    "renders and selects the %s theme",
    async (value) => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <ThemeCard
          value={value}
          label={`${value} theme`}
          icon={<span>icon</span>}
          active={value === "dark"}
          onClick={onClick}
        />,
      );
      const button = screen.getByRole("button", {
        name: new RegExp(`${value} theme`),
      });
      await user.click(button);
      expect(onClick).toHaveBeenCalledOnce();
      if (value === "dark") expect(button).toHaveClass("border-primary");
    },
  );
});
