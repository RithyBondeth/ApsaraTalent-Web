// Generated from contracts/openapi.json. Do not edit.
// SHA256: 0f7d2dd52bfa8eea914a601d5b0f99631f2957eb36ce2842a8cf6dc693c9ef54
import type { paths } from "@/utils/interfaces/generated/api";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/utils/constants/apis/base.api.constant";
type Content<T> = T extends { content: infer C } ? C[keyof C] : never;
type Body<T> = T extends { requestBody?: infer B }
  ? Content<NonNullable<B>>
  : never;
type Result<T> = T extends { responses: infer R }
  ? Content<R[keyof R]>
  : unknown;
export class GatewayApi {
  constructor(private readonly client: AxiosInstance) {}
  async adminReportControllerListAudit(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/admin/audit"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/admin/audit`,
      method: "get",
      params: input.query,
    });
  }
  async adminJobControllerListJobs(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/admin/jobs"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/admin/jobs`,
      method: "get",
      params: input.query,
    });
  }
  async adminJobControllerHideJob(input: {
    jobId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/admin/jobs/{jobId}"]["delete"]>;
  }) {
    return this.client.request<Result<paths["/admin/jobs/{jobId}"]["delete"]>>({
      ...input.config,
      url: API_BASE_URL + `/admin/jobs/${encodeURIComponent(input["jobId"])}`,
      method: "delete",
      params: input.query,
      data: input.body,
    });
  }
  async adminJobControllerRestoreJob(input: {
    jobId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/admin/jobs/{jobId}/restore"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/admin/jobs/${encodeURIComponent(input["jobId"])}/restore`,
      method: "post",
      params: input.query,
    });
  }
  async adminProblemReportControllerListReports(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/admin/problem-reports"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/admin/problem-reports`,
      method: "get",
      params: input.query,
    });
  }
  async adminProblemReportControllerUpdateStatus(input: {
    reportId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/admin/problem-reports/{reportId}/status"]["patch"]>;
  }) {
    return this.client.request<
      Result<paths["/admin/problem-reports/{reportId}/status"]["patch"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/admin/problem-reports/${encodeURIComponent(input["reportId"])}/status`,
      method: "patch",
      params: input.query,
      data: input.body,
    });
  }
  async adminReportControllerListReports(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/admin/reports"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/admin/reports`,
      method: "get",
      params: input.query,
    });
  }
  async adminReportControllerUpdateReportStatus(input: {
    reportId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/admin/reports/{reportId}/status"]["patch"]>;
  }) {
    return this.client.request<
      Result<paths["/admin/reports/{reportId}/status"]["patch"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/admin/reports/${encodeURIComponent(input["reportId"])}/status`,
      method: "patch",
      params: input.query,
      data: input.body,
    });
  }
  async adminUserControllerListUsers(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/admin/users"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/admin/users`,
      method: "get",
      params: input.query,
    });
  }
  async adminUserControllerGetOverview(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/admin/users/overview"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/admin/users/overview`,
      method: "get",
      params: input.query,
    });
  }
  async adminUserControllerGetUser(input: {
    userId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/admin/users/{userId}"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/admin/users/${encodeURIComponent(input["userId"])}`,
      method: "get",
      params: input.query,
    });
  }
  async adminUserControllerUpdateUserStatus(input: {
    userId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/admin/users/{userId}/status"]["patch"]>;
  }) {
    return this.client.request<
      Result<paths["/admin/users/{userId}/status"]["patch"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/admin/users/${encodeURIComponent(input["userId"])}/status`,
      method: "patch",
      params: input.query,
      data: input.body,
    });
  }
  async aiQuotaControllerGetQuota(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/ai/quota"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/ai/quota`,
      method: "get",
      params: input.query,
    });
  }
  async authControllerTwoFactorDisable(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/auth/2fa/disable"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/auth/2fa/disable`,
      method: "post",
      params: input.query,
    });
  }
  async authControllerTwoFactorEnable(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/auth/2fa/enable"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/auth/2fa/enable`,
      method: "post",
      params: input.query,
    });
  }
  async authControllerTwoFactorSetup(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/auth/2fa/setup"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/auth/2fa/setup`,
      method: "post",
      params: input.query,
    });
  }
  async authControllerTwoFactorVerifyLogin(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/auth/2fa/verify-login"]["post"]>;
  }) {
    return this.client.request<Result<paths["/auth/2fa/verify-login"]["post"]>>(
      {
        ...input.config,
        url: API_BASE_URL + `/auth/2fa/verify-login`,
        method: "post",
        params: input.query,
        data: input.body,
      },
    );
  }
  async authControllerForgotPassword(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/auth/forgot-password"]["post"]>;
  }) {
    return this.client.request<Result<paths["/auth/forgot-password"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/auth/forgot-password`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async authControllerGetIceServers(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/auth/ice-servers"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/auth/ice-servers`,
      method: "get",
      params: input.query,
    });
  }
  async authControllerLogin(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/auth/login"]["post"]>;
  }) {
    return this.client.request<Result<paths["/auth/login"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/auth/login`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async authControllerLoginOtp(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/auth/login-otp"]["post"]>;
  }) {
    return this.client.request<Result<paths["/auth/login-otp"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/auth/login-otp`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async authControllerLogout(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/auth/logout"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/auth/logout`,
      method: "post",
      params: input.query,
    });
  }
  async authControllerParseResume(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/auth/parse-resume"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/auth/parse-resume`,
      method: "post",
      params: input.query,
    });
  }
  async authControllerRefreshToken(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/auth/refresh"]["post"]>;
  }) {
    return this.client.request<Result<paths["/auth/refresh"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/auth/refresh`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async authControllerRegisterCompany(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/auth/register-company"]["post"]>;
  }) {
    return this.client.request<Result<paths["/auth/register-company"]["post"]>>(
      {
        ...input.config,
        url: API_BASE_URL + `/auth/register-company`,
        method: "post",
        params: input.query,
        data: input.body,
      },
    );
  }
  async authControllerRegisterEmployee(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/auth/register-employee"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/auth/register-employee"]["post"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/auth/register-employee`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async authControllerResetPassword(input: {
    token: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/auth/reset-password/{token}"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/auth/reset-password/{token}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/auth/reset-password/${encodeURIComponent(input["token"])}`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async authControllerVerifyEmail(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/auth/verify-email"]["post"]>;
  }) {
    return this.client.request<Result<paths["/auth/verify-email"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/auth/verify-email`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async authControllerResendEmailOtp(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/auth/verify-email/resend"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/auth/verify-email/resend"]["post"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/auth/verify-email/resend`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async authControllerVerifyOtp(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/auth/verify-otp"]["post"]>;
  }) {
    return this.client.request<Result<paths["/auth/verify-otp"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/auth/verify-otp`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async chatControllerGetAttachment(input: {
    date: string;
    filename: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/chat/attachment/{date}/{filename}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/chat/attachment/${encodeURIComponent(input["date"])}/${encodeURIComponent(input["filename"])}`,
      method: "get",
      params: input.query,
    });
  }
  async chatControllerInitiateChat(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/chat/initiate"]["post"]>;
  }) {
    return this.client.request<Result<paths["/chat/initiate"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/chat/initiate`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async chatControllerGetRecentChats(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/chat/recent"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/chat/recent`,
      method: "get",
      params: input.query,
    });
  }
  async chatControllerUploadAttachment(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/chat/upload"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/chat/upload`,
      method: "post",
      params: input.query,
    });
  }
  async healthControllerCheckHealth(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/health"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/health`,
      method: "get",
      params: input.query,
    });
  }
  async healthControllerCheckLiveness(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/health/live"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/health/live`,
      method: "get",
      params: input.query,
    });
  }
  async healthControllerCheckReadiness(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/health/ready"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/health/ready`,
      method: "get",
      params: input.query,
    });
  }
  async jobControllerFindAllJobs(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/job/all"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/job/all`,
      method: "get",
      params: input.query,
    });
  }
  async applicationControllerApplyApplication(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/job/application"]["post"]>;
  }) {
    return this.client.request<Result<paths["/job/application"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/job/application`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async applicationControllerBulkUpdateApplicationStatus(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/job/application/bulk-status"]["patch"]>;
  }) {
    return this.client.request<
      Result<paths["/job/application/bulk-status"]["patch"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/job/application/bulk-status`,
      method: "patch",
      params: input.query,
      data: input.body,
    });
  }
  async applicationControllerGetJobApplications(input: {
    jobId: string;
    companyId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/job/application/job/{jobId}/company/{companyId}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/job/application/job/${encodeURIComponent(input["jobId"])}/company/${encodeURIComponent(input["companyId"])}`,
      method: "get",
      params: input.query,
    });
  }
  async applicationControllerGetMyApplications(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/job/application/mine"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/job/application/mine`,
      method: "get",
      params: input.query,
    });
  }
  async applicationControllerGetJobPipeline(input: {
    jobId: string;
    companyId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<
        paths["/job/application/pipeline/job/{jobId}/company/{companyId}"]["get"]
      >
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/job/application/pipeline/job/${encodeURIComponent(input["jobId"])}/company/${encodeURIComponent(input["companyId"])}`,
      method: "get",
      params: input.query,
    });
  }
  async applicationControllerUpdateApplicationStatus(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/job/application/status"]["patch"]>;
  }) {
    return this.client.request<
      Result<paths["/job/application/status"]["patch"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/job/application/status`,
      method: "patch",
      params: input.query,
      data: input.body,
    });
  }
  async applicationControllerWithdrawApplication(input: {
    applicationId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/job/application/{applicationId}"]["delete"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/job/application/${encodeURIComponent(input["applicationId"])}`,
      method: "delete",
      params: input.query,
    });
  }
  async applicationControllerListApplicationStatusHistory(input: {
    applicationId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/job/application/{applicationId}/history"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/job/application/${encodeURIComponent(input["applicationId"])}/history`,
      method: "get",
      params: input.query,
    });
  }
  async applicationControllerListApplicationNotes(input: {
    applicationId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/job/application/{applicationId}/notes"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/job/application/${encodeURIComponent(input["applicationId"])}/notes`,
      method: "get",
      params: input.query,
    });
  }
  async applicationControllerCreateApplicationNote(input: {
    applicationId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/job/application/{applicationId}/notes"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/job/application/{applicationId}/notes"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/job/application/${encodeURIComponent(input["applicationId"])}/notes`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async applicationControllerDeleteApplicationNote(input: {
    applicationId: string;
    noteId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/job/application/{applicationId}/notes/{noteId}"]["delete"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/job/application/${encodeURIComponent(input["applicationId"])}/notes/${encodeURIComponent(input["noteId"])}`,
      method: "delete",
      params: input.query,
    });
  }
  async employerAnalyticsControllerGetEmployerAnalytics(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/job/employer-analytics"]["get"]>>(
      {
        ...input.config,
        url: API_BASE_URL + `/job/employer-analytics`,
        method: "get",
        params: input.query,
      },
    );
  }
  async savedSearchControllerListSavedSearches(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/job/saved-search"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/job/saved-search`,
      method: "get",
      params: input.query,
    });
  }
  async savedSearchControllerCreateSavedSearch(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/job/saved-search"]["post"]>;
  }) {
    return this.client.request<Result<paths["/job/saved-search"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/job/saved-search`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async savedSearchControllerUpdateSavedSearch(input: {
    savedSearchId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/job/saved-search/{savedSearchId}"]["patch"]>;
  }) {
    return this.client.request<
      Result<paths["/job/saved-search/{savedSearchId}"]["patch"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/job/saved-search/${encodeURIComponent(input["savedSearchId"])}`,
      method: "patch",
      params: input.query,
      data: input.body,
    });
  }
  async savedSearchControllerDeleteSavedSearch(input: {
    savedSearchId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/job/saved-search/{savedSearchId}"]["delete"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/job/saved-search/${encodeURIComponent(input["savedSearchId"])}`,
      method: "delete",
      params: input.query,
    });
  }
  async savedSearchControllerPreviewSavedSearch(input: {
    savedSearchId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/job/saved-search/{savedSearchId}/preview"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/job/saved-search/${encodeURIComponent(input["savedSearchId"])}/preview`,
      method: "get",
      params: input.query,
    });
  }
  async jobControllerSearchJobs(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/job/search"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/job/search`,
      method: "get",
      params: input.query,
    });
  }
  async jobMatchingControllerGetAiMatchExplanation(input: {
    eid: string;
    cid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/ai-explanation/{eid}/{cid}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/ai-explanation/${encodeURIComponent(input["eid"])}/${encodeURIComponent(input["cid"])}`,
      method: "get",
      params: input.query,
    });
  }
  async jobMatchingControllerStreamAiMatchExplanation(input: {
    eid: string;
    cid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/ai-explanation/{eid}/{cid}/stream"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/ai-explanation/${encodeURIComponent(input["eid"])}/${encodeURIComponent(input["cid"])}/stream`,
      method: "get",
      params: input.query,
    });
  }
  async jobMatchingControllerGetAiInterviewPrep(input: {
    eid: string;
    cid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/ai-interview-prep/{eid}/{cid}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/ai-interview-prep/${encodeURIComponent(input["eid"])}/${encodeURIComponent(input["cid"])}`,
      method: "get",
      params: input.query,
    });
  }
  async jobMatchingControllerStreamAiInterviewPrep(input: {
    eid: string;
    cid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/ai-interview-prep/{eid}/{cid}/stream"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/ai-interview-prep/${encodeURIComponent(input["eid"])}/${encodeURIComponent(input["cid"])}/stream`,
      method: "get",
      params: input.query,
    });
  }
  async jobMatchingControllerStreamAiSkillGap(input: {
    eid: string;
    cid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/ai-skill-gap/{eid}/{cid}/stream"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/ai-skill-gap/${encodeURIComponent(input["eid"])}/${encodeURIComponent(input["cid"])}/stream`,
      method: "get",
      params: input.query,
    });
  }
  async jobMatchingControllerGetMatchingAnalytics(input: {
    id: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/match/analytics/{id}"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/match/analytics/${encodeURIComponent(input["id"])}`,
      method: "get",
      params: input.query,
    });
  }
  async jobMatchingControllerCompanyLikes(input: {
    eid: string;
    cid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/company/{cid}/like/{eid}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/company/${encodeURIComponent(input["cid"])}/like/${encodeURIComponent(input["eid"])}`,
      method: "post",
      params: input.query,
    });
  }
  async jobMatchingControllerMarkCompanyMatchingSeen(input: {
    cid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/company/{cid}/matching-seen"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/company/${encodeURIComponent(input["cid"])}/matching-seen`,
      method: "post",
      params: input.query,
    });
  }
  async jobMatchingControllerFindCurrentCompanyLiked(input: {
    cid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/current-company-liked/{cid}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/current-company-liked/${encodeURIComponent(input["cid"])}`,
      method: "get",
      params: input.query,
    });
  }
  async jobMatchingControllerFindCurrentCompanyMatchingCount(input: {
    cid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/current-company-matching-count/{cid}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/current-company-matching-count/${encodeURIComponent(input["cid"])}`,
      method: "get",
      params: input.query,
    });
  }
  async jobMatchingControllerFindCurrentCompanyMatching(input: {
    cid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/current-company-matching/{cid}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/current-company-matching/${encodeURIComponent(input["cid"])}`,
      method: "get",
      params: input.query,
    });
  }
  async jobMatchingControllerFindCurrentEmployeeLiked(input: {
    eid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/current-employee-liked/{eid}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/current-employee-liked/${encodeURIComponent(input["eid"])}`,
      method: "get",
      params: input.query,
    });
  }
  async jobMatchingControllerFindCurrentEmployeeMatchingCount(input: {
    eid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/current-employee-matching-count/{eid}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/current-employee-matching-count/${encodeURIComponent(input["eid"])}`,
      method: "get",
      params: input.query,
    });
  }
  async jobMatchingControllerFindCurrentEmployeeMatching(input: {
    eid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/current-employee-matching/{eid}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/current-employee-matching/${encodeURIComponent(input["eid"])}`,
      method: "get",
      params: input.query,
    });
  }
  async jobMatchingControllerEmployeeLikes(input: {
    eid: string;
    cid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/employee/{eid}/like/{cid}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/employee/${encodeURIComponent(input["eid"])}/like/${encodeURIComponent(input["cid"])}`,
      method: "post",
      params: input.query,
    });
  }
  async jobMatchingControllerMarkEmployeeMatchingSeen(input: {
    eid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/employee/{eid}/matching-seen"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/employee/${encodeURIComponent(input["eid"])}/matching-seen`,
      method: "post",
      params: input.query,
    });
  }
  async interviewControllerCreateInterview(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/match/interview"]["post"]>;
  }) {
    return this.client.request<Result<paths["/match/interview"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/match/interview`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async interviewControllerGetInterviewsByCompany(input: {
    companyId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/interview/company/{companyId}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/interview/company/${encodeURIComponent(input["companyId"])}`,
      method: "get",
      params: input.query,
    });
  }
  async interviewControllerGetInterviewsByEmployee(input: {
    employeeId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/interview/employee/{employeeId}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/interview/employee/${encodeURIComponent(input["employeeId"])}`,
      method: "get",
      params: input.query,
    });
  }
  async interviewControllerUpdateInterviewStatus(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/match/interview/status"]["patch"]>;
  }) {
    return this.client.request<
      Result<paths["/match/interview/status"]["patch"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/match/interview/status`,
      method: "patch",
      params: input.query,
      data: input.body,
    });
  }
  async jobMatchingControllerUnmatch(input: {
    eid: string;
    cid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/match/unmatch/{eid}/{cid}"]["delete"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/match/unmatch/${encodeURIComponent(input["eid"])}/${encodeURIComponent(input["cid"])}`,
      method: "delete",
      params: input.query,
    });
  }
  async metricsControllerMetrics(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/metrics"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/metrics`,
      method: "get",
      params: input.query,
    });
  }
  async notificationControllerListByUser(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/notification"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/notification`,
      method: "get",
      params: input.query,
    });
  }
  async notificationControllerCreateForCurrentUser(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/notification"]["post"]>;
  }) {
    return this.client.request<Result<paths["/notification"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/notification`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async notificationControllerDeleteAllNotifications(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/notification"]["delete"]>>({
      ...input.config,
      url: API_BASE_URL + `/notification`,
      method: "delete",
      params: input.query,
    });
  }
  async notificationControllerRegisterDeviceToken(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/notification/device-token"]["put"]>;
  }) {
    return this.client.request<
      Result<paths["/notification/device-token"]["put"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/notification/device-token`,
      method: "put",
      params: input.query,
      data: input.body,
    });
  }
  async notificationControllerRemoveDeviceToken(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/notification/device-token"]["delete"]>;
  }) {
    return this.client.request<
      Result<paths["/notification/device-token"]["delete"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/notification/device-token`,
      method: "delete",
      params: input.query,
      data: input.body,
    });
  }
  async notificationPreferenceControllerGetPreferences(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/notification/preferences"]["get"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/notification/preferences`,
      method: "get",
      params: input.query,
    });
  }
  async notificationPreferenceControllerUpdatePreferences(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/notification/preferences"]["patch"]>;
  }) {
    return this.client.request<
      Result<paths["/notification/preferences"]["patch"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/notification/preferences`,
      method: "patch",
      params: input.query,
      data: input.body,
    });
  }
  async notificationPreferenceControllerUnsubscribe(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/notification/preferences/unsubscribe"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/notification/preferences/unsubscribe"]["post"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/notification/preferences/unsubscribe`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async notificationControllerMarkAllRead(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/notification/read-all"]["patch"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/notification/read-all`,
      method: "patch",
      params: input.query,
    });
  }
  async notificationControllerGetUnreadCount(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/notification/unread-count"]["get"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/notification/unread-count`,
      method: "get",
      params: input.query,
    });
  }
  async notificationControllerDeleteNotification(input: {
    id: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/notification/{id}"]["delete"]>>({
      ...input.config,
      url: API_BASE_URL + `/notification/${encodeURIComponent(input["id"])}`,
      method: "delete",
      params: input.query,
    });
  }
  async notificationControllerMarkRead(input: {
    id: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/notification/{id}/read"]["patch"]>
    >({
      ...input.config,
      url:
        API_BASE_URL + `/notification/${encodeURIComponent(input["id"])}/read`,
      method: "patch",
      params: input.query,
    });
  }
  async publicJobControllerFindPublicJobSitemap(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/public/job/sitemap/entries"]["get"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/public/job/sitemap/entries`,
      method: "get",
      params: input.query,
    });
  }
  async publicJobControllerFindOneJob(input: {
    jobId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/public/job/{jobId}"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/public/job/${encodeURIComponent(input["jobId"])}`,
      method: "get",
      params: input.query,
    });
  }
  async publicUserControllerGetCareerScopes(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/public/user/career-scopes"]["get"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/public/user/career-scopes`,
      method: "get",
      params: input.query,
    });
  }
  async publicUserControllerGetLandingStats(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/public/user/landing-stats"]["get"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/public/user/landing-stats`,
      method: "get",
      params: input.query,
    });
  }
  async resumeBuilderControllerBuildResume(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/resume/build-resume"]["post"]>;
  }) {
    return this.client.request<Result<paths["/resume/build-resume"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/resume/build-resume`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async resumeBuilderControllerGenerateCoverLetter(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/resume/cover-letter"]["post"]>;
  }) {
    return this.client.request<Result<paths["/resume/cover-letter"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/resume/cover-letter`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async resumeBuilderControllerGenerateCoverLetterPdf(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/resume/cover-letter-pdf"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/resume/cover-letter-pdf"]["post"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/resume/cover-letter-pdf`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async resumeBuilderControllerStreamCoverLetter(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/resume/cover-letter/stream"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/resume/cover-letter/stream"]["post"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/resume/cover-letter/stream`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async resumeDraftControllerList(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/resume/drafts"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/resume/drafts`,
      method: "get",
      params: input.query,
    });
  }
  async resumeDraftControllerCreate(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/resume/drafts"]["post"]>;
  }) {
    return this.client.request<Result<paths["/resume/drafts"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/resume/drafts`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async resumeDraftControllerRead(input: {
    id: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/resume/drafts/{id}"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/resume/drafts/${encodeURIComponent(input["id"])}`,
      method: "get",
      params: input.query,
    });
  }
  async resumeDraftControllerUpdate(input: {
    id: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/resume/drafts/{id}"]["put"]>;
  }) {
    return this.client.request<Result<paths["/resume/drafts/{id}"]["put"]>>({
      ...input.config,
      url: API_BASE_URL + `/resume/drafts/${encodeURIComponent(input["id"])}`,
      method: "put",
      params: input.query,
      data: input.body,
    });
  }
  async resumeDraftControllerRemove(input: {
    id: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/resume/drafts/{id}"]["delete"]>>({
      ...input.config,
      url: API_BASE_URL + `/resume/drafts/${encodeURIComponent(input["id"])}`,
      method: "delete",
      params: input.query,
    });
  }
  async resumeBuilderControllerGenerateResume(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/resume/generate"]["post"]>;
  }) {
    return this.client.request<Result<paths["/resume/generate"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/resume/generate`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async resumeBuilderControllerGenerateResumeFromText(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/resume/generate-from-text"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/resume/generate-from-text"]["post"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/resume/generate-from-text`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async resumeBuilderControllerGenerateInterviewPrepPdf(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/resume/interview-prep-pdf"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/resume/interview-prep-pdf"]["post"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/resume/interview-prep-pdf`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async resumeBuilderControllerOptimizeResume(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/resume/optimize"]["post"]>;
  }) {
    return this.client.request<Result<paths["/resume/optimize"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/resume/optimize`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async resumeBuilderControllerStreamOptimizeResume(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/resume/optimize/stream"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/resume/optimize/stream"]["post"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/resume/optimize/stream`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async resumeBuilderControllerPolishCoverLetter(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/resume/polish-cover-letter"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/resume/polish-cover-letter"]["post"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/resume/polish-cover-letter`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async resumeBuilderControllerStreamPolishCoverLetter(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/resume/polish-cover-letter/stream"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/resume/polish-cover-letter/stream"]["post"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/resume/polish-cover-letter/stream`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async resumeBuilderControllerStreamRefineBio(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/resume/refine-bio/stream"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/resume/refine-bio/stream"]["post"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/resume/refine-bio/stream`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async resumeTemplateControllerFindAllResumeTemplate(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/resume/template/all"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/resume/template/all`,
      method: "get",
      params: input.query,
    });
  }
  async resumeTemplateControllerCreateResumeTemplate(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/resume/template/create"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/resume/template/create"]["post"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/resume/template/create`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async resumeTemplateControllerFindOneResumeTemplateById(input: {
    id: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/resume/template/one/{id}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/resume/template/one/${encodeURIComponent(input["id"])}`,
      method: "get",
      params: input.query,
    });
  }
  async resumeTemplateControllerSearchResumeTemplate(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/resume/template/search"]["get"]>>(
      {
        ...input.config,
        url: API_BASE_URL + `/resume/template/search`,
        method: "get",
        params: input.query,
      },
    );
  }
  async facebookControllerFacebookCallback(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/social/facebook/callback"]["get"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/social/facebook/callback`,
      method: "get",
      params: input.query,
    });
  }
  async facebookControllerFacebookAuth(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/social/facebook/login"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/social/facebook/login`,
      method: "get",
      params: input.query,
    });
  }
  async githubControllerGithubCallback(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/social/github/callback"]["get"]>>(
      {
        ...input.config,
        url: API_BASE_URL + `/social/github/callback`,
        method: "get",
        params: input.query,
      },
    );
  }
  async githubControllerGithubAuth(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/social/github/login"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/social/github/login`,
      method: "get",
      params: input.query,
    });
  }
  async googleControllerGoogleCallback(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/social/google/callback"]["get"]>>(
      {
        ...input.config,
        url: API_BASE_URL + `/social/google/callback`,
        method: "get",
        params: input.query,
      },
    );
  }
  async googleControllerGoogleAuth(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/social/google/login"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/social/google/login`,
      method: "get",
      params: input.query,
    });
  }
  async linkedInControllerLinkedInCallback(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/social/linkedin/callback"]["get"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/social/linkedin/callback`,
      method: "get",
      params: input.query,
    });
  }
  async linkedInControllerLinkedInAuth(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/social/linkedin/login"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/social/linkedin/login`,
      method: "get",
      params: input.query,
    });
  }
  async mobileOAuthControllerExchange(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/social/mobile/exchange"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/social/mobile/exchange"]["post"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/social/mobile/exchange`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async publicStorageControllerGetPublicFile(input: {
    folder: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/storage/{folder}/{path}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL + `/storage/${encodeURIComponent(input["folder"])}/{path}`,
      method: "get",
      params: input.query,
    });
  }
  async accountLifecycleControllerRequestDeletion(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/user/account/delete"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/user/account/delete`,
      method: "post",
      params: input.query,
    });
  }
  async accountLifecycleControllerCancelDeletion(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/account/delete/cancel"]["post"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/user/account/delete/cancel`,
      method: "post",
      params: input.query,
    });
  }
  async accountLifecycleControllerExportData(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/user/account/export"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/user/account/export`,
      method: "get",
      params: input.query,
    });
  }
  async userControllerFindAllUsers(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/user/all"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/user/all`,
      method: "get",
      params: input.query,
    });
  }
  async companyControllerFindAll(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/user/company/all"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/user/company/all`,
      method: "get",
      params: input.query,
    });
  }
  async userControllerFindAllCompanyFavorite(input: {
    cid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/company/all-favorites/{cid}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/company/all-favorites/${encodeURIComponent(input["cid"])}`,
      method: "get",
      params: input.query,
    });
  }
  async companyControllerCountAllCompanies(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/user/company/count"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/user/company/count`,
      method: "get",
      params: input.query,
    });
  }
  async userControllerCountCompanyFavorite(input: {
    cid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/company/count-favorite/{cid}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/company/count-favorite/${encodeURIComponent(input["cid"])}`,
      method: "get",
      params: input.query,
    });
  }
  async companyControllerFindOneById(input: {
    companyId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/company/one/{companyId}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/company/one/${encodeURIComponent(input["companyId"])}`,
      method: "get",
      params: input.query,
    });
  }
  async companyControllerRemoveCompanyAvatar(input: {
    companyId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/company/remove-avatar/{companyId}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/company/remove-avatar/${encodeURIComponent(input["companyId"])}`,
      method: "post",
      params: input.query,
    });
  }
  async companyControllerRemoveCompanyCover(input: {
    companyId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/company/remove-cover/{companyId}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/company/remove-cover/${encodeURIComponent(input["companyId"])}`,
      method: "post",
      params: input.query,
    });
  }
  async companyControllerRemoveCompanyImage(input: {
    companyId: string;
    imageId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<
        paths["/user/company/remove-images/{companyId}/{imageId}"]["delete"]
      >
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/company/remove-images/${encodeURIComponent(input["companyId"])}/${encodeURIComponent(input["imageId"])}`,
      method: "delete",
      params: input.query,
    });
  }
  async companyControllerRemoveOpenPosition(input: {
    companyId: string;
    opId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<
        paths["/user/company/remove-open-position/{companyId}/{opId}"]["delete"]
      >
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/company/remove-open-position/${encodeURIComponent(input["companyId"])}/${encodeURIComponent(input["opId"])}`,
      method: "delete",
      params: input.query,
    });
  }
  async companyControllerUpdateCompanyInfo(input: {
    companyId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/user/company/update-info/{companyId}"]["patch"]>;
  }) {
    return this.client.request<
      Result<paths["/user/company/update-info/{companyId}"]["patch"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/company/update-info/${encodeURIComponent(input["companyId"])}`,
      method: "patch",
      params: input.query,
      data: input.body,
    });
  }
  async companyControllerUploadCompanyAvatar(input: {
    companyId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/company/upload-avatar/{companyId}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/company/upload-avatar/${encodeURIComponent(input["companyId"])}`,
      method: "post",
      params: input.query,
    });
  }
  async companyControllerUploadCompanyCover(input: {
    companyId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/company/upload-cover/{companyId}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/company/upload-cover/${encodeURIComponent(input["companyId"])}`,
      method: "post",
      params: input.query,
    });
  }
  async companyControllerUploadCompanyImages(input: {
    companyId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/company/upload-images/{companyId}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/company/upload-images/${encodeURIComponent(input["companyId"])}`,
      method: "post",
      params: input.query,
    });
  }
  async userControllerCompanyFavoriteEmployee(input: {
    cid: string;
    eid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/company/{cid}/favorite/employee/{eid}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/company/${encodeURIComponent(input["cid"])}/favorite/employee/${encodeURIComponent(input["eid"])}`,
      method: "post",
      params: input.query,
    });
  }
  async userControllerCompanyUnfavoriteEmployee(input: {
    cid: string;
    eid: string;
    favoriteId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<
        paths["/user/company/{cid}/unfavorite/{favoriteId}/employee/{eid}"]["post"]
      >
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/company/${encodeURIComponent(input["cid"])}/unfavorite/${encodeURIComponent(input["favoriteId"])}/employee/${encodeURIComponent(input["eid"])}`,
      method: "post",
      params: input.query,
    });
  }
  async userControllerGetCurrentUser(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/user/current-user"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/user/current-user`,
      method: "get",
      params: input.query,
    });
  }
  async employeeControllerFindAll(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/user/employee/all"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/user/employee/all`,
      method: "get",
      params: input.query,
    });
  }
  async userControllerFindAllEmployeeFavorite(input: {
    eid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/employee/all-favorites/{eid}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/employee/all-favorites/${encodeURIComponent(input["eid"])}`,
      method: "get",
      params: input.query,
    });
  }
  async userControllerCountEmployeeFavorite(input: {
    eid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/employee/count-favorite/{eid}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/employee/count-favorite/${encodeURIComponent(input["eid"])}`,
      method: "get",
      params: input.query,
    });
  }
  async employeeControllerFindOneById(input: {
    employeeId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/employee/one/{employeeId}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/employee/one/${encodeURIComponent(input["employeeId"])}`,
      method: "get",
      params: input.query,
    });
  }
  async employeeControllerRemoveEmployeeAvatar(input: {
    employeeId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/employee/remove-avatar/{employeeId}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/employee/remove-avatar/${encodeURIComponent(input["employeeId"])}`,
      method: "post",
      params: input.query,
    });
  }
  async employeeControllerRemoveEmployeeCoverLetter(input: {
    employeeId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/employee/remove-cover-letter/{employeeId}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/employee/remove-cover-letter/${encodeURIComponent(input["employeeId"])}`,
      method: "post",
      params: input.query,
    });
  }
  async employeeControllerRemoveEmployeeEducation(input: {
    employeeId: string;
    educationId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<
        paths["/user/employee/remove-education/{employeeId}/{educationId}"]["delete"]
      >
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/employee/remove-education/${encodeURIComponent(input["employeeId"])}/${encodeURIComponent(input["educationId"])}`,
      method: "delete",
      params: input.query,
    });
  }
  async employeeControllerRemoveEmployeeExperience(input: {
    employeeId: string;
    experienceId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<
        paths["/user/employee/remove-experience/{employeeId}/{experienceId}"]["delete"]
      >
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/employee/remove-experience/${encodeURIComponent(input["employeeId"])}/${encodeURIComponent(input["experienceId"])}`,
      method: "delete",
      params: input.query,
    });
  }
  async employeeControllerRemoveEmployeeResume(input: {
    employeeId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/employee/remove-resume/{employeeId}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/employee/remove-resume/${encodeURIComponent(input["employeeId"])}`,
      method: "post",
      params: input.query,
    });
  }
  async employeeControllerSearchEmployee(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/employee/search-employee"]["get"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/user/employee/search-employee`,
      method: "get",
      params: input.query,
    });
  }
  async employeeControllerUpdateEmployeeInfo(input: {
    employeeId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/user/employee/update-info/{employeeId}"]["patch"]>;
  }) {
    return this.client.request<
      Result<paths["/user/employee/update-info/{employeeId}"]["patch"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/employee/update-info/${encodeURIComponent(input["employeeId"])}`,
      method: "patch",
      params: input.query,
      data: input.body,
    });
  }
  async employeeControllerUploadEmployeeAvatar(input: {
    employeeId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/employee/upload-avatar/{employeeId}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/employee/upload-avatar/${encodeURIComponent(input["employeeId"])}`,
      method: "post",
      params: input.query,
    });
  }
  async employeeControllerUploadEmployeeCoverLetter(input: {
    employeeId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/employee/upload-cover-letter/{employeeId}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/employee/upload-cover-letter/${encodeURIComponent(input["employeeId"])}`,
      method: "post",
      params: input.query,
    });
  }
  async employeeControllerUploadEmployeeResume(input: {
    employeeId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/employee/upload-resume/{employeeId}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/employee/upload-resume/${encodeURIComponent(input["employeeId"])}`,
      method: "post",
      params: input.query,
    });
  }
  async userControllerEmployeeFavoriteCompany(input: {
    eid: string;
    cid: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/employee/{eid}/favorite/company/{cid}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/employee/${encodeURIComponent(input["eid"])}/favorite/company/${encodeURIComponent(input["cid"])}`,
      method: "post",
      params: input.query,
    });
  }
  async userControllerEmployeeUnfavoriteCompany(input: {
    eid: string;
    cid: string;
    favoriteId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<
        paths["/user/employee/{eid}/unfavorite/{favoriteId}/company/{cid}"]["post"]
      >
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/employee/${encodeURIComponent(input["eid"])}/unfavorite/${encodeURIComponent(input["favoriteId"])}/company/${encodeURIComponent(input["cid"])}`,
      method: "post",
      params: input.query,
    });
  }
  async employeeControllerGetDocument(input: {
    employeeId: string;
    type: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/employee/{employeeId}/document/{type}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/employee/${encodeURIComponent(input["employeeId"])}/document/${encodeURIComponent(input["type"])}`,
      method: "get",
      params: input.query,
    });
  }
  async userControllerFindAllCareerScopes(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/find-all-career-scopes"]["get"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/user/find-all-career-scopes`,
      method: "get",
      params: input.query,
    });
  }
  async profileAnalyticsControllerUpdatePrivacySettings(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/user/me/privacy"]["patch"]>;
  }) {
    return this.client.request<Result<paths["/user/me/privacy"]["patch"]>>({
      ...input.config,
      url: API_BASE_URL + `/user/me/privacy`,
      method: "patch",
      params: input.query,
      data: input.body,
    });
  }
  async profileAnalyticsControllerGetMyProfileAnalytics(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/me/profile-analytics"]["get"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/user/me/profile-analytics`,
      method: "get",
      params: input.query,
    });
  }
  async moderationControllerGetBlockStatus(input: {
    userId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/moderation/block-status/{userId}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/moderation/block-status/${encodeURIComponent(input["userId"])}`,
      method: "get",
      params: input.query,
    });
  }
  async moderationControllerBlockUser(input: {
    userId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/moderation/block/{userId}"]["post"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/moderation/block/${encodeURIComponent(input["userId"])}`,
      method: "post",
      params: input.query,
    });
  }
  async moderationControllerUnblockUser(input: {
    userId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/moderation/block/{userId}"]["delete"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/moderation/block/${encodeURIComponent(input["userId"])}`,
      method: "delete",
      params: input.query,
    });
  }
  async moderationControllerListBlockedUsers(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/moderation/blocked"]["get"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/user/moderation/blocked`,
      method: "get",
      params: input.query,
    });
  }
  async moderationControllerGetHiddenProfileIds(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/moderation/hidden-ids"]["get"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/user/moderation/hidden-ids`,
      method: "get",
      params: input.query,
    });
  }
  async moderationControllerReportUser(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/user/moderation/report"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/user/moderation/report"]["post"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/user/moderation/report`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async userControllerFindOneUserById(input: {
    userId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<Result<paths["/user/one/{userId}"]["get"]>>({
      ...input.config,
      url: API_BASE_URL + `/user/one/${encodeURIComponent(input["userId"])}`,
      method: "get",
      params: input.query,
    });
  }
  async userControllerUpdatePushNotificationToken(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/user/push-token"]["post"]>;
  }) {
    return this.client.request<Result<paths["/user/push-token"]["post"]>>({
      ...input.config,
      url: API_BASE_URL + `/user/push-token`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
  async userControllerGetCompanyRecommendations(input: {
    companyId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/recommendation/company/{companyId}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/recommendation/company/${encodeURIComponent(input["companyId"])}`,
      method: "get",
      params: input.query,
    });
  }
  async userControllerGetEmployeeRecommendations(input: {
    employeeId: string;
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
  }) {
    return this.client.request<
      Result<paths["/user/recommendation/employee/{employeeId}"]["get"]>
    >({
      ...input.config,
      url:
        API_BASE_URL +
        `/user/recommendation/employee/${encodeURIComponent(input["employeeId"])}`,
      method: "get",
      params: input.query,
    });
  }
  async supportControllerReportProblem(input: {
    query?: Record<string, unknown>;
    config?: AxiosRequestConfig;
    body: Body<paths["/user/support/report-problem"]["post"]>;
  }) {
    return this.client.request<
      Result<paths["/user/support/report-problem"]["post"]>
    >({
      ...input.config,
      url: API_BASE_URL + `/user/support/report-problem`,
      method: "post",
      params: input.query,
      data: input.body,
    });
  }
}
export const realtimeEvents = {
  newNotification: "newNotification",
  badgeIncrement: "badgeIncrement",
  interviewUpdate: "interviewUpdate",
  unmatchUpdate: "unmatchUpdate",
} as const;
