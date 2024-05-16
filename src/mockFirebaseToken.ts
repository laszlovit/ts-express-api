// Define the interface for the mock Firebase token
export interface MockFirebaseToken {
  uid: string;
  email: string;
  // Add any other relevant fields
}

// Function to generate a mock Firebase token
export function generateMockFirebaseToken(user: MockFirebaseToken): string {
  const header = {
    alg: 'RS256', // Algorithm used for signing (can be any valid algorithm)
    typ: 'JWT', // Type of token
  };

  const payload = {
    // Include the necessary fields like uid and email
    uid: user.uid,
    email: user.email,
    // Add other fields as needed
  };

  // Encode the header and payload into a base64 URL-safe string
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    'base64',
  );

  // Combine the encoded header and payload with a '.' separator
  const token = `${encodedHeader}.${encodedPayload}.mockSignature`; // Mock signature

  return token;
}
