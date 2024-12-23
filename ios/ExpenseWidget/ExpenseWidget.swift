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
              VStack(spacing: 0) { // Reduced spacing between elements
                  // App badge image
                  Image(uiImage: UIImage(named: "badge.png") ?? UIImage())
                      .resizable()
                      .scaledToFit()
                      .frame(width: 60, height: 60) // Slightly larger badge

                  // Icon and text in horizontal layout
                HStack(spacing: 0) {
                      // Plus icon
                      Image(systemName: "plus.circle")
                          .resizable()
                          .scaledToFit()
                          .frame(width: 40, height: 40) // Increased size for the plus icon
                          .foregroundColor(.white)

                      Spacer()
                      // Add Record text
                      Text("Add Record")
                          .font(.headline)
                          .foregroundColor(.white)
      
                  }
                  .padding(.horizontal, 5) // Smaller horizontal padding
              }
              .padding(5) // Smaller padding for the overall view
          }
          .containerBackground(for: .widget) {
            Color(UIColor(red: 171 / 255.0, green: 187 / 255.0, blue: 190 / 255.0, alpha: 1.0))
          }
          .widgetURL(URL(string: "myapp://new-transaction"))
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
