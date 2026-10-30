import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { INITIAL_SHLOKAS, MOOD_CATEGORIES } from './src/data/seedShlokas.js';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyAAaM-aGwj-cHJyqMMn7_PQ6xrOju6BoI0",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "daily-slok.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "daily-slok",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "daily-slok.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "417216826909",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:417216826909:web:5ceae9aed85fc8426840f4",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-362FVRZST5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function main() {
  const email = process.argv[2] || process.env.VITE_OWNER_EMAIL || "nitinjangra.dev@gmail.com";
  const password = process.argv[3];

  if (!password) {
    console.log("Usage: node seed_firestore_cli.js <email> <password>");
    console.log("Example: node seed_firestore_cli.js nitinjangra.dev@gmail.com MyPassword123");
    console.log("\nAlternatively, you can just click the 'Seed All Sacred Verses to Firestore' button directly in the Web Admin Portal dashboard!");
    process.exit(1);
  }

  console.log(`\n🔐 Authenticating as owner: ${email}...`);
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    console.log(`✅ Authenticated UID: ${cred.user.uid}`);

    console.log(`\n📦 Seeding ${INITIAL_SHLOKAS.length} sacred verses into 'shlokas' collection...`);
    const batch = writeBatch(db);
    INITIAL_SHLOKAS.forEach((item) => {
      const docRef = doc(db, 'shlokas', item.id);
      batch.set(docRef, {
        ...item,
        created_at: new Date().toISOString()
      });
      console.log(`   + [${item.source}] ${item.section}`);
    });
    await batch.commit();
    console.log(`✅ 'shlokas' collection populated!`);

    console.log(`\n📦 Packing and compiling zero-read 'mood_packs' for mobile app...`);
    const bundles = {};
    const versionsMetadata = { last_updated_at: new Date().toISOString() };

    MOOD_CATEGORIES.forEach((mood) => {
      const filtered = INITIAL_SHLOKAS.filter((item) =>
        item.mood_tags && item.mood_tags.includes(mood.id)
      );

      bundles[mood.id] = {
        category_id: mood.id,
        display_title_hindi: mood.hindi,
        display_title_english: mood.name,
        version: '1.0',
        total_count: filtered.length,
        updated_at: new Date().toISOString(),
        shlokas: filtered
      };
      versionsMetadata[`${mood.id}_version`] = '1.0';
    });

    console.log(`   Writing 'system_metadata/versions'...`);
    await setDoc(doc(db, 'system_metadata', 'versions'), versionsMetadata);

    for (const [moodId, bundleData] of Object.entries(bundles)) {
      console.log(`   Writing 'mood_packs/${moodId}' (${bundleData.total_count} verses)...`);
      await setDoc(doc(db, 'mood_packs', moodId), bundleData);
    }

    console.log(`\n🎉 SUCCESS! All verses are now live in Cloud Firestore (daily-slok)!`);
    console.log(`   - 'shlokas' collection: ${INITIAL_SHLOKAS.length} documents`);
    console.log(`   - 'mood_packs' collection: ${Object.keys(bundles).length} mood packs`);
    console.log(`   - 'system_metadata' collection: versions doc configured`);
    console.log(`\nBoth your Web Admin Portal and Flutter Mobile App will now display this data automatically!\n`);
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ Error:`, err.message);
    process.exit(1);
  }
}

main();
