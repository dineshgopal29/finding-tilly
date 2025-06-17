// Mock Firebase implementation to prevent errors
// This will be replaced with actual Firebase implementation when credentials are available

// Mock Firebase app
const app = {
  name: "[DEFAULT]",
  options: {},
};

// Mock Firestore
export const db = {
  collection: (name) => ({
    doc: (id) => ({
      get: async () => ({
        exists: false,
        data: () => null,
        id: id,
      }),
      set: async () => true,
      update: async () => true,
    }),
    add: async () => ({ id: "mock-id" }),
    where: () => ({
      orderBy: () => ({
        limit: () => ({
          get: async () => ({
            docs: [],
          }),
        }),
      }),
    }),
  }),
};

// Mock Auth
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    setTimeout(() => callback(null), 100);
    return () => {};
  },
  signInWithEmailAndPassword: async () => ({
    user: {
      uid: "mock-user-id",
      email: "user@example.com",
      displayName: "Mock User",
    },
  }),
  createUserWithEmailAndPassword: async () => ({
    user: {
      uid: "mock-user-id",
      email: "user@example.com",
      displayName: "Mock User",
    },
  }),
  signOut: async () => {},
};

// Mock Storage
export const storage = {
  ref: () => ({
    put: async () => {},
    getDownloadURL: async () => "https://example.com/image.jpg",
  }),
};

export default app;
