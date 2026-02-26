import { initializeApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";

// Log all environment variables (for debugging)
console.log("🔍 All VITE_ environment variables:");
Object.keys(import.meta.env)
  .filter((key) => key.startsWith("VITE_"))
  .forEach((key) => {
    console.log(`  ${key}:`, import.meta.env[key] ? "✅ Set" : "❌ Missing");
  });

// TEMPORARY: Hardcoded config as fallback (REMOVE IN PRODUCTION!)
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyBQaS4VS2Sl9F5Dz77oAHPTWCQvkNsDTPI",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "rawae-cosmatics.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rawae-cosmatics",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "rawae-cosmatics.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "991631205104",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:991631205104:web:3836fd6ce6c4fb9f395835",
};

console.log("🔧 Firebase Config:");
console.log("  API Key:", firebaseConfig.apiKey ? "✅ Set" : "❌ Missing");
console.log("  Project ID:", firebaseConfig.projectId || "❌ Missing");
console.log("  Auth Domain:", firebaseConfig.authDomain || "❌ Missing");

if (import.meta.env.VITE_FIREBASE_API_KEY) {
  console.log("✅ Using environment variables");
} else {
  console.warn("⚠️ WARNING: Using hardcoded Firebase config (temporary)");
}

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
  experimentalAutoDetectLongPolling: true,
});

console.log("✅ Firebase initialized successfully");
