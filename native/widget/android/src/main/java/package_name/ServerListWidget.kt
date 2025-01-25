package package_name

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews

class ServerListWidget : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        appWidgetIds.forEach { appWidgetId ->
            val views = RemoteViews(context.packageName, R.layout.server_list_widget)

            val intent = Intent(context, ServerListService::class.java).apply {
                putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
                data = android.net.Uri.parse(this.toUri(Intent.URI_INTENT_SCHEME))
            }

            views.setRemoteAdapter(R.id.server_list, intent)
            views.setEmptyView(R.id.server_list, R.id.no_servers_message)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }

}