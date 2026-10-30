import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../services/storage_service.dart';
import '../../theme/app_theme.dart';

class WidgetStudioScreen extends StatefulWidget {
  const WidgetStudioScreen({super.key});

  @override
  State<WidgetStudioScreen> createState() => _WidgetStudioScreenState();
}

class _WidgetStudioScreenState extends State<WidgetStudioScreen> {
  late double _fontSize;
  late double _opacity;
  late double _radius;
  late int _textColor;
  late String _wallpaperUrl;

  final List<Map<String, String>> _wallpapers = [
    {
      'title': 'Misty Mountain',
      'url': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&q=80',
    },
    {
      'title': 'Obsidian Slate',
      'url': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1080&q=80',
    },
    {
      'title': 'Celestial Smoke',
      'url': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1080&q=80',
    },
    {
      'title': 'Silent Forest',
      'url': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1080&q=80',
    },
  ];

  @override
  void initState() {
    super.initState();
    final settings = StorageService.instance.settings;
    _fontSize = settings.widgetFontSize;
    _opacity = settings.widgetOpacity;
    _radius = settings.widgetBorderRadius;
    _textColor = settings.widgetTextColor;
    _wallpaperUrl = settings.selectedWallpaperUrl;
  }

  void _saveChanges() async {
    final settings = StorageService.instance.settings;
    settings.widgetFontSize = _fontSize;
    settings.widgetOpacity = _opacity;
    settings.widgetBorderRadius = _radius;
    settings.widgetTextColor = _textColor;
    settings.selectedWallpaperUrl = _wallpaperUrl;

    await StorageService.instance.saveSettings(settings);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: AppTheme.surface,
          content: Text(
            'Widget & Lock Screen styles saved!',
            style: GoogleFonts.poppins(color: AppTheme.gold, fontSize: 12),
          ),
        ),
      );
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: Text(
          'Lockscreen & Widget Studio',
          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Live Preview Card
            Container(
              height: 220,
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(_radius),
                border: Border.all(color: AppTheme.border),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(_radius),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    CachedNetworkImage(
                      imageUrl: _wallpaperUrl,
                      fit: BoxFit.cover,
                    ),
                    Container(color: Colors.black.withValues(alpha: _opacity)),
                    Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन...',
                            textAlign: TextAlign.center,
                            style: GoogleFonts.rozhaOne(
                              fontSize: _fontSize,
                              color: AppTheme.gold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'कर्म करने में ही तुम्हारा अधिकार है, उसके फलों में कभी नहीं।',
                            textAlign: TextAlign.center,
                            style: GoogleFonts.notoSansDevanagari(
                              fontSize: _fontSize - 1,
                              color: Color(_textColor),
                              height: 1.5,
                            ),
                          ),
                          const SizedBox(height: 10),
                          Text(
                            '— श्रीमद्भगवद्गीता (2.47)',
                            style: GoogleFonts.poppins(
                              fontSize: 10,
                              color: AppTheme.textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Wallpaper Selector
            Text(
              'CHOOSE WALLPAPER TEXTURE',
              style: GoogleFonts.poppins(
                fontSize: 11,
                letterSpacing: 1.5,
                fontWeight: FontWeight.w600,
                color: AppTheme.gold,
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              height: 75,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _wallpapers.length,
                separatorBuilder: (context, index) => const SizedBox(width: 10),
                itemBuilder: (context, index) {
                  final wp = _wallpapers[index];
                  final isSelected = _wallpaperUrl == wp['url'];

                  return GestureDetector(
                    onTap: () => setState(() => _wallpaperUrl = wp['url']!),
                    child: Container(
                      width: 75,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected ? AppTheme.gold : AppTheme.border,
                          width: isSelected ? 2 : 1,
                        ),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: CachedNetworkImage(
                          imageUrl: wp['url']!,
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 24),

            // Sliders Section
            Text(
              'TYPOGRAPHY & OPACITY SLIDERS',
              style: GoogleFonts.poppins(
                fontSize: 11,
                letterSpacing: 1.5,
                fontWeight: FontWeight.w600,
                color: AppTheme.gold,
              ),
            ),
            const SizedBox(height: 14),

            // Font Size Slider
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Font Size', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.textSecondary)),
                Text('${_fontSize.toInt()} sp', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.gold)),
              ],
            ),
            Slider(
              value: _fontSize,
              min: 12.0,
              max: 22.0,
              activeColor: AppTheme.gold,
              inactiveColor: AppTheme.surfaceElevated,
              onChanged: (val) => setState(() => _fontSize = val),
            ),

            // Opacity Slider
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Dimming / Opacity', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.textSecondary)),
                Text('${(_opacity * 100).toInt()}%', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.gold)),
              ],
            ),
            Slider(
              value: _opacity,
              min: 0.1,
              max: 0.9,
              activeColor: AppTheme.gold,
              inactiveColor: AppTheme.surfaceElevated,
              onChanged: (val) => setState(() => _opacity = val),
            ),

            // Corner Radius Slider
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Corner Radius', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.textSecondary)),
                Text('${_radius.toInt()} dp', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.gold)),
              ],
            ),
            Slider(
              value: _radius,
              min: 0.0,
              max: 32.0,
              activeColor: AppTheme.gold,
              inactiveColor: AppTheme.surfaceElevated,
              onChanged: (val) => setState(() => _radius = val),
            ),

            const SizedBox(height: 20),

            // Save Styles Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _saveChanges,
                child: Text(
                  'Apply & Save Styles',
                  style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600),
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
