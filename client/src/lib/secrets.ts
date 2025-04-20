// Helper functions for asking and checking secrets

/**
 * Ask the user for the secrets needed for the application
 * @param secretKeys Array of secret key identifiers needed
 * @param userMessage Message to explain why these secrets are needed
 * @returns Promise that resolves when the user has provided the secrets
 */
export async function ask_secrets(
  secretKeys: string[],
  userMessage: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    fetch('/api/secrets/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret_keys: secretKeys,
        user_message: userMessage,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to ask for secrets');
        }
        resolve();
      })
      .catch((error) => {
        console.error('Error asking for secrets:', error);
        reject(error);
      });
  });
}

/**
 * Check if a set of secrets exists in the environment
 * @param secretKeys Array of secret key identifiers to check
 * @returns Promise that resolves to an object with boolean values for each secret
 */
export async function check_secrets(
  secretKeys: string[]
): Promise<Record<string, boolean>> {
  return fetch('/api/secrets/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret_keys: secretKeys,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to check secrets');
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error checking secrets:', error);
      throw error;
    });
}