import { beforeEach, describe, expect, it, vi } from "vitest";

import { useGetAllEmployeeStore } from "./get-all-emp.store";
import { useGetOneEmployeeStore } from "./get-one-emp.store";
import { useRemoveEmpAvatarStore } from "./remove-emp-avatar.store";
import { useRemoveEmpCoverLetterStore } from "./remove-emp-coverletter.store";
import { useRemoveEmpEducationStore } from "./remove-emp-education.store";
import { useRemoveEmpExperienceStore } from "./remove-emp-experience.store";
import { useRemoveEmpResumeStore } from "./remove-emp-resume.store";
import { useSearchEmployeeStore } from "./search-emp.store";
import {
  TEmployeeUpdateBody,
  useUpdateOneEmployeeStore,
} from "./update-one-emp.store";
import { useUploadEmployeeAvatarStore } from "./upload-emp-avatar.store";
import { useUploadEmployeeCoverLetter } from "./upload-emp-coverletter.store";
import { useUploadEmployeeResumeStore } from "./upload-emp-resume.store";

const axiosMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));

describe("employee API stores", () => {
  beforeEach(() => {
    Object.values(axiosMocks).forEach((mock) => mock.mockReset());
    useGetAllEmployeeStore.setState({
      employeesData: null,
      loading: false,
      error: null,
    });
    useGetOneEmployeeStore.setState({
      employeeData: null,
      loading: false,
      error: null,
    });
    useRemoveEmpAvatarStore.setState({
      message: null,
      loading: false,
      error: null,
    });
    useRemoveEmpCoverLetterStore.setState({
      message: null,
      loading: false,
      error: null,
    });
    useRemoveEmpEducationStore.setState({
      message: null,
      loading: false,
      error: null,
    });
    useRemoveEmpExperienceStore.setState({
      message: null,
      loading: false,
      error: null,
    });
    useRemoveEmpResumeStore.setState({
      message: null,
      loading: false,
      error: null,
    });
    useSearchEmployeeStore.getState().resetSearch();
    useUpdateOneEmployeeStore.setState({
      message: null,
      employee: null,
      loading: false,
      error: null,
    });
    useUploadEmployeeAvatarStore.setState({
      message: null,
      loading: false,
      error: null,
    });
    useUploadEmployeeCoverLetter.setState({
      message: null,
      loading: false,
      error: null,
    });
    useUploadEmployeeResumeStore.setState({
      message: null,
      loading: false,
      error: null,
    });
  });

  it("loads all employees", async () => {
    const employees = [{ id: "employee-1", firstname: "Sokha" }];
    axiosMocks.get.mockResolvedValueOnce({ data: employees });

    await useGetAllEmployeeStore.getState().queryEmployee();

    expect(useGetAllEmployeeStore.getState()).toMatchObject({
      employeesData: employees,
      loading: false,
      error: null,
    });
  });

  it("loads one employee by id", async () => {
    const employee = { id: "employee-1", firstname: "Sokha" };
    axiosMocks.get.mockResolvedValueOnce({ data: employee });

    await useGetOneEmployeeStore.getState().queryOneEmployee("employee-1");

    expect(axiosMocks.get.mock.calls[0]?.[0]).toContain("employee-1");
    expect(useGetOneEmployeeStore.getState().employeeData).toEqual(employee);
  });

  it("removes an employee avatar", async () => {
    axiosMocks.post.mockResolvedValueOnce({
      data: { message: "Removed avatar" },
    });
    await useRemoveEmpAvatarStore.getState().removeEmpAvatar("employee-1");
    expect(useRemoveEmpAvatarStore.getState().message).toBe("Removed avatar");
  });

  it("removes an employee cover letter", async () => {
    axiosMocks.post.mockResolvedValueOnce({
      data: { message: "Removed cover letter" },
    });
    await useRemoveEmpCoverLetterStore
      .getState()
      .removeEmpCoverLetter("employee-1");
    expect(useRemoveEmpCoverLetterStore.getState().message).toBe(
      "Removed cover letter",
    );
  });

  it("removes an employee resume", async () => {
    axiosMocks.post.mockResolvedValueOnce({
      data: { message: "Removed resume" },
    });
    await useRemoveEmpResumeStore.getState().removeEmpResume("employee-1");
    expect(useRemoveEmpResumeStore.getState().message).toBe("Removed resume");
  });

  it("removes employee education and experience records", async () => {
    axiosMocks.delete
      .mockResolvedValueOnce({ data: { message: "Removed education" } })
      .mockResolvedValueOnce({ data: { message: "Removed experience" } });

    await useRemoveEmpEducationStore
      .getState()
      .removeEducation("employee-1", "education-1");
    await useRemoveEmpExperienceStore
      .getState()
      .removeExperience("employee-1", "experience-1");

    expect(axiosMocks.delete.mock.calls[0]?.[0]).toContain("education-1");
    expect(axiosMocks.delete.mock.calls[1]?.[0]).toContain("experience-1");
    expect(useRemoveEmpEducationStore.getState().message).toBe(
      "Removed education",
    );
    expect(useRemoveEmpExperienceStore.getState().message).toBe(
      "Removed experience",
    );
  });

  it("searches employees, appends the next page, and resets", async () => {
    const firstPage = [{ id: "employee-1" }];
    const nextPage = [{ id: "employee-2" }];
    axiosMocks.get
      .mockResolvedValueOnce({
        data: {
          data: firstPage,
          total: 2,
          page: 1,
          pageSize: 20,
          isUsingFallback: false,
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: nextPage,
          total: 2,
          page: 2,
          pageSize: 20,
          isUsingFallback: false,
        },
      });

    await useSearchEmployeeStore
      .getState()
      .querySearchEmployee({ keyword: "engineer" });
    await useSearchEmployeeStore
      .getState()
      .loadMoreEmployees({ keyword: "engineer" });

    expect(useSearchEmployeeStore.getState()).toMatchObject({
      employees: [...firstPage, ...nextPage],
      page: 2,
      total: 2,
      loadingMore: false,
    });
    expect(axiosMocks.get.mock.calls[0]?.[0]).toContain("keyword=engineer");
    expect(axiosMocks.get.mock.calls[1]?.[0]).toContain("page=2");

    useSearchEmployeeStore.getState().resetSearch();
    expect(useSearchEmployeeStore.getState()).toMatchObject({
      employees: null,
      total: 0,
      page: 1,
    });
  });

  it("maps employee fields to the update API payload", async () => {
    const employee = { id: "employee-1", firstname: "Sokha" };
    axiosMocks.patch.mockResolvedValueOnce({
      data: { message: "Saved", employee },
    });
    const body: TEmployeeUpdateBody = {
      firstname: "Sokha",
      languages: ["Khmer", "English"],
      skillIdsToDelete: ["skill-old"],
    };

    await useUpdateOneEmployeeStore
      .getState()
      .updateOneEmployee("employee-1", body);

    expect(axiosMocks.patch).toHaveBeenCalledWith(
      expect.stringContaining("employee-1"),
      {
        firstname: "Sokha",
        languages: ["Khmer", "English"],
        skillIdsToDelete: ["skill-old"],
      },
    );
    expect(useUpdateOneEmployeeStore.getState()).toMatchObject({
      message: "Saved",
      employee,
    });
  });

  it("uploads an employee avatar", async () => {
    axiosMocks.post.mockResolvedValueOnce({
      data: { message: "Uploaded avatar" },
    });
    const file = new File(["avatar"], "avatar.png");
    await useUploadEmployeeAvatarStore
      .getState()
      .uploadAvatar("employee-1", file);
    expect((axiosMocks.post.mock.calls[0]?.[1] as FormData).get("avatar")).toBe(
      file,
    );
    expect(useUploadEmployeeAvatarStore.getState().message).toBe(
      "Uploaded avatar",
    );
  });

  it("uploads an employee cover letter", async () => {
    axiosMocks.post.mockResolvedValueOnce({
      data: { message: "Uploaded cover letter" },
    });
    const file = new File(["letter"], "letter.pdf");
    await useUploadEmployeeCoverLetter
      .getState()
      .uploadCoverLetter("employee-1", file);
    expect(
      (axiosMocks.post.mock.calls[0]?.[1] as FormData).get("coverLetter"),
    ).toBe(file);
    expect(useUploadEmployeeCoverLetter.getState().message).toBe(
      "Uploaded cover letter",
    );
  });

  it("uploads an employee resume", async () => {
    axiosMocks.post.mockResolvedValueOnce({
      data: { message: "Uploaded resume" },
    });
    const file = new File(["resume"], "resume.pdf");
    await useUploadEmployeeResumeStore
      .getState()
      .uploadResume("employee-1", file);
    expect((axiosMocks.post.mock.calls[0]?.[1] as FormData).get("resume")).toBe(
      file,
    );
    expect(useUploadEmployeeResumeStore.getState().message).toBe(
      "Uploaded resume",
    );
  });

  it("records employee lookup failures", async () => {
    axiosMocks.get.mockRejectedValueOnce(new Error("network unavailable"));
    await useGetOneEmployeeStore.getState().queryOneEmployee("employee-1");
    expect(useGetOneEmployeeStore.getState()).toMatchObject({
      loading: false,
      error: "network unavailable",
    });
  });

  it.each([
    [
      "employee list",
      useGetAllEmployeeStore,
      axiosMocks.get,
      () => useGetAllEmployeeStore.getState().queryEmployee(),
    ],
    [
      "avatar removal",
      useRemoveEmpAvatarStore,
      axiosMocks.post,
      () => useRemoveEmpAvatarStore.getState().removeEmpAvatar("employee-1"),
    ],
    [
      "cover-letter removal",
      useRemoveEmpCoverLetterStore,
      axiosMocks.post,
      () =>
        useRemoveEmpCoverLetterStore
          .getState()
          .removeEmpCoverLetter("employee-1"),
    ],
    [
      "education removal",
      useRemoveEmpEducationStore,
      axiosMocks.delete,
      () =>
        useRemoveEmpEducationStore
          .getState()
          .removeEducation("employee-1", "education-1"),
    ],
    [
      "experience removal",
      useRemoveEmpExperienceStore,
      axiosMocks.delete,
      () =>
        useRemoveEmpExperienceStore
          .getState()
          .removeExperience("employee-1", "experience-1"),
    ],
    [
      "resume removal",
      useRemoveEmpResumeStore,
      axiosMocks.post,
      () => useRemoveEmpResumeStore.getState().removeEmpResume("employee-1"),
    ],
    [
      "profile update",
      useUpdateOneEmployeeStore,
      axiosMocks.patch,
      () =>
        useUpdateOneEmployeeStore
          .getState()
          .updateOneEmployee("employee-1", {}),
    ],
    [
      "avatar upload",
      useUploadEmployeeAvatarStore,
      axiosMocks.post,
      () =>
        useUploadEmployeeAvatarStore
          .getState()
          .uploadAvatar("employee-1", new File(["x"], "a.png")),
    ],
    [
      "cover-letter upload",
      useUploadEmployeeCoverLetter,
      axiosMocks.post,
      () =>
        useUploadEmployeeCoverLetter
          .getState()
          .uploadCoverLetter("employee-1", new File(["x"], "c.pdf")),
    ],
    [
      "resume upload",
      useUploadEmployeeResumeStore,
      axiosMocks.post,
      () =>
        useUploadEmployeeResumeStore
          .getState()
          .uploadResume("employee-1", new File(["x"], "r.pdf")),
    ],
  ] as const)("handles %s failures", async (_label, store, request, action) => {
    request.mockRejectedValueOnce(new Error("request failed"));
    await action().catch(() => undefined);
    expect(store.getState()).toMatchObject({
      loading: false,
      error: "request failed",
    });
  });

  it("handles search and load-more failures independently", async () => {
    axiosMocks.get.mockRejectedValueOnce(new Error("search failed"));
    await useSearchEmployeeStore
      .getState()
      .querySearchEmployee({ keyword: "engineer" });
    expect(useSearchEmployeeStore.getState()).toMatchObject({
      loading: false,
      error: "search failed",
    });

    useSearchEmployeeStore.setState({
      employees: [{ id: "employee-1" }] as never,
      page: 1,
      total: 2,
    });
    axiosMocks.get.mockRejectedValueOnce(new Error("next page failed"));
    await useSearchEmployeeStore
      .getState()
      .loadMoreEmployees({ keyword: "engineer" });
    expect(axiosMocks.get).toHaveBeenCalledTimes(2);
    expect(useSearchEmployeeStore.getState()).toMatchObject({
      loadingMore: false,
      error: "search failed",
    });
  });

  it("rejects malformed paginated search responses without exposing invalid state", async () => {
    axiosMocks.get.mockResolvedValueOnce({ data: [] });

    await useSearchEmployeeStore
      .getState()
      .querySearchEmployee({ keyword: "engineer" });

    expect(useSearchEmployeeStore.getState()).toMatchObject({
      employees: null,
      loading: false,
      error: "Invalid employee search response",
    });
  });

  it("keeps existing employees when a load-more response is malformed", async () => {
    useSearchEmployeeStore.setState({
      employees: [{ id: "employee-1" }] as never,
      page: 1,
      total: 2,
      error: null,
    });
    axiosMocks.get.mockResolvedValueOnce({ data: { unexpected: true } });

    await useSearchEmployeeStore
      .getState()
      .loadMoreEmployees({ keyword: "engineer" });

    expect(useSearchEmployeeStore.getState()).toMatchObject({
      employees: [{ id: "employee-1" }],
      page: 1,
      loadingMore: false,
      error: null,
    });
  });
});
