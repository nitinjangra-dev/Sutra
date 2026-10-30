import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/shloka_model.dart';
import '../models/user_settings_model.dart';

class StorageService {
  static final StorageService instance = StorageService._internal();
  StorageService._internal();

  late SharedPreferences _prefs;
  List<ShlokaModel> _cachedShlokas = [];
  late UserSettingsModel settings;

  static const String _keyShlokas = 'sutra_shlokas_cache';
  static const String _keySettings = 'sutra_user_settings';
  static const String _keyVersion = 'sutra_cached_version';

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();

    // 1. Load User Settings
    final settingsJson = _prefs.getString(_keySettings);
    if (settingsJson != null) {
      try {
        settings = UserSettingsModel.fromJson(jsonDecode(settingsJson));
      } catch (e) {
        settings = UserSettingsModel();
      }
    } else {
      settings = UserSettingsModel();
    }

    // 2. Load Shlokas from Cache or Asset Seed
    final shlokasRaw = _prefs.getString(_keyShlokas);
    if (shlokasRaw != null) {
      try {
        final List<dynamic> list = jsonDecode(shlokasRaw);
        _cachedShlokas = list.map((e) => ShlokaModel.fromJson(e)).toList();
      } catch (e) {
        await _loadFromAssetSeed();
      }
    } else {
      await _loadFromAssetSeed();
    }
  }

  Future<void> _loadFromAssetSeed() async {
    try {
      final jsonString = await rootBundle.loadString('assets/data/seed_shlokas.json');
      final List<dynamic> list = jsonDecode(jsonString);
      _cachedShlokas = list.map((e) => ShlokaModel.fromJson(e)).toList();
      await saveShlokas(_cachedShlokas);
    } catch (e) {
      debugPrint('Error loading asset seed: $e');
    }
  }

  List<ShlokaModel> getAllShlokas() => _cachedShlokas;

  List<ShlokaModel> getShlokasByMood(String mood) {
    if (mood == 'all') return _cachedShlokas;
    final matched = _cachedShlokas.where((s) => s.moodTags.contains(mood)).toList();
    return matched.isNotEmpty ? matched : _cachedShlokas;
  }

  Future<void> saveShlokas(List<ShlokaModel> shlokas) async {
    _cachedShlokas = shlokas;
    final jsonList = shlokas.map((e) => e.toJson()).toList();
    await _prefs.setString(_keyShlokas, jsonEncode(jsonList));
  }

  Future<void> saveSettings(UserSettingsModel newSettings) async {
    settings = newSettings;
    await _prefs.setString(_keySettings, jsonEncode(settings.toJson()));
  }

  Future<void> updateActiveMood(String newMood) async {
    settings.activeMood = newMood;
    await saveSettings(settings);
  }

  Future<void> completeOnboarding() async {
    settings.isOnboardingComplete = true;
    await saveSettings(settings);
  }

  String getCachedVersion() {
    return _prefs.getString(_keyVersion) ?? '1.0';
  }

  Future<void> setCachedVersion(String version) async {
    await _prefs.setString(_keyVersion, version);
  }
}
