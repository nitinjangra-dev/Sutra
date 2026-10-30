import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import '../../models/shloka_model.dart';
import '../../services/storage_service.dart';
import '../../theme/app_theme.dart';

class StoryCreatorScreen extends StatefulWidget {
  final ShlokaModel shloka;
  const StoryCreatorScreen({super.key, required this.shloka});

  @override
  State<StoryCreatorScreen> createState() => _StoryCreatorScreenState();
}

class _StoryCreatorScreenState extends State<StoryCreatorScreen> {
  final GlobalKey _canvasKey = GlobalKey();
  double _dimming = 0.55;
  bool _isExporting = false;

  Future<void> _shareStoryImage() async {
    setState(() => _isExporting = true);
    try {
      // 1. Capture RepaintBoundary as high-res 3x image
      final boundary = _canvasKey.currentContext?.findRenderObject() as RenderRepaintBoundary?;
      if (boundary == null) {
        throw Exception('Canvas not ready for rendering');
      }

      final ui.Image image = await boundary.toImage(pixelRatio: 3.0);
      final ByteData? byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      if (byteData == null) {
        throw Exception('Failed to encode image');
      }

      final Uint8List pngBytes = byteData.buffer.asUint8List();

      // 2. Save temporarily to cache directory
      final tempDir = await getTemporaryDirectory();
      final file = File('${tempDir.path}/sutra_story_${DateTime.now().millisecondsSinceEpoch}.png');
      await file.writeAsBytes(pngBytes);

      // 3. Share image file directly to WhatsApp Status / Instagram / Facebook
      final shareText = '''
${widget.shloka.sanskrit != null && widget.shloka.sanskrit!.isNotEmpty ? '"${widget.shloka.sanskrit}"\n\n' : ''}${widget.shloka.hindiMeaning}

— ${widget.shloka.source} (${widget.shloka.section})
✨ Shared via Sutra: Lockscreen Wisdom
''';

      // ignore: deprecated_member_use
      await Share.shareXFiles(
        [XFile(file.path)],
        text: shareText,
        subject: 'Sutra Wisdom Status',
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: AppTheme.surface,
            content: Text('Error generating story: $e', style: const TextStyle(color: Colors.red)),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isExporting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final settings = StorageService.instance.settings;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: Text(
          'Story & Status Creator',
          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
          child: Column(
            children: [
              // 9:16 Story Canvas Preview wrapped in RepaintBoundary for image capture
              Expanded(
                child: RepaintBoundary(
                  key: _canvasKey,
                  child: Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppTheme.border),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.5),
                          blurRadius: 20,
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(20),
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          // Background Wallpaper
                          CachedNetworkImage(
                            imageUrl: settings.selectedWallpaperUrl,
                            fit: BoxFit.cover,
                          ),

                          // Dimming Overlay
                          Container(color: Colors.black.withValues(alpha: _dimming)),

                          // Card Content
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 36.0),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                // Top Brand Header
                                Text(
                                  widget.shloka.source.toUpperCase(),
                                  style: GoogleFonts.poppins(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    letterSpacing: 3.0,
                                    color: AppTheme.gold,
                                  ),
                                ),

                                // Main Shloka & Hindi Meaning
                                Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    if (widget.shloka.sanskrit != null &&
                                        widget.shloka.sanskrit!.isNotEmpty) ...[
                                      Text(
                                        widget.shloka.sanskrit!,
                                        textAlign: TextAlign.center,
                                        style: GoogleFonts.rozhaOne(
                                          fontSize: 18,
                                          height: 1.6,
                                          color: AppTheme.gold,
                                        ),
                                      ),
                                      const SizedBox(height: 16),
                                    ],
                                    Text(
                                      widget.shloka.hindiMeaning,
                                      textAlign: TextAlign.center,
                                      style: GoogleFonts.notoSansDevanagari(
                                        fontSize: 16,
                                        height: 1.6,
                                        color: AppTheme.textPrimary,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    Text(
                                      '${widget.shloka.section} • ${widget.shloka.author}',
                                      style: GoogleFonts.poppins(
                                        fontSize: 11,
                                        color: AppTheme.textMuted,
                                      ),
                                    ),
                                  ],
                                ),

                                // Bottom Subtle Watermark (Viral Badge)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: Colors.black.withValues(alpha: 0.4),
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                                  ),
                                  child: Text(
                                    'Created with Sutra',
                                    style: GoogleFonts.poppins(
                                      fontSize: 10,
                                      color: Colors.white.withValues(alpha: 0.7),
                                      letterSpacing: 1.0,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Dimming Slider
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Background Dimming', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.textSecondary)),
                  Text('${(_dimming * 100).toInt()}%', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.gold)),
                ],
              ),
              Slider(
                value: _dimming,
                min: 0.2,
                max: 0.85,
                activeColor: AppTheme.gold,
                inactiveColor: AppTheme.surfaceElevated,
                onChanged: (val) => setState(() => _dimming = val),
              ),

              const SizedBox(height: 12),

              // Action Buttons
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _isExporting ? null : _shareStoryImage,
                      icon: _isExporting
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                            )
                          : const Icon(Icons.share, size: 18),
                      label: Text(
                        _isExporting ? 'Generating Image...' : 'Share to WhatsApp Status & Stories',
                        style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF25D366),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }
}
