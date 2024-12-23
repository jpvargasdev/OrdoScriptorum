//
//  AppIntent.swift
//  ExpenseWidget
//
//  Created by Juan Vargas on 2024-12-23.
//

import WidgetKit
import AppIntents

struct ConfigurationAppIntent: WidgetConfigurationIntent {
    static var title: LocalizedStringResource { "Configuration" }
    static var description: IntentDescription { "Budgets configuration" }
}
