import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMockSocket } from "@/tests/helpers/mock-socket";

const socketManagerMocks = vi.hoisted(() => ({ getSocket: vi.fn() }));
const callUtilsMocks = vi.hoisted(() => ({
  fetchIceServers: vi.fn(),
  normalizeParticipantAvatar: vi.fn(),
}));
const webRtcMocks = vi.hoisted(() => ({
  getPc: vi.fn(),
  setPc: vi.fn(),
  getPendingOffer: vi.fn(),
  setPendingOffer: vi.fn(),
  clearPendingIceCandidates: vi.fn(),
  addPendingIceCandidate: vi.fn(),
  closePc: vi.fn(),
  stopStream: vi.fn(() => null),
  clearRingTimeout: vi.fn(),
  setRingTimeout: vi.fn(),
  clearConnectTimeout: vi.fn(),
  armConnectTimeout: vi.fn(),
  flushPendingIceCandidates: vi.fn(),
}));

vi.mock("../chat/socket-manager", () => ({ getSocket: socketManagerMocks.getSocket }));
vi.mock("./utils", () => ({
  fetchIceServers: callUtilsMocks.fetchIceServers,
  normalizeParticipantAvatar: callUtilsMocks.normalizeParticipantAvatar,
  CALL_RING_TIMEOUT_MS: 30_000,
  CALL_END_DISMISS_MS: 2_000,
}));
vi.mock("./webrtc-manager", () => webRtcMocks);
vi.mock("@/utils/functions/media", () => ({
  normalizeMediaUrl: (value: string | null | undefined) => value ?? null,
}));

import { useCallStore } from "./call.store";

function createPeerConnection() {
  return {
    connectionState: "new",
    remoteDescription: null as RTCSessionDescriptionInit | null,
    onicecandidate: null as ((event: { candidate: { toJSON: () => object } | null }) => void) | null,
    ontrack: null as ((event: { streams: MediaStream[] }) => void) | null,
    onconnectionstatechange: null as (() => void) | null,
    addTrack: vi.fn(),
    addIceCandidate: vi.fn().mockResolvedValue(undefined),
    createOffer: vi.fn().mockResolvedValue({ type: "offer", sdp: "offer-sdp" }),
    createAnswer: vi.fn().mockResolvedValue({ type: "answer", sdp: "answer-sdp" }),
    setLocalDescription: vi.fn().mockResolvedValue(undefined),
    setRemoteDescription: vi.fn().mockResolvedValue(undefined),
    close: vi.fn(),
  };
}

function createAudioStream() {
  const track = { enabled: true, stop: vi.fn() };
  const stream = {
    getTracks: () => [track],
    getAudioTracks: () => [track],
  } as unknown as MediaStream;
  return { stream, track };
}

