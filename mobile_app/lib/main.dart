import 'package:flutter/material.dart';
import 'services/storage_service.dart';
import 'services/isar_storage_service.dart';
import 'services/firebase_service.dart';
import 'theme/app_theme.dart';
import 'screens/auth/welcome_screen.dart';
import 'screens/home/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 1. Initialize Local Storage (Settings & Isar DB)
  await StorageService.instance.init();
  await IsarStorageService.instance.init();

  // 2. Initialize Firebase (Cloud Firestore & Auth)
  await FirebaseService.instance.init();

  runApp(const SutraApp());
}

class SutraApp extends StatelessWidget {
  const SutraApp({super.key});

  @override
  Widget build(BuildContext context) {
    final bool isOnboardingComplete =
        StorageService.instance.settings.isOnboardingComplete;

    return MaterialApp(
      title: 'Sutra: Lockscreen Wisdom',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: isOnboardingComplete ? const HomeScreen() : const WelcomeScreen(),
    );
  }
}
