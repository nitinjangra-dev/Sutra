import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import '../models/shloka_model.dart';

class NotificationService {
  static final NotificationService instance = NotificationService._internal();
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notificationsPlugin = FlutterLocalNotificationsPlugin();
  bool _initialized = false;

  Future<void> init() async {
    if (_initialized) return;

    const AndroidInitializationSettings androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const InitializationSettings initSettings = InitializationSettings(
      android: androidSettings,
    );

    await _notificationsPlugin.initialize(
      settings: initSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        debugPrint('Notification tapped: ${response.payload}');
      },
    );

    _initialized = true;
  }

  /// Sends the morning anchor wisdom notification
  Future<void> showMorningWisdomNotification({required ShlokaModel shloka}) async {
    await init();

    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'sutra_morning_wisdom',
      'Morning Sacred Wisdom',
      channelDescription: 'Daily spiritual guidance and morning reflections',
      importance: Importance.max,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
      color: Color(0xFFE6C794),
      styleInformation: BigTextStyleInformation(''),
    );

    const NotificationDetails platformDetails = NotificationDetails(
      android: androidDetails,
    );

    await _notificationsPlugin.show(
      id: 1001,
      title: '🌅 Sutra: ${shloka.source}',
      body: shloka.hindiMeaning,
      notificationDetails: platformDetails,
      payload: shloka.id,
    );
  }
}
