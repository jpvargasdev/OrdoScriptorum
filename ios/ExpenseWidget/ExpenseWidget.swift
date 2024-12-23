import WidgetKit
import SwiftUI

struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date())
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
        SimpleEntry(date: Date())
    }

    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        let currentDate = Date()
        let entry = SimpleEntry(date: currentDate)
        let timeline = Timeline(entries: [entry], policy: .atEnd)
        return timeline
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
}

struct ExpenseWidgetEntryView: View {
    var entry: Provider.Entry

    var body: some View {
        ZStack {
          VStack {
            Image(uiImage: UIImage(named: "badge.png") ?? UIImage())
              .resizable()
              .scaledToFit()
              .frame(width: 50, height: 50)
            HStack {
              Image(systemName: "plus.circle")
                .resizable()
                .scaledToFit()
                .frame(width: 30, height: 30)
                .foregroundColor(.white)
              
              Text("Add Record")
                .font(.headline)
                .foregroundColor(.white)
                .padding(.top, 5)
                .multilineTextAlignment(.center)
            }
          }
        }
        .containerBackground(for: .widget) {
          Color(UIColor(red: 171 / 255.0, green: 187 / 255.0, blue: 190 / 255.0, alpha: 1.0))
        }
        .widgetURL(URL(string: "myapp://open"))

    }
}

struct ExpenseWidget: Widget {
    let kind: String = "ExpenseWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            ExpenseWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Add Record")
        .description("Add a record in a blazing fast way.")
        .supportedFamilies([.systemSmall]) // Small widget only
    }
}

#Preview(as: .systemSmall) {
    ExpenseWidget()
} timeline: {
    SimpleEntry(date: .now)
}
