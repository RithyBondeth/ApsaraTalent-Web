import { beforeEach, describe, expect, it, vi } from "vitest";

import { useGetAllCompanyStore } from "./get-all-cmp.store";
import { useGetOneCompanyStore } from "./get-one-cmp.store";
import { useRemoveCmpAvatarStore } from "./remove-cmp-avatar.store";
import { useRemoveCmpCoverStore } from "./remove-cmp-cover.store";
import { useRemoveOneCmpImageStore } from "./remove-one-cmp-image.store";
import { useRemoveOneOpenPositionStore } from "./remove-one-open-position.store";
import {
  TCompanyUpdateBody,
  useUpdateOneCompanyStore,
} from "./update-one-cmp.store";
import { useUploadCompanyAvatarStore } from "./upload-cmp-avatar.store";
import { useUploadCompanyCoverStore } from "./upload-cmp-cover.store";
import { useUploadCompanyImagesStore } from "./upload-cmp-images.store";

const axiosMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));

describe("company API stores", () => {
  beforeEach(() => {
    Object.values(axiosMocks).forEach((mock) => mock.mockReset());
    useGetAllCompanyStore.setState({
      companyData: null,
      loading: false,
      error: null,
    });
    useGetOneCompanyStore.setState({
      companyData: null,
      loading: false,
      error: null,
    });
    useRemoveCmpAvatarStore.setState({
      message: null,
      loading: false,
      error: null,
    });
    useRemoveCmpCoverStore.setState({
      message: null,
      loading: false,
      error: null,
    });
    useRemoveOneCmpImageStore.setState({
      message: null,
      loading: false,
      error: null,
    });
    useRemoveOneOpenPositionStore.setState({
      message: null,
      loading: false,
      error: null,
    });
    useUpdateOneCompanyStore.setState({
      message: null,
      company: null,
      loading: false,
      error: null,
    });
    useUploadCompanyAvatarStore.setState({
      message: null,
      loading: false,
      error: null,
    });
    useUploadCompanyCoverStore.setState({
      message: null,
      loading: false,
      error: null,
    });
    useUploadCompanyImagesStore.setState({
      message: null,
      loading: false,
      error: null,
    });
  });

  it("loads all companies", async () => {
    const companies = [{ id: "company-1", name: "Apsara" }];
    axiosMocks.get.mockResolvedValueOnce({ data: companies });

    await useGetAllCompanyStore.getState().queryCompany();

    expect(axiosMocks.get).toHaveBeenCalledTimes(1);
    expect(useGetAllCompanyStore.getState()).toMatchObject({
      companyData: companies,
      loading: false,
      error: null,
    });
  });

  it("loads one company by id", async () => {
    const company = { id: "company-1", name: "Apsara" };
    axiosMocks.get.mockResolvedValueOnce({ data: company });

    await useGetOneCompanyStore.getState().queryOneCompany("company-1");

    expect(axiosMocks.get.mock.calls[0]?.[0]).toContain("company-1");
    expect(useGetOneCompanyStore.getState().companyData).toEqual(company);
  });

  it.each([
    [
      "avatar",
      useRemoveCmpAvatarStore,
      () => useRemoveCmpAvatarStore.getState().removeCmpAvatar("company-1"),
    ],
    [
      "cover",
      useRemoveCmpCoverStore,
      () => useRemoveCmpCoverStore.getState().removeCmpCover("company-1"),
    ],
    [
      "image",
      useRemoveOneCmpImageStore,
      () =>
        useRemoveOneCmpImageStore
          .getState()
          .removeOneCmpImage("company-1", "image-1"),
    ],
    [
      "open position",
      useRemoveOneOpenPositionStore,
      () =>
        useRemoveOneOpenPositionStore
          .getState()
          .removeOneOpenPosition("company-1", "job-1"),
    ],
  ] as const)("removes a company %s", async (_label, store, remove) => {
    axiosMocks.post.mockResolvedValueOnce({ data: { message: "Removed" } });
    axiosMocks.delete.mockResolvedValueOnce({ data: { message: "Removed" } });

    await remove();

    expect(
      useRemoveCmpAvatarStore === store || useRemoveCmpCoverStore === store
        ? axiosMocks.post
        : axiosMocks.delete,
    ).toHaveBeenCalledTimes(1);
    expect(store.getState()).toMatchObject({
      message: "Removed",
      loading: false,
      error: null,
    });
  });

  it("maps editable company fields to the update API payload", async () => {
    const company = { id: "company-1", name: "Updated" };
    axiosMocks.patch.mockResolvedValueOnce({
      data: { message: "Saved", company },
    });
    const body: TCompanyUpdateBody = {
      name: "Updated",
      values: ["Integrity"],
      jobIdsToDelete: ["job-old"],
    };

    await useUpdateOneCompanyStore
      .getState()
      .updateOneCompany("company-1", body);

    expect(axiosMocks.patch).toHaveBeenCalledWith(
      expect.stringContaining("company-1"),
      {
        name: "Updated",
        values: [{ label: "Integrity" }],
        jobIdsToDelete: ["job-old"],
      },
    );
    expect(useUpdateOneCompanyStore.getState()).toMatchObject({
      message: "Saved",
      company,
      loading: false,
      error: null,
    });
  });

  it.each([
    [
      "avatar",
      useUploadCompanyAvatarStore,
      (file: File) =>
        useUploadCompanyAvatarStore.getState().uploadAvatar("company-1", file),
      "avatar",
    ],
    [
      "cover",
      useUploadCompanyCoverStore,
      (file: File) =>
        useUploadCompanyCoverStore.getState().uploadCover("company-1", file),
      "cover",
    ],
  ] as const)("uploads a company %s", async (_label, store, upload, field) => {
    axiosMocks.post.mockResolvedValueOnce({ data: { message: "Uploaded" } });
    const file = new File(["image"], "image.png", { type: "image/png" });

    await upload(file);

    const formData = axiosMocks.post.mock.calls[0]?.[1] as FormData;
    expect(formData.get(field)).toBe(file);
    expect(store.getState()).toMatchObject({
      message: "Uploaded",
      loading: false,
      error: null,
    });
  });

  it("uploads all company gallery images", async () => {
    axiosMocks.post.mockResolvedValueOnce({ data: { message: "Uploaded" } });
    const files = [new File(["one"], "one.png"), new File(["two"], "two.png")];

    await useUploadCompanyImagesStore
      .getState()
      .uploadImages("company-1", files);

    const formData = axiosMocks.post.mock.calls[0]?.[1] as FormData;
    expect(formData.getAll("images")).toEqual(files);
    expect(useUploadCompanyImagesStore.getState().message).toBe("Uploaded");
  });

  it("records an API failure without leaving loading enabled", async () => {
    axiosMocks.get.mockRejectedValueOnce(new Error("offline"));

    await useGetAllCompanyStore.getState().queryCompany();

    expect(useGetAllCompanyStore.getState()).toMatchObject({
      loading: false,
      error: "offline",
    });
  });

  it.each([
    [
      "single company",
      useGetOneCompanyStore,
      axiosMocks.get,
      () => useGetOneCompanyStore.getState().queryOneCompany("company-1"),
    ],
    [
      "avatar removal",
      useRemoveCmpAvatarStore,
      axiosMocks.post,
      () => useRemoveCmpAvatarStore.getState().removeCmpAvatar("company-1"),
    ],
    [
      "cover removal",
      useRemoveCmpCoverStore,
      axiosMocks.post,
      () => useRemoveCmpCoverStore.getState().removeCmpCover("company-1"),
    ],
    [
      "gallery removal",
      useRemoveOneCmpImageStore,
      axiosMocks.delete,
      () =>
        useRemoveOneCmpImageStore
          .getState()
          .removeOneCmpImage("company-1", "image-1"),
    ],
    [
      "position removal",
      useRemoveOneOpenPositionStore,
      axiosMocks.delete,
      () =>
        useRemoveOneOpenPositionStore
          .getState()
          .removeOneOpenPosition("company-1", "job-1"),
    ],
    [
      "profile update",
      useUpdateOneCompanyStore,
      axiosMocks.patch,
      () =>
        useUpdateOneCompanyStore.getState().updateOneCompany("company-1", {}),
    ],
    [
      "avatar upload",
      useUploadCompanyAvatarStore,
      axiosMocks.post,
      () =>
        useUploadCompanyAvatarStore
          .getState()
          .uploadAvatar("company-1", new File(["x"], "a.png")),
    ],
    [
      "cover upload",
      useUploadCompanyCoverStore,
      axiosMocks.post,
      () =>
        useUploadCompanyCoverStore
          .getState()
          .uploadCover("company-1", new File(["x"], "c.png")),
    ],
    [
      "gallery upload",
      useUploadCompanyImagesStore,
      axiosMocks.post,
      () =>
        useUploadCompanyImagesStore
          .getState()
          .uploadImages("company-1", [new File(["x"], "g.png")]),
    ],
  ] as const)("handles %s failures", async (_label, store, request, action) => {
    request.mockRejectedValueOnce(new Error("request failed"));
    await action().catch(() => undefined);
    expect(store.getState()).toMatchObject({
      loading: false,
      error: "request failed",
    });
  });
});
