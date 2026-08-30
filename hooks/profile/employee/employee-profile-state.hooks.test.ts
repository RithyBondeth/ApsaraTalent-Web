import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAvatarState } from "./use-avatar-state";
import { useCareerScopesState } from "./use-careerscope-state";
import { useReferenceFilesState } from "./use-referencefile-state";
import { useSkillsState } from "./use-skill-state";
import { useSocialsState } from "./use-social-state";

describe("employee profile state hooks", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("manages avatar dialogs and revokes blob previews", () => {
    const revoke = vi.spyOn(URL, "revokeObjectURL");
    const { result, unmount } = renderHook(() => useAvatarState());
    const file = new File(["avatar"], "avatar.png");

    act(() => {
      result.current.setAvatarFile(file);
      result.current.setOpenAvatarPopup(true);
      result.current.setOpenRemoveAvatarDialog(true);
      result.current.setOpenCropDialog(true);
      result.current.setCropImageUrl("blob:avatar-preview");
      result.current.ignoreNextClick.current = true;
    });

    expect(result.current).toMatchObject({
      avatarFile: file,
      openAvatarPopup: true,
      openRemoveAvatarDialog: true,
      openCropDialog: true,
      cropImageUrl: "blob:avatar-preview",
    });
    unmount();
    expect(revoke).toHaveBeenCalledWith("blob:avatar-preview");
  });

  it("initializes and updates career scopes and skills", () => {
    const scope = { id: "scope-1", name: "Engineering" };
    const skill = { id: "skill-1", name: "TypeScript" };
    const scopes = renderHook(() => useCareerScopesState([scope] as never));
    const skills = renderHook(() => useSkillsState([skill] as never));

    act(() => {
      scopes.result.current.setCareerScopeInput(scope as never);
      scopes.result.current.setDeleteCareerScopeIds(["scope-old"]);
      scopes.result.current.setOpenCareerScopePopOver(true);
      skills.result.current.setSkillInput("React");
      skills.result.current.setSkills([]);
      skills.result.current.setDeleteSkillIds(["skill-old"]);
      skills.result.current.setOpenSkillPopOver(true);
    });

    expect(scopes.result.current).toMatchObject({
      careerScopes: [scope],
      careerScopeInput: scope,
      deleteCareerScopeIds: ["scope-old"],
      openCareerScopePopOver: true,
    });
    expect(skills.result.current).toMatchObject({
      skillInput: "React",
      skills: [],
      deleteSkillIds: ["skill-old"],
      openSkillPopOver: true,
    });
  });

  it("manages resume, cover-letter, and preview state", () => {
    const { result } = renderHook(() => useReferenceFilesState());
    const resume = new File(["resume"], "resume.pdf");
    const coverLetter = new File(["letter"], "cover-letter.pdf");

    act(() => {
      result.current.setResumeFile(resume);
      result.current.setCoverLetterFile(coverLetter);
      result.current.setOpenRemoveResumeDialog(true);
      result.current.setOpenRemoveCoverLetterDialog(true);
      result.current.setOpenReferencePreview(true);
      result.current.setPreviewReferenceType("coverletter");
      result.current.setPreviewReferenceUrl("/cover-letter.pdf");
    });

    expect(result.current).toMatchObject({
      resumeFile: resume,
      coverLetterFile: coverLetter,
      openRemoveResumeDialog: true,
      openRemoveCoverLetterDialog: true,
      openReferencePreview: true,
      previewReferenceType: "coverletter",
      previewReferenceUrl: "/cover-letter.pdf",
    });
  });

  it("initializes and updates social links", () => {
    const social = {
      id: "social-1",
      platform: "linkedin",
      url: "https://linkedin.com/in/sokha",
    };
    const { result } = renderHook(() => useSocialsState([social] as never));

    act(() => {
      result.current.setSocialInput(social as never);
      result.current.setSocials([]);
      result.current.setDeleteSocialIds(["social-1"]);
    });

    expect(result.current).toMatchObject({
      socialInput: social,
      socials: [],
      deleteSocialIds: ["social-1"],
    });
  });
});
