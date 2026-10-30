import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../models/shloka_model.dart';
import '../../services/storage_service.dart';
import '../../services/wallpaper_service.dart';
import '../../services/notification_service.dart';
import '../../theme/app_theme.dart';
import '../studio/widget_studio_screen.dart';
import '../story/story_creator_screen.dart';
import '../settings/settings_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late List<ShlokaModel> _shlokas;
  int _currentIndex = 0;
  String _selectedSource = 'All Sources';
  bool _isSettingWallpaper = false;

  final List<String> _sources = [
    'All Sources',
    'Bhagavad Gita',
    'Hanuman Chalisa',
    'Ramcharitmanas',
    'Modern Reflections'
  ];

  final List<Map<String, String>> _moods = [
    {'id': 'demotivated', 'name': 'Demotivated', 'icon': '⚡'},
    {'id': 'alone', 'name': 'Feeling Alone', 'icon': '💔'},
    {'id': 'anxious', 'name': 'Stress & Anxiety', 'icon': '🌊'},
    {'id': 'seek_peace', 'name': 'Seeking Peace', 'icon': '🕊️'},
    {'id': 'need_focus', 'name': 'Need Focus', 'icon': '🎯'},
    {'id': 'facing_loss', 'name': 'Facing Loss', 'icon': '🔥'},
  ];

  @override
  void initState() {
    super.initState();
    _loadShlokas();
  }

  void _loadShlokas() {
    final activeMood = StorageService.instance.settings.activeMood;
    var list = StorageService.instance.getShlokasByMood(activeMood);
    if (_selectedSource != 'All Sources') {
      list = list.where((s) => s.source == _selectedSource).toList();
    }
    setState(() {
      _shlokas = list.isNotEmpty ? list : StorageService.instance.getAllShlokas();
      _currentIndex = 0;
    });
  }

  void _nextQuote() {
    setState(() {
      _currentIndex = (_currentIndex + 1) % _shlokas.length;
    });
  }

  void _showMoodBottomSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'How are you feeling right now?',
                style: GoogleFonts.rozhaOne(
                  fontSize: 18,
                  color: AppTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 8,
                runSpacing: 10,
                children: _moods.map((m) {
                  final isCurrent =
                      StorageService.instance.settings.activeMood == m['id'];
                  return ChoiceChip(
                    label: Text('${m['icon']} ${m['name']}'),
                    selected: isCurrent,
                    selectedColor: AppTheme.gold,
                    backgroundColor: AppTheme.background,
                    labelStyle: GoogleFonts.poppins(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: isCurrent ? const Color(0xFF0D0F12) : AppTheme.textPrimary,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(
                        color: isCurrent ? AppTheme.gold : AppTheme.border,
                      ),
                    ),
                    onSelected: (selected) {
                      if (selected) {
                        StorageService.instance.updateActiveMood(m['id']!);
                        Navigator.pop(context);
                        _loadShlokas();
                      }
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final settings = StorageService.instance.settings;
    final currentShloka =
        _shlokas.isNotEmpty ? _shlokas[_currentIndex] : null;

    final activeMoodObj = _moods.firstWhere(
      (m) => m['id'] == settings.activeMood,
      orElse: () => {'id': 'demotivated', 'name': 'Demotivated', 'icon': '⚡'},
    );

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Mood Selector Pill
                  GestureDetector(
                    onTap: _showMoodBottomSheet,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                      decoration: BoxDecoration(
                        color: AppTheme.surface,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.4)),
                      ),
                      child: Row(
                        children: [
                          Text(activeMoodObj['icon']!, style: const TextStyle(fontSize: 14)),
                          const SizedBox(width: 6),
                          Text(
                            activeMoodObj['name']!,
                            style: GoogleFonts.poppins(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.gold,
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(Icons.keyboard_arrow_down, size: 16, color: AppTheme.gold),
                        ],
                      ),
                    ),
                  ),

                  // Settings Icon
                  IconButton(
                    icon: const Icon(Icons.settings_outlined, color: AppTheme.textSecondary),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const SettingsScreen()),
                      ).then((_) => setState(() {}));
                    },
                  ),
                ],
              ),
            ),

            // Horizontal Source Filter Pills
            SizedBox(
              height: 38,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: _sources.length,
                separatorBuilder: (context, index) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final source = _sources[index];
                  final isSelected = _selectedSource == source;
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedSource = source;
                        _loadShlokas();
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? AppTheme.gold : AppTheme.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected ? AppTheme.gold : AppTheme.border,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          source,
                          style: GoogleFonts.poppins(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: isSelected ? const Color(0xFF0D0F12) : AppTheme.textSecondary,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 16),

            // Hero Wisdom Card
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20.0),
                child: currentShloka == null
                    ? const Center(child: Text('No verses available'))
                    : ClipRRect(
                        borderRadius: BorderRadius.circular(settings.widgetBorderRadius),
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            // Wallpaper Background
                            CachedNetworkImage(
                              imageUrl: settings.selectedWallpaperUrl,
                              fit: BoxFit.cover,
                              placeholder: (context, url) => Container(color: AppTheme.surface),
                              errorWidget: (context, url, error) => Container(color: AppTheme.surface),
                            ),

                            // Dark Dimming Overlay
                            Container(
                              color: Colors.black.withValues(alpha: settings.widgetOpacity),
                            ),

                            // Shloka Card Content
                            Padding(
                              padding: const EdgeInsets.all(24.0),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  // Top Card Badge
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        currentShloka.source.toUpperCase(),
                                        style: GoogleFonts.poppins(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                          letterSpacing: 2.0,
                                          color: AppTheme.gold,
                                        ),
                                      ),
                                      Text(
                                        currentShloka.section,
                                        style: GoogleFonts.poppins(
                                          fontSize: 11,
                                          color: AppTheme.textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),

                                  // Core Verse & Meaning
                                  Column(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      // Sanskrit verse (if enabled in settings or requested)
                                      if (settings.showSanskrit &&
                                          currentShloka.sanskrit != null &&
                                          currentShloka.sanskrit!.isNotEmpty) ...[
                                        Text(
                                          currentShloka.sanskrit!,
                                          textAlign: TextAlign.center,
                                          style: GoogleFonts.rozhaOne(
                                            fontSize: settings.widgetFontSize + 1,
                                            height: 1.6,
                                            color: AppTheme.gold,
                                          ),
                                        ),
                                        const SizedBox(height: 14),
                                      ],

                                      // Hindi Meaning (Default)
                                      Text(
                                        currentShloka.hindiMeaning,
                                        textAlign: TextAlign.center,
                                        style: GoogleFonts.notoSansDevanagari(
                                          fontSize: settings.widgetFontSize,
                                          height: 1.65,
                                          color: Color(settings.widgetTextColor),
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ),

                                  // Author / Footer Attribution
                                  Text(
                                    currentShloka.author,
                                    style: GoogleFonts.poppins(
                                      fontSize: 11,
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
            ),

            const SizedBox(height: 16),

            // Quick Actions Row
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Row(
                children: [
                  // Next Quote
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _nextQuote,
                      icon: const Icon(Icons.refresh, size: 18, color: AppTheme.gold),
                      label: Text(
                        'New Quote',
                        style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600),
                      ),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.gold,
                        side: const BorderSide(color: AppTheme.border),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Customize Studio
                  IconButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const WidgetStudioScreen()),
                      ).then((_) => setState(() {}));
                    },
                    icon: const Icon(Icons.palette_outlined, color: AppTheme.textPrimary),
                    style: IconButton.styleFrom(
                      backgroundColor: AppTheme.surface,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                        side: const BorderSide(color: AppTheme.border),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Share Story
                  IconButton(
                    onPressed: () {
                      if (currentShloka != null) {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => StoryCreatorScreen(shloka: currentShloka),
                          ),
                        );
                      }
                    },
                    icon: const Icon(Icons.share_outlined, color: AppTheme.textPrimary),
                    style: IconButton.styleFrom(
                      backgroundColor: AppTheme.surface,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                        side: const BorderSide(color: AppTheme.border),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 12),

            // Primary Button: Set Lock Screen
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton.icon(
                  onPressed: _isSettingWallpaper || currentShloka == null
                      ? null
                      : () async {
                          setState(() => _isSettingWallpaper = true);
                          try {
                            // Apply to native Android Lockscreen
                            await WallpaperService.applyLockscreenWallpaper(
                              shloka: currentShloka,
                              wallpaperUrl: settings.selectedWallpaperUrl,
                              location: 'lock',
                            );

                            // Trigger notification confirmation
                            await NotificationService.instance.showMorningWisdomNotification(
                              shloka: currentShloka,
                            );

                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  backgroundColor: AppTheme.surface,
                                  content: Text(
                                    '✨ Lock Screen Wallpaper Updated & Morning Reminder Scheduled!',
                                    style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.gold),
                                  ),
                                ),
                              );
                            }
                          } catch (e) {
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  backgroundColor: AppTheme.surface,
                                  content: Text(
                                    'Wallpaper status: Simulated in preview ($e)',
                                    style: const TextStyle(fontSize: 11, color: Colors.amber),
                                  ),
                                ),
                              );
                            }
                          } finally {
                            if (mounted) setState(() => _isSettingWallpaper = false);
                          }
                        },
                  icon: _isSettingWallpaper
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF0D0F12)),
                        )
                      : const Icon(Icons.lock_outline, size: 18),
                  label: Text(
                    _isSettingWallpaper ? 'Applying to Lock Screen...' : 'Set as Lock Screen Wallpaper',
                    style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 12),

            // Bottom AdMob Container
            Container(
              height: 50,
              width: double.infinity,
              color: AppTheme.surface,
              alignment: Alignment.center,
              child: Text(
                'Google AdMob Banner (320x50)',
                style: GoogleFonts.poppins(
                  fontSize: 10,
                  color: AppTheme.textMuted,
                  letterSpacing: 1.0,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
