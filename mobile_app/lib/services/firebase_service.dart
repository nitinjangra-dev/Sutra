import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import '../models/shloka_model.dart';
import 'storage_service.dart';
import 'isar_storage_service.dart';

class FirebaseService {
  static final FirebaseService instance = FirebaseService._internal();
  FirebaseService._internal();

  bool _initialized = false;

  Future<void> init() async {
    try {
      await Firebase.initializeApp(
        options: const FirebaseOptions(
          apiKey: "AIzaSyBYzpGpq3sqwCrV4wl9MJ0Hjt5xebQ4kRE",
          authDomain: "daily-slok.firebaseapp.com",
          projectId: "daily-slok",
          storageBucket: "daily-slok.firebasestorage.app",
          messagingSenderId: "417216826909",
          appId: "1:417216826909:android:9074543c4c70d34e6840f4",
        ),
      );
      _initialized = true;
      debugPrint('Firebase initialized with daily-slok');
    } catch (e) {
      debugPrint('Firebase initialization fallback (offline mode): $e');
    }
  }

  /// Checks cloud version and performs the zero-cost update if needed
  Future<void> syncMoodPackIfNewer(String activeMood) async {
    if (!_initialized) return;

    try {
      final firestore = FirebaseFirestore.instance;
      
      // 1. Read metadata version (1 single read)
      final versionDoc = await firestore.collection('system_metadata').doc('versions').get();
      if (!versionDoc.exists) return;

      final data = versionDoc.data();
      if (data == null) return;

      final cloudVersion = data['${activeMood}_version']?.toString() ?? '1.0';
      final localVersion = StorageService.instance.getCachedVersion();

      if (cloudVersion != localVersion) {
        // 2. Fetch the packed mood bundle (1 read = 100 Shlokas)
        final packDoc = await firestore.collection('mood_packs').doc(activeMood).get();
        if (packDoc.exists && packDoc.data() != null) {
          final packData = packDoc.data()!;
          final List<dynamic>? rawShlokas = packData['shlokas'] as List<dynamic>?;
          
          if (rawShlokas != null && rawShlokas.isNotEmpty) {
            final List<ShlokaModel> newShlokas = rawShlokas
                .map((e) => ShlokaModel.fromJson(Map<String, dynamic>.from(e as Map)))
                .toList();

            // Save to local storage (both memory cache and Isar DB)
            await StorageService.instance.saveShlokas(newShlokas);
            await IsarStorageService.instance.saveShlokas(newShlokas);
            await StorageService.instance.setCachedVersion(cloudVersion);
            debugPrint('Successfully synced $activeMood pack v$cloudVersion with 1 read!');
          }
        }
      }
    } catch (e) {
      debugPrint('Cloud sync deferred: $e');
    }
  }
}
