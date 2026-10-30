import 'package:isar/isar.dart';

part 'isar_shloka.g.dart';

@collection
class IsarShloka {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String shlokaId;

  late String source;
  late String section;
  String? sanskrit;
  late String hindiMeaning;
  late String author;
  late String category;

  List<String> moodTags = [];
  bool isViral = false;
  int likesCount = 0;
}
