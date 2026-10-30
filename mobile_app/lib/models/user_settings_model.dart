class UserSettingsModel {
  String activeMood;
  String wakeUpTime;
  bool showSanskrit;
  int refreshIntervalMinutes;
  double widgetFontSize;
  String widgetFontFamily;
  int widgetTextColor;
  double widgetOpacity;
  double widgetBorderRadius;
  double widgetBorderWidth;
  String selectedWallpaperUrl;
  bool isOnboardingComplete;

  UserSettingsModel({
    this.activeMood = 'demotivated',
    this.wakeUpTime = '06:00',
    this.showSanskrit = false,
    this.refreshIntervalMinutes = 30,
    this.widgetFontSize = 15.0,
    this.widgetFontFamily = 'NotoSans',
    this.widgetTextColor = 0xFFF5F5F7,
    this.widgetOpacity = 0.60,
    this.widgetBorderRadius = 16.0,
    this.widgetBorderWidth = 1.0,
    this.selectedWallpaperUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&q=80',
    this.isOnboardingComplete = false,
  });

  factory UserSettingsModel.fromJson(Map<String, dynamic> json) {
    return UserSettingsModel(
      activeMood: json['activeMood'] as String? ?? 'demotivated',
      wakeUpTime: json['wakeUpTime'] as String? ?? '06:00',
      showSanskrit: json['showSanskrit'] as bool? ?? false,
      refreshIntervalMinutes: json['refreshIntervalMinutes'] as int? ?? 30,
      widgetFontSize: (json['widgetFontSize'] as num?)?.toDouble() ?? 15.0,
      widgetFontFamily: json['widgetFontFamily'] as String? ?? 'NotoSans',
      widgetTextColor: json['widgetTextColor'] as int? ?? 0xFFF5F5F7,
      widgetOpacity: (json['widgetOpacity'] as num?)?.toDouble() ?? 0.60,
      widgetBorderRadius: (json['widgetBorderRadius'] as num?)?.toDouble() ?? 16.0,
      widgetBorderWidth: (json['widgetBorderWidth'] as num?)?.toDouble() ?? 1.0,
      selectedWallpaperUrl: json['selectedWallpaperUrl'] as String? ??
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&q=80',
      isOnboardingComplete: json['isOnboardingComplete'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'activeMood': activeMood,
      'wakeUpTime': wakeUpTime,
      'showSanskrit': showSanskrit,
      'refreshIntervalMinutes': refreshIntervalMinutes,
      'widgetFontSize': widgetFontSize,
      'widgetFontFamily': widgetFontFamily,
      'widgetTextColor': widgetTextColor,
      'widgetOpacity': widgetOpacity,
      'widgetBorderRadius': widgetBorderRadius,
      'widgetBorderWidth': widgetBorderWidth,
      'selectedWallpaperUrl': selectedWallpaperUrl,
      'isOnboardingComplete': isOnboardingComplete,
    };
  }
}
