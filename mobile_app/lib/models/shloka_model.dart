class ShlokaModel {
  final String id;
  final String source;
  final String section;
  final String? sanskrit;
  final String hindiMeaning;
  final String author;
  final String category; // 'scripture' | 'viral_wisdom'
  final List<String> moodTags;
  final bool isViral;
  final int likesCount;

  ShlokaModel({
    required this.id,
    required this.source,
    required this.section,
    this.sanskrit,
    required this.hindiMeaning,
    required this.author,
    required this.category,
    required this.moodTags,
    this.isViral = false,
    this.likesCount = 0,
  });

  factory ShlokaModel.fromJson(Map<String, dynamic> json) {
    return ShlokaModel(
      id: json['id'] as String? ?? 'unknown',
      source: json['source'] as String? ?? 'Sacred Wisdom',
      section: json['section'] as String? ?? '',
      sanskrit: json['sanskrit'] as String?,
      hindiMeaning: json['hindi_meaning'] as String? ?? '',
      author: json['author'] as String? ?? '',
      category: json['category'] as String? ?? 'scripture',
      moodTags: (json['mood_tags'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      isViral: json['is_viral'] as bool? ?? false,
      likesCount: json['likes_count'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'source': source,
      'section': section,
      'sanskrit': sanskrit,
      'hindi_meaning': hindiMeaning,
      'author': author,
      'category': category,
      'mood_tags': moodTags,
      'is_viral': isViral,
      'likes_count': likesCount,
    };
  }
}
