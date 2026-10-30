import 'dart:ui' as ui;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import '../models/shloka_model.dart';

class WallpaperService {
  static const MethodChannel _channel = MethodChannel('com.dailyslok.sutra/wallpaper');

  /// Applies the rendered wallpaper directly to the Android Lock Screen
  static Future<bool> applyLockscreenWallpaper({
    required ShlokaModel shloka,
    required String wallpaperUrl,
    String location = 'lock', // 'lock' | 'home' | 'both'
  }) async {
    try {
      // 1. Fetch raw wallpaper bytes
      final response = await http.get(Uri.parse(wallpaperUrl)).timeout(const Duration(seconds: 10));
      if (response.statusCode != 200) {
        throw Exception('Failed to download wallpaper image');
      }
      final Uint8List baseImageBytes = response.bodyBytes;

      // 2. Composite shloka text onto the image
      final Uint8List compositedBytes = await _compositeTextOnImage(
        baseImageBytes: baseImageBytes,
        shloka: shloka,
      );

      // 3. Send to native Android WallpaperManager via MethodChannel
      final bool? success = await _channel.invokeMethod<bool>('setWallpaper', {
        'imageBytes': compositedBytes,
        'location': location,
      });

      return success ?? false;
    } catch (e) {
      debugPrint('WallpaperService Error: $e');
      rethrow;
    }
  }

  /// In-memory canvas rendering: draws Hindi shloka text over background
  static Future<Uint8List> _compositeTextOnImage({
    required Uint8List baseImageBytes,
    required ShlokaModel shloka,
  }) async {
    final ui.Codec codec = await ui.instantiateImageCodec(baseImageBytes);
    final ui.FrameInfo frameInfo = await codec.getNextFrame();
    final ui.Image image = frameInfo.image;

    final double width = image.width.toDouble();
    final double height = image.height.toDouble();

    final ui.PictureRecorder recorder = ui.PictureRecorder();
    final Canvas canvas = Canvas(recorder, Rect.fromLTWH(0, 0, width, height));

    // Draw base image
    canvas.drawImage(image, Offset.zero, Paint());

    // Draw dark dimming overlay (50% black) for text contrast
    final Paint dimPaint = Paint()..color = Colors.black.withValues(alpha: 0.55);
    canvas.drawRect(Rect.fromLTWH(0, 0, width, height), dimPaint);

    // Draw Shloka Hindi text in center
    final ui.ParagraphBuilder builder = ui.ParagraphBuilder(
      ui.ParagraphStyle(
        textAlign: TextAlign.center,
        fontSize: width * 0.052,
        height: 1.6,
      ),
    )
      ..pushStyle(ui.TextStyle(
        color: const Color(0xFFF5F5F7),
        fontWeight: FontWeight.w600,
      ))
      ..addText(shloka.hindiMeaning)
      ..addText('\n\n')
      ..pushStyle(ui.TextStyle(
        color: const Color(0xFFE6C794),
        fontSize: width * 0.038,
        fontWeight: FontWeight.w400,
      ))
      ..addText('— ${shloka.source} (${shloka.section})');

    final ui.Paragraph paragraph = builder.build()
      ..layout(ui.ParagraphConstraints(width: width * 0.85));

    final double xOffset = width * 0.075;
    final double yOffset = (height - paragraph.height) / 2.0;

    canvas.drawParagraph(paragraph, Offset(xOffset, yOffset));

    final ui.Picture picture = recorder.endRecording();
    final ui.Image finalImage = await picture.toImage(width.toInt(), height.toInt());
    final ByteData? byteData = await finalImage.toByteData(format: ui.ImageByteFormat.png);

    if (byteData == null) {
      throw Exception('Failed to encode composited image');
    }

    return byteData.buffer.asUint8List();
  }
}
