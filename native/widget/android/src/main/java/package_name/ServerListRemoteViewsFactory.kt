package package_name

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.util.Log
import android.view.View
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import kotlinx.coroutines.runBlocking
import java.util.Locale

class ServerListRemoteViewsFactory(private val context: Context, private val intent: Intent): RemoteViewsService.RemoteViewsFactory {

    private var appWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID
    private val serverList = mutableListOf<Server>()
    private val accountStore = AccountStore()

    override fun onCreate() {
        appWidgetId = intent.extras?.getInt(
            AppWidgetManager.EXTRA_APPWIDGET_ID,
            AppWidgetManager.INVALID_APPWIDGET_ID
        ) ?: AppWidgetManager.INVALID_APPWIDGET_ID
    }

    override fun onDataSetChanged() {
        serverList.clear()
        var loadSuccess = false

        runBlocking {
            val accountId = WidgetSharedPrefsUtil.loadWidgetPrefs(context, appWidgetId)
            val account = accountStore.getAccount(context, accountId)
            if (account == null) {
                Log.e("ServerListWidget", "Failed to get account")
                return@runBlocking
            }

            val apiClient = PufferPanelApiClient(account.serverAddress)
            val emailAccount = account as EmailAccount// TODO: support oauth accounts, otp

            val loginSuccess = apiClient.login(emailAccount.email, emailAccount.password)
            if (!loginSuccess) {
                Log.e("ServerListWidget", "Failed to login")
                return@runBlocking
            }

            val servers = apiClient.getServers() ?: return@runBlocking
            servers.forEach { server ->
                var status: ServerStatus? = null
                if (server.canGetStatus == true) {
                    status = apiClient.getServerStatus(server.id)?.let {
                        when {
                            it.installing -> ServerStatus.INSTALLING
                            it.running -> ServerStatus.ONLINE
                            else -> ServerStatus.OFFLINE
                        }
                    }
                }

                val stats = apiClient.getServerStats(server.id)//TODO: check perms

                serverList.add(
                    Server(
                        server.id,
                        server.name,
                        status,
                        stats?.cpu?.toInt(),
                        stats?.memory?.let { formatMemory(it) }
                    )
                )
            }

            loadSuccess = true
        }

        val appWidgetManager = AppWidgetManager.getInstance(context)
        val componentName = ComponentName(context, ServerListWidget::class.java)
        val views = RemoteViews(context.packageName, R.layout.server_list_widget)

        if (loadSuccess) {
            views.setViewVisibility(R.id.server_list, View.VISIBLE)
            views.setViewVisibility(R.id.error_message, View.GONE)
        } else {
            views.setViewVisibility(R.id.server_list, View.GONE)
            views.setViewVisibility(R.id.error_message, View.VISIBLE)
        }

        appWidgetManager.updateAppWidget(componentName, views)
    }

    override fun onDestroy() {
    }

    override fun getCount(): Int {
        return serverList.size
    }

    override fun getViewAt(position: Int): RemoteViews {
        val server = serverList[position]

        val views = RemoteViews(context.packageName, R.layout.server_entry)
        views.setTextViewText(R.id.server_name, server.name)

        if (server.cpu != null && server.memory != null) {
            views.setTextViewText(R.id.server_details,
                context.getString(R.string.server_list_server_status, server.cpu, server.memory))
        } else {
            views.setTextViewText(R.id.server_details, "")
        }

        if (server.status != null) {
            views.setViewVisibility(R.id.server_status, View.VISIBLE)
            views.setImageViewResource(
                R.id.server_status,
                when (server.status) {
                    ServerStatus.INSTALLING -> R.drawable.pk_package_down
                    ServerStatus.ONLINE -> R.drawable.pk_play_circle
                    ServerStatus.OFFLINE -> R.drawable.pk_stop_circle
                }
            )
        } else {
            views.setViewVisibility(R.id.server_status, View.GONE)
        }

        return views
    }

    override fun getLoadingView(): RemoteViews? {
        return null
    }

    override fun getViewTypeCount(): Int {
        return 1
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    override fun hasStableIds(): Boolean {
        return true
    }

    private fun formatMemory(bytes: Float): String {
        val units = arrayOf("B", "KiB", "MiB", "GiB", "TiB")
        var value = bytes
        var unitIndex = 0

        while (value >= 1024 && unitIndex < units.lastIndex) {
            value /= 1024
            unitIndex++
        }

        return String.format(Locale.ROOT, "%.1f %s", value, units[unitIndex])
    }

}