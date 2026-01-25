interface SignInResponse {
  userId: string;
  message?: string;
}

interface SignUpResponse {
  userId: string;
  message?: string;
}

export const authService = {
  async signIn(email: string, password: string): Promise<{ success: boolean; data?: SignInResponse; message?: string }> {
    try {
      const response = await fetch("/api/auth/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, message: result.message || "An error occurred." };
      }
    } catch (error) {
      console.error("Error signing in:", error);
      return { success: false, message: "Failed to connect to the server." };
    }
  },

  async signUp(username: string, email: string, password: string): Promise<{ success: boolean; data?: SignUpResponse; message?: string }> {
    try {
      const response = await fetch("/api/auth/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, message: result.message || "An error occurred." };
      }
    } catch (error) {
      console.error("Error signing up:", error);
      return { success: false, message: "An error occurred while signing up." };
    }
  },
};
