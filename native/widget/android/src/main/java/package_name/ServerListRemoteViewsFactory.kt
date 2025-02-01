package package_name

import android.content.Context
import android.view.View
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import kotlinx.coroutines.runBlocking
import java.util.Locale

class ServerListRemoteViewsFactory(private val context: Context): RemoteViewsService.RemoteViewsFactory {

    private val serverList = mutableListOf<Server>()
    private val apiClient = PufferPanelApiClient("https://xxx")

    override fun onCreate() {
    }

    override fun onDataSetChanged() {
        serverList.clear()

        runBlocking {
            val loginSuccess = apiClient.login("testacc@company.com", "testing")
            if (!loginSuccess) {
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
        }
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