import { initializeApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";

// Log all environment variables (for debugging)
console.log("🔍 All VITE_ environment variables:");
Object.keys(import.meta.env)
  .filter((key) => key.startsWith("VITE_"))
  .forEach((key) => {
    console.log(`  ${key}:`, import.meta.env[key] ? "✅ Set" : "❌ Missing");
  });

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log("🔧 Firebase Config:");
console.log("  API Key:", firebaseConfig.apiKey ? "✅ Set" : "❌ Missing");
console.log("  Project ID:", firebaseConfig.projectId || "❌ Missing");
console.log("  Auth Domain:", firebaseConfig.authDomain || "❌ Missing");

// Throw error if critical config is missing
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  const error = new Error(
    "❌ CRITICAL: Firebase configuration is incomplete!\n\n" +
      "Missing variables:\n" +
      (!firebaseConfig.apiKey ? "- VITE_FIREBASE_API_KEY\n" : "") +
      (!firebaseConfig.projectId ? "- VITE_FIREBASE_PROJECT_ID\n" : "") +
      "\nMake sure environment variables are set in Vercel:\n" +
      "Settings → Environment Variables",
  );
  console.error(error);
  throw error;
}

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
  experimentalAutoDetectLongPolling: true,
});

console.log("✅ Firebase initialized successfully");
