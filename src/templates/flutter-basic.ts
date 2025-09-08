/**
 * قالب Flutter أساسي محلي
 * يوفر بنية أساسية لتطبيق Flutter
 */

export const FLUTTER_BASIC_TEMPLATE = {
  name: 'Flutter Basic',
  description: 'Basic Flutter app template with essential structure',
  files: [
    {
      name: 'pubspec.yaml',
      path: 'pubspec.yaml',
      content: `name: my_flutter_app
description: A new Flutter project created with CodeLaunch

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0

flutter:
  uses-material-design: true
`,
    },
    {
      name: 'main.dart',
      path: 'lib/main.dart',
      content: `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
`,
    },
    {
      name: 'README.md',
      path: 'README.md',
      content: `# Flutter App

A new Flutter project created with CodeLaunch.

## Getting Started

This project is a starting point for a Flutter application.

### Prerequisites

- Flutter SDK (3.0.0 or higher)
- Dart SDK
- Android Studio / VS Code
- Android SDK (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Make sure Flutter is installed on your system
2. Run \`flutter doctor\` to verify your setup
3. Install dependencies:
   \`\`\`bash
   flutter pub get
   \`\`\`

### Running the App

To run the app on a connected device or emulator:

\`\`\`bash
flutter run
\`\`\`

### Building for Production

For Android:
\`\`\`bash
flutter build apk
\`\`\`

For iOS:
\`\`\`bash
flutter build ios
\`\`\`

## Project Structure

\`\`\`
lib/
├── main.dart          # Entry point of the application
└── ...                # Add your additional Dart files here

pubspec.yaml           # Project dependencies and metadata
README.md             # This file
\`\`\`

## Resources

- [Flutter Documentation](https://docs.flutter.dev/)
- [Dart Documentation](https://dart.dev/guides)
- [Flutter Samples](https://flutter.github.io/samples/)

## License

This project is open source and available under the [MIT License](LICENSE).
`,
    },
    {
      name: 'analysis_options.yaml',
      path: 'analysis_options.yaml',
      content: `# This file configures the analyzer, which statically analyzes Dart code to
# check for errors, warnings, and lints.
#
# The issues identified by the analyzer are surfaced in the UI of Dart-enabled
# IDEs (https://dart.dev/tools#ides-and-editors). The analyzer can also be
# invoked from the command line by running \`flutter analyze\`.

# The following line activates a set of recommended lints for Flutter apps,
# packages, and plugins designed to encourage good coding practices.
include: package:flutter_lints/flutter.yaml

linter:
  # The lint rules applied to this project can be customized in the
  # section below to disable rules from the \`package:flutter_lints/flutter.yaml\`
  # included above or to enable additional rules. A list of all available lints
  # and their documentation is published at
  # https://dart-lang.github.io/linter/lints/index.html.
  #
  # Instead of disabling a lint rule for the entire project in the
  # section below, it can also be suppressed for a single line of code
  # or a specific dart file by using the \`// ignore: name_of_lint\` and
  # \`// ignore_for_file: name_of_lint\` syntax on the line or in the file
  # producing the lint.
  rules:
    # avoid_print: false  # Uncomment to disable the \`avoid_print\` rule
    # prefer_single_quotes: true  # Uncomment to enable the \`prefer_single_quotes\` rule
`,
    },
  ],
};
