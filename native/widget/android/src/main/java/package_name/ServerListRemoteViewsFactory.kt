package package_name

import android.appwidget.AppWidgetManager
import android.content.Context
import android.content.Intent
import android.util.Log
import android.view.View
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import com.bastiaanjansen.otp.TOTPGenerator
import package_name.dto.ServerStatsResponse
import kotlinx.coroutines.runBlocking

class ServerListRemoteViewsFactory(private val context: Context, private val intent: Intent): RemoteViewsService.RemoteViewsFactory {

    private var appWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID
    private val accountStore = AccountStore()
    private var loadState: LoadState = LoadState.Loading

    sealed class LoadState {

        data object Loading : LoadState()

        data class Loaded(val servers: List<Server>, val updatedAt: Long) : LoadState()

        data class Error(val message: String) : LoadState()

    }

    override fun onCreate() {
        appWidgetId = intent.extras?.getInt(
            AppWidgetManager.EXTRA_APPWIDGET_ID,
            AppWidgetManager.INVALID_APPWIDGET_ID
        ) ?: AppWidgetManager.INVALID_APPWIDGET_ID
    }

    override fun onDataSetChanged() {
        runBlocking {
            fetchData()
        }
    }

    private suspend fun fetchData() {
        loadState = LoadState.Loading

        val accountId = WidgetSharedPrefsUtil.loadWidgetPrefs(context, appWidgetId)
        val account = accountStore.getAccount(context, accountId)
        if (account == null) {
            Log.w("ServerListWidget", "Account was null")
            loadState = LoadState.Error(context.getString(R.string.server_list_account_null))
            return
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
                            Log.w("ServerListWidget", "OTP required but no secret saved")
                            loadState = LoadState.Error(context.getString(R.string.server_list_account_otp))
                            return
                        }

                        try {
                            val code = TOTPGenerator.Builder(account.otpSecret).build().now()
                            loginSuccess = apiClient.loginOtp(code)
                        } catch (e: Exception) {
                            Log.e("ServerListWidget", "Failed to generate OTP", e)
                            loadState = LoadState.Error(context.getString(R.string.server_list_account_otp_error))
                            return
                        }
                    }
                }
            }
            is OAuthAccount -> {
                loginSuccess = apiClient.oauth(account.clientId, account.clientSecret)
            }
        }

        if (!loginSuccess) {
            Log.w("ServerListWidget", "Failed to login")
            loadState = LoadState.Error(context.getString(R.string.server_list_account_invalid_credentials))
            return
        }

        val servers = apiClient.getServers() ?: return
        val serverList = mutableListOf<Server>()
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
                    stats?.memory?.let { WidgetUtils.formatMemory(it) }
                )
            )
        }

        loadState = LoadState.Loaded(serverList, System.currentTimeMillis())
        Log.d("ServerListWidget", "Loaded ${serverList.size} servers")
    }

    override fun onDestroy() {
    }

    override fun getCount(): Int {
        return when (loadState) {
            is LoadState.Loading -> 1
            is LoadState.Loaded -> {
                val count = (loadState as LoadState.Loaded).servers.size
                if (count == 0) 0 else count + 1
            }
            is LoadState.Error -> 1
        }
    }

    override fun getViewAt(position: Int): RemoteViews {
        return when (loadState) {
            is LoadState.Loading -> {
                loadingView
            }
            is LoadState.Loaded -> {
                val servers = (loadState as LoadState.Loaded).servers
                if (position == servers.size) {
                    return getUpdatedAtView()
                }

                return getServerView(servers[position])
            }
            is LoadState.Error -> {
                getErrorView(loadState as LoadState.Error)
            }
        }
    }

    private fun getUpdatedAtView(): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.server_list_widget_updated)
        views.setTextViewText(
            R.id.updated_at_message,
            context.getString(R.string.server_list_updated_at_text,
                WidgetUtils.formatDate((loadState as LoadState.Loaded).updatedAt))
        )

        return views
    }

    private fun getServerView(server: Server): RemoteViews {
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

    private fun getErrorView(loadState: LoadState.Error): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.server_list_widget_error)
        views.setTextViewText(R.id.error_message, loadState.message)
        return views
    }

    override fun getLoadingView(): RemoteViews {
        return RemoteViews(context.packageName, R.layout.server_list_widget_loading)
    }

    override fun getViewTypeCount(): Int {
        return 3
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    override fun hasStableIds(): Boolean {
        return true
    }

}