package package_name

import android.content.Context
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
                var status = ServerStatus.OFFLINE
                if (server.canGetStatus) {
                    status = apiClient.getServerStatus(server.id)?.let {
                        when {
                            it.installing -> ServerStatus.INSTALLING
                            it.running -> ServerStatus.ONLINE
                            else -> ServerStatus.OFFLINE
                        }
                    } ?: ServerStatus.OFFLINE
                }

                val stats = apiClient.getServerStats(server.id)//TODO: check perms
                val formattedMemory = formatMemory(stats?.memory ?: 0.0f)

                serverList.add(
                    Server(
                        server.id,
                        server.name,
                        status,
                        (stats?.cpu ?: 0.0f).toInt(),
                        formattedMemory
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
        views.setTextViewText(R.id.server_details, "CPU: ${server.cpu}% | RAM: ${server.memory}")
        views.setImageViewResource(R.id.server_status,
            when (server.status) {
                ServerStatus.INSTALLING -> R.drawable.pk_package_down
                ServerStatus.ONLINE -> R.drawable.pk_play_circle
                ServerStatus.OFFLINE -> R.drawable.pk_stop_circle
            }
        )

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