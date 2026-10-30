import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/storage_service.dart';
import '../../theme/app_theme.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late bool _showSanskrit;

  @override
  void initState() {
    super.initState();
    _showSanskrit = StorageService.instance.settings.showSanskrit;
  }

  void _toggleSanskrit(bool value) async {
    setState(() => _showSanskrit = value);
    final settings = StorageService.instance.settings;
    settings.showSanskrit = value;
    await StorageService.instance.saveSettings(settings);
  }

  @override
  Widget build(BuildContext context) {
    final settings = StorageService.instance.settings;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: Text(
          'Settings & Preferences',
          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        children: [
          // Section: Content
          _buildSectionHeader('CONTENT PREFERENCES'),
          Container(
            decoration: BoxDecoration(
              color: AppTheme.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.border),
            ),
            child: Column(
              children: [
                SwitchListTile(
                  activeThumbColor: AppTheme.gold,
                  title: Text(
                    'Show Original Sanskrit / Awadhi Verse',
                    style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.textPrimary),
                  ),
                  subtitle: Text(
                    'Default is simplified modern Hindi translation',
                    style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.textMuted),
                  ),
                  value: _showSanskrit,
                  onChanged: _toggleSanskrit,
                ),
                const Divider(height: 1, color: AppTheme.border),
                ListTile(
                  title: Text(
                    'Active Emotional Focus',
                    style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.textPrimary),
                  ),
                  subtitle: Text(
                    settings.activeMood.toUpperCase(),
                    style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.gold),
                  ),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: AppTheme.textMuted),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Section: Schedule & Lockscreen
          _buildSectionHeader('LOCKSCREEN & REFRESH SCHEDULE'),
          Container(
            decoration: BoxDecoration(
              color: AppTheme.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.border),
            ),
            child: Column(
              children: [
                ListTile(
                  title: Text(
                    'Auto-Refresh Interval',
                    style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.textPrimary),
                  ),
                  trailing: Text(
                    '30 Minutes',
                    style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.gold, fontWeight: FontWeight.w600),
                  ),
                ),
                const Divider(height: 1, color: AppTheme.border),
                ListTile(
                  title: Text(
                    'Active Schedule Window',
                    style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.textPrimary),
                  ),
                  subtitle: Text(
                    'Starts at ${settings.wakeUpTime} AM & sleeps at 10:00 PM',
                    style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.textMuted),
                  ),
                  trailing: const Icon(Icons.bedtime_outlined, size: 18, color: AppTheme.gold),
                ),
                const Divider(height: 1, color: AppTheme.border),
                ListTile(
                  title: Text(
                    'Battery Optimization Whitelist',
                    style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.textPrimary),
                  ),
                  subtitle: Text(
                    'Ensures Android does not kill background rotation',
                    style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.textMuted),
                  ),
                  trailing: const Icon(Icons.battery_charging_full, size: 18, color: Color(0xFF10B981)),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        backgroundColor: AppTheme.surface,
                        content: Text(
                          'Background WorkManager runs 100% locally with zero internet drain.',
                          style: GoogleFonts.poppins(color: AppTheme.gold, fontSize: 12),
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Section: About
          _buildSectionHeader('ABOUT SUTRA'),
          Container(
            decoration: BoxDecoration(
              color: AppTheme.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.border),
            ),
            child: Column(
              children: [
                ListTile(
                  title: Text('App Version', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.textPrimary)),
                  trailing: Text('1.0.0 (Build 1)', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.textMuted)),
                ),
                const Divider(height: 1, color: AppTheme.border),
                ListTile(
                  title: Text('Firebase Backend Project', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.textPrimary)),
                  trailing: Text('daily-slok', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.gold)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4.0, bottom: 8.0),
      child: Text(
        title,
        style: GoogleFonts.poppins(
          fontSize: 11,
          letterSpacing: 1.5,
          fontWeight: FontWeight.w600,
          color: AppTheme.gold,
        ),
      ),
    );
  }
}
