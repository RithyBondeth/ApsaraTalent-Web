import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCmpAvatarCoverState } from "./use-cmp-avatar-cover-state";
import useCmpBenefitValueState from "./use-cmp-benefit-value-state";
import { useCmpCareerScopesState } from "./use-cmp-careerscope-state";
import useCmpImageState from "./use-cmp-image-state";

describe("company profile state hooks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("manages avatar and cover editing state and revokes blob previews", () => {
    const revoke = vi.spyOn(URL, "revokeObjectURL");
    const { result, unmount } = renderHook(() => useCmpAvatarCoverState());
    const avatar = new File(["avatar"], "avatar.png");
    const cover = new File(["cover"], "cover.png");

    act(() => {
      result.current.setAvatarFile(avatar);
      result.current.setCoverFile(cover);
      result.current.setOpenAvatarPopup(true);
      result.current.setOpenRemoveAvatarDialog(true);
      result.current.setOpenCropDialog(true);
      result.current.setCropImageUrl("blob:avatar-preview");
      result.current.setOpenRemoveCoverDialog(true);
      result.current.setOpenCoverCropDialog(true);
      result.current.setCoverCropImageUrl("blob:cover-preview");
      result.current.ignoreNextClick.current = true;
    });

    expect(result.current).toMatchObject({
      avatarFile: avatar,
      coverFile: cover,
      openAvatarPopup: true,
      openRemoveAvatarDialog: true,
      openCropDialog: true,
      cropImageUrl: "blob:avatar-preview",
      openRemoveCoverDialog: true,
      openCoverCropDialog: true,
      coverCropImageUrl: "blob:cover-preview",
    });
    expect(result.current.ignoreNextClick.current).toBe(true);
    unmount();
    expect(revoke).toHaveBeenCalledWith("blob:avatar-preview");
    expect(revoke).toHaveBeenCalledWith("blob:cover-preview");
  });

  it("manages benefits and values independently", () => {
    const { result } = renderHook(() => useCmpBenefitValueState());
    const benefit = { id: 1, label: "Health insurance" };
    const value = { id: 2, label: "Integrity" };

    act(() => {
      result.current.setBenefitInput(benefit);
      result.current.setBenefits([benefit]);
      result.current.setDeletedBenefitIds([3]);
      result.current.setOpenBenefitPopOver(true);
      result.current.setValueInput(value);
      result.current.setValues([value]);
      result.current.setDeletedValueIds([4]);
      result.current.setOpenValuePopOver(true);
    });

    expect(result.current).toMatchObject({
      benefitInput: benefit,
      benefits: [benefit],
      deletedBenefitIds: [3],
      openBenefitPopOver: true,
      valueInput: value,
      values: [value],
      deletedValueIds: [4],
      openValuePopOver: true,
    });
  });

  it("initializes and updates company career scopes", () => {
    const initial = [{ id: "scope-1", name: "Engineering" }];
    const { result } = renderHook(() => useCmpCareerScopesState(initial as never));

    act(() => {
      result.current.setCareerScopeInput(initial[0] as never);
      result.current.setCareerScopes([]);
      result.current.setDeleteCareerScopeIds(["scope-1"]);
      result.current.setOpenCareerScopePopOver(true);
    });

    expect(result.current).toMatchObject({
      careerScopeInput: initial[0],
      careerScopes: [],
      deleteCareerScopeIds: ["scope-1"],
      openCareerScopePopOver: true,
    });
  });

  it("manages gallery selection and removal state", () => {
    const { result } = renderHook(() => useCmpImageState());

    act(() => {
      result.current.setOpenImagePopup(true);
      result.current.setCurrentCompanyImage("/gallery/image.png");
      result.current.setOpenRemoveImageDialog(true);
      result.current.setRemoveImage({ id: "image-1", index: 2 });
    });

    expect(result.current).toMatchObject({
      openImagePopup: true,
      currentCompanyImage: "/gallery/image.png",
      openRemoveImageDialog: true,
      removedImage: { id: "image-1", index: 2 },
    });
  });
});
