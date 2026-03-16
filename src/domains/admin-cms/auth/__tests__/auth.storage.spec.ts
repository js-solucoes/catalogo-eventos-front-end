import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAdminUser,
  loadAdminUser,
  saveAdminUser,
} from "../auth.storage";
import { IAdminUser } from "../auth.types";

describe("auth.storage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("deve retornar null quando não houver usuário salvo", () => {
    expect(loadAdminUser()).toBeNull();
  });

  it("deve salvar e recuperar usuário autenticado", () => {
    const user: IAdminUser = {
      id: 1,
      name: "Admin",
      email: "admin@teste.com",
      role: "admin",
      token: "jwt-token",
    };

    saveAdminUser(user);

    expect(loadAdminUser()).toEqual(user);
  });

  it("deve limpar o usuário salvo", () => {
    const user: IAdminUser = {
      id: 1,
      name: "Admin",
      email: "admin@teste.com",
      role: "admin",
      token: "jwt-token",
    };

    saveAdminUser(user);
    clearAdminUser();

    expect(loadAdminUser()).toBeNull();
  });

  it("deve retornar null quando o JSON salvo estiver inválido", () => {
    localStorage.setItem("admin_auth_user", "{json-invalido");

    expect(loadAdminUser()).toBeNull();
  });
});