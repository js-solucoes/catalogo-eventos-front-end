import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../AuthProvider";
import { useAuth } from "../useAuth";
import {
  clearAdminUser,
  loadAdminUser,
  saveAdminUser,
} from "../auth.storage";

vi.mock("../auth.storage", () => ({
  loadAdminUser: vi.fn(),
  saveAdminUser: vi.fn(),
  clearAdminUser: vi.fn(),
}));

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve iniciar deslogado quando não houver usuário salvo", () => {
    vi.mocked(loadAdminUser).mockReturnValue(null);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("deve iniciar logado quando houver usuário salvo", () => {
    vi.mocked(loadAdminUser).mockReturnValue({
      id: 1,
      name: "Admin",
      email: "admin@teste.com",
      token: "jwt-token",
      role: "admin"
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe("admin@teste.com");
  });

  it("deve efetuar login e persistir o usuário", async () => {
    vi.mocked(loadAdminUser).mockReturnValue(null);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login("admin@teste.com", "123456");
    });

    expect(saveAdminUser).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("deve efetuar logout e limpar storage", () => {
    vi.mocked(loadAdminUser).mockReturnValue({
      id: 1,
      name: "Admin",
      email: "admin@teste.com",
      token: "jwt-token",
      role: "admin"
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(clearAdminUser).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});