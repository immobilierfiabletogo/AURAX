import { redirect } from "next/navigation";
import { AuthRepository } from "@/lib/repositories/auth.repository";

export class AuthService {
  /**
   * Retourne l'utilisateur connecté ou null.
   */
  static async getCurrentUser() {
    return AuthRepository.getUser();
  }

  /**
   * Retourne la session active ou null.
   */
  static async getSession() {
    return AuthRepository.getSession();
  }

  /**
   * Exige qu'un utilisateur soit connecté.
   * Redirige vers /login sinon.
   */
  static async requireUser() {
    const user = await AuthRepository.getUser();

    if (!user) {
      redirect("/login");
    }

    return user;
  }

  /**
   * Exige que l'utilisateur soit administrateur.
   * Redirige vers /login ou / si nécessaire.
   */
  static async requireAdmin() {
    const user = await this.requireUser();

    const isAdmin = await AuthRepository.isAdmin(user.id);

    if (!isAdmin) {
      redirect("/");
    }

    return user;
  }

  /**
   * Déconnexion.
   */
  static async signOut() {
    return AuthRepository.signOut();
  }
}