describe("call store", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCallStore.setState({
      status: "idle",
      callId: null,
      localStream: null,
      remoteStream: null,
      isMuted: false,
      caller: null,
      callee: null,
      callStartedAt: null,
    });
    callUtilsMocks.fetchIceServers.mockResolvedValue([{ urls: "stun:test.example.com" }]);
    callUtilsMocks.normalizeParticipantAvatar.mockImplementation((participant) => participant);
    webRtcMocks.getPc.mockReturnValue(null);
    webRtcMocks.getPendingOffer.mockReturnValue(null);
    webRtcMocks.stopStream.mockReturnValue(null);
    vi.stubGlobal("crypto", { randomUUID: () => "call-1" });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("registers every incoming call signaling listener once", () => {
    const socket = createMockSocket();

    useCallStore.getState().initCallSignaling(socket as never);

    expect(socket.off.mock.calls.map(([event]) => event)).toEqual([
      "incomingCall",
      "callAnswered",
      "remoteIceCandidate",
      "callDeclined",
      "callEnded",
    ]);
    expect(Array.from(socket.listeners.keys())).toEqual([
      "incomingCall",
      "callAnswered",
      "remoteIceCandidate",
      "callDeclined",
      "callEnded",
    ]);
  });

  it("initiates a call, forwards ICE, receives media, connects, and toggles mute", async () => {
    const socket = createMockSocket();
    const pc = createPeerConnection();
    const { stream, track } = createAudioStream();
    socketManagerMocks.getSocket.mockReturnValue(socket);
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: vi.fn().mockResolvedValue(stream) },
    });
    vi.stubGlobal("RTCPeerConnection", function MockRTCPeerConnection() {
      return pc;
    });
    const callee = { userId: "user-2", name: "Sophea", avatar: "/avatar.png" };

    await useCallStore.getState().initiateCall(callee);

    expect(pc.addTrack).toHaveBeenCalledWith(track, stream);
    expect(pc.setLocalDescription).toHaveBeenCalledWith({ type: "offer", sdp: "offer-sdp" });
    expect(socket.emit).toHaveBeenCalledWith("callOffer", {
      callId: "call-1",
      receiverId: "user-2",
      offer: { type: "offer", sdp: "offer-sdp" },
    });
    expect(useCallStore.getState()).toMatchObject({
      status: "calling",
      callId: "call-1",
      localStream: stream,
      callee,
      isMuted: false,
    });

    pc.onicecandidate?.({ candidate: { toJSON: () => ({ candidate: "ice-1" }) } });
    expect(socket.emit).toHaveBeenCalledWith("iceCandidate", {
      callId: "call-1",
      targetUserId: "user-2",
      candidate: { candidate: "ice-1" },
    });

    const remoteStream = createAudioStream().stream;
    pc.ontrack?.({ streams: [remoteStream] });
    expect(useCallStore.getState().remoteStream).toBe(remoteStream);

    pc.connectionState = "connected";
    pc.onconnectionstatechange?.();
    expect(useCallStore.getState().status).toBe("connected");
    expect(useCallStore.getState().callStartedAt).toBeInstanceOf(Date);

    useCallStore.getState().toggleMute();
    expect(track.enabled).toBe(false);
    expect(useCallStore.getState().isMuted).toBe(true);
    useCallStore.getState().toggleMute();
    expect(track.enabled).toBe(true);
  });

  it("handles, declines, and rejects competing incoming offers", () => {
    const socket = createMockSocket();
    socketManagerMocks.getSocket.mockReturnValue(socket);
    const offer = {
      callId: "call-incoming",
      callerId: "user-2",
      callerName: "Sophea",
      callerAvatar: "/avatar.png",
      offer: { type: "offer" as const, sdp: "offer-sdp" },
    };

    useCallStore.getState()._handleOffer(offer);
    expect(webRtcMocks.setPendingOffer).toHaveBeenCalledWith(offer.offer);
    expect(useCallStore.getState()).toMatchObject({
      status: "ringing",
      callId: "call-incoming",
      caller: { userId: "user-2", name: "Sophea", avatar: "/avatar.png" },
    });

    useCallStore.getState().declineCall();
    expect(socket.emit).toHaveBeenCalledWith("callDecline", {
      callId: "call-incoming",
      callerId: "user-2",
    });
    expect(useCallStore.getState()).toMatchObject({ status: "idle", callId: null, caller: null });

    useCallStore.setState({ status: "calling" });
    useCallStore.getState()._handleOffer({ ...offer, callId: "call-busy" });
    expect(socket.emit).toHaveBeenCalledWith("callDecline", {
      callId: "call-busy",
      callerId: "user-2",
    });
  });

  it("answers a pending incoming call", async () => {
    const socket = createMockSocket();
    const pc = createPeerConnection();
    const { stream } = createAudioStream();
    const pendingOffer = { type: "offer" as const, sdp: "offer-sdp" };
    socketManagerMocks.getSocket.mockReturnValue(socket);
    webRtcMocks.getPendingOffer.mockReturnValue(pendingOffer);
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: vi.fn().mockResolvedValue(stream) },
    });
    vi.stubGlobal("RTCPeerConnection", function MockRTCPeerConnection() {
      return pc;
    });
    useCallStore.setState({
      status: "ringing",
      callId: "call-1",
      caller: { userId: "user-2", name: "Sophea", avatar: "/avatar.png" },
    });

    await useCallStore.getState().answerCall();

    expect(pc.setRemoteDescription).toHaveBeenCalledWith(pendingOffer);
    expect(webRtcMocks.flushPendingIceCandidates).toHaveBeenCalled();
    expect(socket.emit).toHaveBeenCalledWith("callAnswer", {
      callId: "call-1",
      callerId: "user-2",
      answer: { type: "answer", sdp: "answer-sdp" },
    });
    expect(useCallStore.getState()).toMatchObject({
      status: "connecting",
      localStream: stream,
      isMuted: false,
    });
    expect(webRtcMocks.armConnectTimeout).toHaveBeenCalledTimes(1);
  });

  it("applies answers and either queues or adds remote ICE candidates", async () => {
    const pc = createPeerConnection();
    webRtcMocks.getPc.mockReturnValue(pc);
    useCallStore.setState({ status: "calling", callId: "call-1" });

    await useCallStore.getState()._handleAnswer({
      callId: "call-1",
      answer: { type: "answer", sdp: "answer-sdp" },
    });
    expect(pc.setRemoteDescription).toHaveBeenCalled();
    expect(useCallStore.getState().status).toBe("connecting");

    pc.remoteDescription = null;
    await useCallStore.getState()._handleIceCandidate({
      callId: "call-1",
      candidate: { candidate: "queued-ice" },
    });
    expect(webRtcMocks.addPendingIceCandidate).toHaveBeenCalledWith({ candidate: "queued-ice" });

    pc.remoteDescription = { type: "answer", sdp: "answer-sdp" };
    vi.stubGlobal("RTCIceCandidate", function MockRTCIceCandidate(
      candidate: RTCIceCandidateInit,
    ) {
      return candidate;
    });
    await useCallStore.getState()._handleIceCandidate({
      callId: "call-1",
      candidate: { candidate: "live-ice" },
    });
    expect(pc.addIceCandidate).toHaveBeenCalledWith({ candidate: "live-ice" });
  });

  it("ends a call, emits the reason, and returns to idle after dismissal", () => {
    vi.useFakeTimers();
    const socket = createMockSocket();
    socketManagerMocks.getSocket.mockReturnValue(socket);
    useCallStore.setState({
      status: "connected",
      callId: "call-1",
      callee: { userId: "user-2", name: "Sophea", avatar: "/avatar.png" },
      localStream: createAudioStream().stream,
      remoteStream: createAudioStream().stream,
      isMuted: true,
    });

    useCallStore.getState().endCall("ended");

    expect(socket.emit).toHaveBeenCalledWith("callEnd", {
      callId: "call-1",
      targetUserId: "user-2",
      reason: "ended",
    });
    expect(useCallStore.getState()).toMatchObject({ status: "ended", localStream: null, remoteStream: null });
    vi.advanceTimersByTime(2_000);
    expect(useCallStore.getState()).toMatchObject({
      status: "idle",
      callId: null,
      caller: null,
      callee: null,
      callStartedAt: null,
      isMuted: false,
    });
  });
});
