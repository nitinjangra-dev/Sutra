import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:isar/isar.dart';
import 'package:path_provider/path_provider.dart';
import '../models/isar_shloka.dart';
import '../models/shloka_model.dart';

class IsarStorageService {
  static final IsarStorageService instance = IsarStorageService._internal();
  IsarStorageService._internal();

  late Isar _isar;
  bool _initialized = false;

  Future<void> init() async {
    if (_initialized) return;

    final dir = await getApplicationDocumentsDirectory();
    _isar = await Isar.open(
      [IsarShlokaSchema],
      directory: dir.path,
      name: 'sutra_wisdom_isar',
    );

    _initialized = true;
    debugPrint('Isar Database initialized at ${dir.path}');

    // Seed on first run if database is empty
    final count = await _isar.isarShlokas.count();
    if (count == 0) {
      await _seedInitialData();
    }
  }

  Future<void> _seedInitialData() async {
    try {
      final jsonString = await rootBundle.loadString('assets/data/seed_shlokas.json');
      final List<dynamic> list = jsonDecode(jsonString);
      final List<IsarShloka> isarItems = list.map((e) {
        final item = IsarShloka()
          ..shlokaId = e['id'] ?? ''
          ..source = e['source'] ?? ''
          ..section = e['section'] ?? ''
          ..sanskrit = e['sanskrit']
          ..hindiMeaning = e['hindi_meaning'] ?? ''
          ..author = e['author'] ?? ''
          ..category = e['category'] ?? 'scripture'
          ..moodTags = (e['mood_tags'] as List<dynamic>?)?.map((t) => t.toString()).toList() ?? []
          ..isViral = e['is_viral'] ?? false
          ..likesCount = e['likes_count'] ?? 0;
        return item;
      }).toList();

      await _isar.writeTxn(() async {
        await _isar.isarShlokas.putAll(isarItems);
      });
      debugPrint('Seeded ${isarItems.length} sacred verses into Isar local database.');
    } catch (e) {
      debugPrint('Error seeding Isar database: $e');
    }
  }

  Future<List<ShlokaModel>> getAllShlokas() async {
    final list = await _isar.isarShlokas.where().findAll();
    return list.map((e) => _toModel(e)).toList();
  }

  Future<List<ShlokaModel>> getShlokasByMood(String mood) async {
    if (mood == 'all') return getAllShlokas();
    final list = await _isar.isarShlokas
        .filter()
        .moodTagsElementEqualTo(mood)
        .findAll();

    if (list.isEmpty) {
      return getAllShlokas();
    }
    return list.map((e) => _toModel(e)).toList();
  }

  Future<void> saveShlokas(List<ShlokaModel> shlokas) async {
    final isarItems = shlokas.map((s) {
      return IsarShloka()
        ..shlokaId = s.id
        ..source = s.source
        ..section = s.section
        ..sanskrit = s.sanskrit
        ..hindiMeaning = s.hindiMeaning
        ..author = s.author
        ..category = s.category
        ..moodTags = s.moodTags
        ..isViral = s.isViral
        ..likesCount = s.likesCount;
    }).toList();

    await _isar.writeTxn(() async {
      await _isar.isarShlokas.clear();
      await _isar.isarShlokas.putAll(isarItems);
    });
    debugPrint('Saved ${isarItems.length} shlokas to Isar DB.');
  }

  ShlokaModel _toModel(IsarShloka e) {
    return ShlokaModel(
      id: e.shlokaId,
      source: e.source,
      section: e.section,
      sanskrit: e.sanskrit,
      hindiMeaning: e.hindiMeaning,
      author: e.author,
      category: e.category,
      moodTags: e.moodTags,
      isViral: e.isViral,
      likesCount: e.likesCount,
    );
  }
}
