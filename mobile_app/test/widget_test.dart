import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/main.dart';

void main() {
  testWidgets('SutraApp initialization smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    expect(const SutraApp(), isNotNull);
  });
}
