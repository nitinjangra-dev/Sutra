import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/storage_service.dart';
import '../../services/firebase_service.dart';
import '../../theme/app_theme.dart';
import '../home/home_screen.dart';

class CheckinScreen extends StatefulWidget {
  const CheckinScreen({super.key});

  @override
  State<CheckinScreen> createState() => _CheckinScreenState();
}

class _CheckinScreenState extends State<CheckinScreen> {
  String _selectedMood = 'demotivated';
  TimeOfDay _selectedWakeTime = const TimeOfDay(hour: 6, minute: 0);

  final List<Map<String, String>> _moods = [
    {'id': 'demotivated', 'name': 'Demotivated', 'hindi': 'हताश / निराश', 'icon': '⚡'},
    {'id': 'alone', 'name': 'Feeling Alone', 'hindi': 'अकेलापन', 'icon': '💔'},
    {'id': 'anxious', 'name': 'Stress & Anxiety', 'hindi': 'चिंता व तनाव', 'icon': '🌊'},
    {'id': 'seek_peace', 'name': 'Seeking Peace', 'hindi': 'शांति की खोज', 'icon': '🕊️'},
    {'id': 'need_focus', 'name': 'Need Focus', 'hindi': 'एकाग्रता / कर्म', 'icon': '🎯'},
    {'id': 'facing_loss', 'name': 'Facing Loss', 'hindi': 'संकट व असफलता', 'icon': '🔥'},
  ];

  Future<void> _pickTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: _selectedWakeTime,
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: const ColorScheme.dark(
              primary: AppTheme.gold,
              onPrimary: Color(0xFF0D0F12),
              surface: AppTheme.surface,
              onSurface: AppTheme.textPrimary,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() => _selectedWakeTime = picked);
    }
  }

  void _onComplete() async {
    final formattedTime =
        '${_selectedWakeTime.hour.toString().padLeft(2, '0')}:${_selectedWakeTime.minute.toString().padLeft(2, '0')}';

    final settings = StorageService.instance.settings;
    settings.activeMood = _selectedMood;
    settings.wakeUpTime = formattedTime;
    settings.isOnboardingComplete = true;

    await StorageService.instance.saveSettings(settings);

    // Trigger zero-cost background sync in background
    FirebaseService.instance.syncMoodPackIfNewer(_selectedMood);

    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const HomeScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Text(
                'STEP 1 OF 2',
                style: GoogleFonts.poppins(
                  fontSize: 11,
                  letterSpacing: 2.0,
                  color: AppTheme.gold,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'How is your heart feeling?',
                style: GoogleFonts.rozhaOne(
                  fontSize: 24,
                  color: AppTheme.textPrimary,
                ),
              ),
              Text(
                'Choose your focus to receive tailored wisdom.',
                style: GoogleFonts.poppins(
                  fontSize: 13,
                  color: AppTheme.textSecondary,
                ),
              ),
              const SizedBox(height: 24),

              // Mood Grid
              Expanded(
                child: GridView.builder(
                  itemCount: _moods.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 1.45,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemBuilder: (context, index) {
                    final mood = _moods[index];
                    final isSelected = _selectedMood == mood['id'];

                    return GestureDetector(
                      onTap: () => setState(() => _selectedMood = mood['id']!),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: isSelected ? AppTheme.surfaceElevated : AppTheme.surface,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(
                            color: isSelected ? AppTheme.gold : AppTheme.border,
                            width: isSelected ? 1.5 : 1.0,
                          ),
                          boxShadow: isSelected
                              ? [
                                  BoxShadow(
                                    color: AppTheme.gold.withValues(alpha: 0.12),
                                    blurRadius: 12,
                                  ),
                                ]
                              : [],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(mood['icon']!, style: const TextStyle(fontSize: 22)),
                            const SizedBox(height: 6),
                            Text(
                              mood['name']!,
                              style: GoogleFonts.poppins(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: isSelected ? AppTheme.gold : AppTheme.textPrimary,
                              ),
                            ),
                            Text(
                              mood['hindi']!,
                              style: GoogleFonts.notoSansDevanagari(
                                fontSize: 11,
                                color: AppTheme.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),

              // Wake-up Time Selector
              GestureDetector(
                onTap: _pickTime,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: AppTheme.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.border),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Daily Wake-Up Time',
                            style: GoogleFonts.poppins(
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          Text(
                            'Wisdom rotates 30 mins (Wake-up to 10 PM)',
                            style: GoogleFonts.poppins(
                              fontSize: 11,
                              color: AppTheme.textMuted,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppTheme.background,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppTheme.gold.withValues(alpha: 0.4)),
                        ),
                        child: Text(
                          _selectedWakeTime.format(context),
                          style: GoogleFonts.poppins(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.gold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Begin Journey Button
              SizedBox(
                width: double.infinity,
                height: 54,
                child: ElevatedButton(
                  onPressed: _onComplete,
                  child: Text(
                    'Begin My Journey',
                    style: GoogleFonts.poppins(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
