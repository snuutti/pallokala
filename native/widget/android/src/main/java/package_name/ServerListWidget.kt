package package_name

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import android.widget.Toast

class ServerListWidget : AppWidgetProvider() {

    companion object {

        const val ACTION_REFRESH = "${BuildConfig.APPLICATION_ID}.ACTION_WIDGET_REFRESH"

        internal fun refreshWidget(context: Context, appWidgetId: Int) {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetId, R.id.server_list)
        }

    }

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

            val refreshIntent = Intent(context, ServerListWidget::class.java).apply {
                action = ACTION_REFRESH
                putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
            }

            val refreshPendingIntent = PendingIntent.getBroadcast(
                context,
                appWidgetId,
                refreshIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            views.setOnClickPendingIntent(R.id.refresh_icon, refreshPendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)

        if (intent.action == ACTION_REFRESH) {
            val appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID)

            if (appWidgetId != AppWidgetManager.INVALID_APPWIDGET_ID) {
                refreshWidget(context, appWidgetId)
                Toast.makeText(context, R.string.server_list_refreshing_text, Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDeleted(context: Context, appWidgetIds: IntArray) {
        appWidgetIds.forEach { appWidgetId ->
            WidgetSharedPrefsUtil.deleteWidgetPrefs(context, appWidgetId)
        }
    }

}