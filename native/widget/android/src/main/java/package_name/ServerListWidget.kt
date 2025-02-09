package package_name

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log
import android.widget.RemoteViews
import android.widget.Toast
import kotlinx.coroutines.runBlocking

class ServerListWidget : AppWidgetProvider() {

    companion object {

        const val ACTION_REFRESH = "${BuildConfig.APPLICATION_ID}.ACTION_WIDGET_REFRESH"

        const val ACTION_BACKGROUND_REFRESH = "${BuildConfig.APPLICATION_ID}.ACTION_BACKGROUND_REFRESH"

        internal fun refreshWidget(context: Context, appWidgetId: Int) {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetId, R.id.server_list)

            runBlocking {
                updateWidgetFields(context, appWidgetId)
            }
        }

        private suspend fun updateWidgetFields(context: Context, appWidgetId: Int) {
            val views = RemoteViews(context.packageName, R.layout.server_list_widget)

            val accountStore = AccountStore()
            val accountId = WidgetSharedPrefsUtil.loadWidgetPrefs(context, appWidgetId)
            val account = accountStore.getAccount(context, accountId)
            if (account != null) {
                views.setTextViewText(R.id.company_name, account.nickname)
            } else {
                views.setTextViewText(R.id.company_name,
                    context.getString(R.string.server_list_company_name_placeholder))
            }

            val appWidgetManager = AppWidgetManager.getInstance(context)
            appWidgetManager.partiallyUpdateAppWidget(appWidgetId, views)
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
                data = Uri.parse(this.toUri(Intent.URI_INTENT_SCHEME))
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

        scheduleWidgetUpdate(context)
    }

    override fun onEnabled(context: Context) {
        super.onEnabled(context)
        scheduleWidgetUpdate(context)
    }

    override fun onDisabled(context: Context) {
        super.onDisabled(context)
        cancelWidgetUpdate(context)
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)

        if (intent.action == ACTION_REFRESH) {
            val appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID)
            if (appWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
                return
            }

            Log.d("ServerListWidget", "Manual refresh widget $appWidgetId")

            refreshWidget(context, appWidgetId)

            Toast.makeText(
                context,
                R.string.server_list_refreshing_text,
                Toast.LENGTH_SHORT
            ).show()
        } else if (intent.action == ACTION_BACKGROUND_REFRESH) {
            Log.d("ServerListWidget", "Background refresh")

            scheduleWidgetUpdate(context)

            val appWidgetManager = AppWidgetManager.getInstance(context)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(ComponentName(context, ServerListWidget::class.java))

            appWidgetIds.forEach { appWidgetId ->
                refreshWidget(context, appWidgetId)
            }
        }
    }

    override fun onDeleted(context: Context, appWidgetIds: IntArray) {
        appWidgetIds.forEach { appWidgetId ->
            WidgetSharedPrefsUtil.deleteWidgetPrefs(context, appWidgetId)
        }
    }

    private fun scheduleWidgetUpdate(context: Context) {
        Log.d("ServerListWidget", "Scheduling widget update")

        val alarm = AppWidgetAlarm(
            context,
            ServerListWidget::class.java,
            ACTION_BACKGROUND_REFRESH,
            1000 * 60 * 5
        )

        alarm.startAlarm()
    }

    private fun cancelWidgetUpdate(context: Context) {
        Log.d("ServerListWidget", "Cancelling widget update")

        val alarm = AppWidgetAlarm(
            context,
            ServerListWidget::class.java,
            ACTION_BACKGROUND_REFRESH,
            1000 * 60 * 5
        )

        alarm.stopAlarm()
    }

}