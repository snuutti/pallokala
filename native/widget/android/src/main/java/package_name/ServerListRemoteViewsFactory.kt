package package_name

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.util.Log
import android.view.View
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import com.bastiaanjansen.otp.TOTPGenerator
import package_name.dto.ServerStatsResponse
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
        var widgetAccount: BaseAccount?

        runBlocking {
            val accountId = WidgetSharedPrefsUtil.loadWidgetPrefs(context, appWidgetId)
            val account = accountStore.getAccount(context, accountId)
            widgetAccount = account
            if (account == null) {
                Log.e("ServerListWidget", "Failed to get account")
                return@runBlocking
            }

            val apiClient = PufferPanelApiClient(account.serverAddress)
            var loginSuccess = false

            when (account) {
                is EmailAccount -> {
                    val result = apiClient.login(account.email, account.password)
                    when (result) {
                        PufferPanelApiClient.LoginResult.SUCCESS -> {
                            loginSuccess = true
                        }
                        PufferPanelApiClient.LoginResult.FAILED -> {
                            loginSuccess = false
                        }
                        PufferPanelApiClient.LoginResult.OTP_REQUIRED -> {
                            if (account.otpSecret == null) {
                                Log.e("ServerListWidget", "OTP required but no secret")
                                return@runBlocking
                            }

                            try {
                                val code = TOTPGenerator.Builder(account.otpSecret).build().now()
                                loginSuccess = apiClient.loginOtp(code)
                            } catch (e: Exception) {
                                Log.e("ServerListWidget", "Failed to generate OTP")
                            }
                        }
                    }
                }
                is OAuthAccount -> {
                    loginSuccess = apiClient.oauth(account.clientId, account.clientSecret)
                }
            }

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

                var stats: ServerStatsResponse? = null
                if (status == ServerStatus.ONLINE) {
                    stats = apiClient.getServerStats(server.id)//TODO: check perms
                }

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

        if (widgetAccount != null) {
            views.setTextViewText(R.id.company_name, widgetAccount!!.nickname)
        } else {
            views.setTextViewText(R.id.company_name,
                context.getString(R.string.server_list_company_name_placeholder))
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
                    ServerStatus.OFFLINE -> R.drawable.pk_stop_circle_widget
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